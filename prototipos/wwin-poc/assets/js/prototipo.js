$(function () {
  var $tabs = $('#pocTabs .nav-link');
  var $addButton = $('#btn-adicionar');
  var $modal = $('#modal-sucesso');

  function activateTab(targetId) {
    $tabs.removeClass('active');
    $('.tab-pane').removeClass('active');
    $('#pocTabs .nav-link[data-tab="' + targetId + '"]').addClass('active');
    $('#tab-' + targetId).addClass('active');
  }

  function setTabEnabled(tabKey, enabled) {
    var $tab = $('#pocTabs .nav-link[data-tab="' + tabKey + '"]');
    $tab.toggleClass('tab-disabled', !enabled);
    $tab.attr('aria-disabled', enabled ? 'false' : 'true');
  }

  function getSelectedTipo() {
    return $('input[name="tipo_registro"]:checked').val() || '';
  }

  function isFieldFilled($field) {
    if ($field.attr('type') === 'radio') {
      var group = $field.attr('name');
      return $('input[name="' + group + '"]:checked').length > 0;
    }
    if ($field.attr('type') === 'number') {
      return Number($field.val()) > 0;
    }
    return ($field.val() || '').toString().trim().length > 0;
  }

  function markTouched($field) {
    $field.data('touched', 'true');
  }

  function isTouched($field) {
    return $field.data('touched') === 'true';
  }

  function validateField($field, showInvalid) {
    var group = $field.data('group');
    if (group) {
      var groupFilled = $('input[name="' + group + '"]:checked').length > 0;
      if (showInvalid) {
        $field.closest('.js-radio-group').toggleClass('is-invalid', !groupFilled);
      }
      return groupFilled;
    }

    var filled = isFieldFilled($field);
    if (showInvalid) {
      $field.toggleClass('is-invalid', !filled);
    }
    return filled;
  }

  function validateScope(scope, showInvalid) {
    var valid = true;
    var validatedGroups = {};
    $('.js-required[data-scope="' + scope + '"]').each(function () {
      var $field = $(this);
      var group = $field.data('group');
      if (group) {
        if (validatedGroups[group]) {
          return;
        }
        validatedGroups[group] = true;
      }
      var shouldShow = showInvalid || isTouched($field);
      if (!validateField($field, shouldShow)) {
        valid = false;
      }
    });
    return valid;
  }

  function validateDadosBasicos(showInvalid) {
    return validateScope('basic', showInvalid);
  }

  function validateAbaInsegura(showInvalid) {
    return validateScope('unsafe', showInvalid);
  }

  function validateAbaSegura(showInvalid) {
    return validateScope('safe', showInvalid);
  }

  function updateTabsState() {
    var tipo = getSelectedTipo();
    var basicValid = validateDadosBasicos(false);

    if (basicValid && tipo === 'insegura') {
      setTabEnabled('inseguras', true);
      setTabEnabled('seguras', false);
    } else if (basicValid && tipo === 'segura') {
      setTabEnabled('seguras', true);
      setTabEnabled('inseguras', false);
    } else {
      setTabEnabled('inseguras', false);
      setTabEnabled('seguras', false);
    }

    var activeTab = $('#pocTabs .nav-link.active').data('tab');
    if (activeTab !== 'basicos') {
      if ((activeTab === 'inseguras' && tipo !== 'insegura') || (activeTab === 'seguras' && tipo !== 'segura') || !basicValid) {
        activateTab('basicos');
      }
    }
  }

  function updateAdicionarButton() {
    var basicValid = validateDadosBasicos(false);
    var tipo = getSelectedTipo();
    var otherValid = false;

    if (tipo === 'insegura') {
      otherValid = validateAbaInsegura(false);
    } else if (tipo === 'segura') {
      otherValid = validateAbaSegura(false);
    }

    $addButton.prop('disabled', !(basicValid && otherValid));
  }

  function touchAllRequired() {
    $('.js-required').each(function () {
      markTouched($(this));
    });
  }

  function resetForm() {
    $('#poc-form')[0].reset();
    $('.js-required').removeClass('is-invalid').removeData('touched');
    $('.js-radio-group').removeClass('is-invalid');
    $('#lista-praticas .list-group-item').removeClass('active');
    $('#praticaSelecionada').val('');
    setTabEnabled('inseguras', false);
    setTabEnabled('seguras', false);
    activateTab('basicos');
    updateTabsState();
    updateAdicionarButton();
  }

  $tabs.on('click', function (event) {
    var $tab = $(this);
    if ($tab.hasClass('tab-disabled')) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    activateTab($tab.data('tab'));
  });

  $('#lista-praticas .list-group-item').on('click', function () {
    $('#lista-praticas .list-group-item').removeClass('active');
    $(this).addClass('active');
    var $hidden = $('#praticaSelecionada');
    $hidden.val($(this).data('value'));
    markTouched($hidden);
    validateField($hidden, true);
    updateAdicionarButton();
  });

  $('.js-required').on('blur', function () {
    var $field = $(this);
    markTouched($field);
    validateField($field, true);
    updateTabsState();
    updateAdicionarButton();
  });

  $('.js-required').on('change keyup', function () {
    var $field = $(this);
    if ($field.attr('type') === 'radio') {
      $('input[name="' + $field.attr('name') + '"]').each(function () {
        markTouched($(this));
      });
    } else {
      markTouched($field);
    }
    validateField($field, isTouched($field));
    updateTabsState();
    updateAdicionarButton();
  });

  $('#btn-cancelar').on('click', function () {
    resetForm();
  });

  $('#btn-adicionar').on('click', function () {
    touchAllRequired();
    var basicValid = validateDadosBasicos(true);
    var tipo = getSelectedTipo();
    var otherValid = tipo === 'insegura' ? validateAbaInsegura(true) : validateAbaSegura(true);

    updateTabsState();
    updateAdicionarButton();

    if (basicValid && otherValid) {
      $modal.addClass('show');
      $modal.attr('aria-hidden', 'false');
    }
  });

  $('.close, #btn-fechar-modal').on('click', function () {
    $modal.removeClass('show');
    $modal.attr('aria-hidden', 'true');
    resetForm();
  });

  updateTabsState();
  updateAdicionarButton();
});
