$(function () {
  var formAttempted = false;
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
    var selected = $('input[name="tipo_registro"]:checked').val();
    return selected || '';
  }

  function isFieldFilled(field) {
    var $field = $(field);
    if ($field.attr('type') === 'radio') {
      var group = $field.attr('name');
      return $('input[name="' + group + '"]:checked').length > 0;
    }
    return ($field.val() || '').toString().trim().length > 0;
  }

  function validateField(field, force) {
    var $field = $(field);
    var isRequired = $field.hasClass('js-required');
    if (!isRequired) {
      return true;
    }

    var group = $field.data('group');
    if (group) {
      var groupFilled = $('input[name="' + group + '"]:checked').length > 0;
      $field.closest('.js-radio-group').toggleClass('is-invalid', force && !groupFilled);
      return groupFilled;
    }

    var filled = isFieldFilled(field);
    if (force) {
      $field.toggleClass('is-invalid', !filled);
    }
    return filled;
  }

  function validateScope(scope, force) {
    var isValid = true;
    $('.js-required[data-scope="' + scope + '"]').each(function () {
      if (!validateField(this, force)) {
        isValid = false;
      }
    });
    return isValid;
  }

  function updateTabsState() {
    var basicValid = validateScope('basic', formAttempted);
    var tipo = getSelectedTipo();

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
      if ((activeTab === 'inseguras' && tipo !== 'insegura') || (activeTab === 'seguras' && tipo !== 'segura')) {
        activateTab('basicos');
      }
    }
  }

  function updateAddButton() {
    var basicValid = validateScope('basic', formAttempted);
    var tipo = getSelectedTipo();
    var otherValid = false;

    if (tipo === 'insegura') {
      otherValid = validateScope('unsafe', formAttempted);
    } else if (tipo === 'segura') {
      otherValid = validateScope('safe', formAttempted);
    }

    $addButton.prop('disabled', !(basicValid && otherValid));
  }

  function resetForm() {
    $('#poc-form')[0].reset();
    $('.js-required').removeClass('is-invalid');
    $('#lista-praticas .list-group-item').removeClass('active');
    $('#praticaSelecionada').val('');
    formAttempted = false;
    setTabEnabled('inseguras', false);
    setTabEnabled('seguras', false);
    activateTab('basicos');
    updateAddButton();
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
    $('#praticaSelecionada').val($(this).data('value'));
    validateField(document.getElementById('praticaSelecionada'), true);
    updateAddButton();
  });

  $('.js-required').on('blur', function () {
    validateField(this, true);
    updateTabsState();
    updateAddButton();
  });

  $('.js-required').on('change keyup', function () {
    if (formAttempted) {
      validateField(this, true);
    }
    updateTabsState();
    updateAddButton();
  });

  $('#btn-cancelar').on('click', function () {
    resetForm();
  });

  $('#btn-adicionar').on('click', function () {
    formAttempted = true;
    var basicValid = validateScope('basic', true);
    var tipo = getSelectedTipo();
    var otherValid = tipo === 'insegura' ? validateScope('unsafe', true) : validateScope('safe', true);

    updateTabsState();
    updateAddButton();

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
  updateAddButton();
});
