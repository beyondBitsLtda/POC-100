/*
  Exemplo de inclusão no HTML:
  <select id="unidadeSelect" class="form-control"></select>
  <select id="setorSelect" class="form-control"></select>
  <select id="subsetorSelect" class="form-control"></select>
  <script src="assets/js/cascata-unidade-setor-subsetor.js"></script>
*/

/* =========================
 * MAPEAMENTO
 * ========================= */
const MAP = {
  "Vespasiano": {
    "Administrativo": [
      "Comercial",
      "Diretoria",
      "Engenharia de Aplicações e Vendas",
      "Facilites",
      "Financeiro",
      "Gente e Gestão",
      "Gerência de Projetos",
      "Marketing",
      "Pesquisa e Desenvolvimento",
      "SGQ",
      "Suprimentos",
      "TI"
    ],
    "Almoxarifado": [
      "Almoxarifado",
      "Chaparia",
      "Magazine"
    ],
    "Area Externa": [
      "Área Externa",
      "Banker",
      "Estacionamento",
      "FAT",
      "Montagem de Andaimes",
      "Oficina de Excelência Operacional",
      "Sala de Treinamento"
    ],
    "Calderaria": [
      "CD - Centro de Distribuição",
      "Célula A",
      "Célula B",
      "Célula ME",
      "Célula Robotizada",
      "Célula T",
      "Centro Tecnológico Soldagem",
      "Forno"
    ],
    "CQ": [
      "CQ Documental",
      "CQ Fábrica"
    ],
    "Field Service": [
      "Administrativo",
      "Almoxarifado",
      "DOW",
      "Obra Coifa",
      "Saipem Guarujá-SP"
    ],
    "Logística": [
      "Expedição",
      "Operadores de ponte",
      "Serviços Gerais"
    ],
    "Manutenção": [
      "Manutenção",
      "Terceiros"
    ],
    "Montagem de Campo": [
      "Montagem de Estacas"
    ],
    "Montagem Mecanica": [
      "Montagem Mecanica"
    ],
    "Pintura": [
      "Pintura"
    ],
    "Produtivo Indireto": [
      "Engenharia Industrial Usinagem",
      "Engenharia de Calderaria",
      "Engenharia de Materiais e Solda",
      "Engenharia de Usinagem",
      "Engenharia Industrial Mecanica",
      "Excelência Operacional",
      "Gerência da Produção",
      "Melhoria de Manufatura",
      "Metrologia",
      "PCP",
      "SESMT",
      "SGA"
    ],
    "Terceiros": [
      "Clientes Residente",
      "Cliente Visitante",
      "Conservação e Limpeza",
      "Fretamento (Allure)",
      "Portaria",
      "Restaurante",
      "Vigilancia e Portaria"
    ],
    "Usinagem": [
      "Ferramentaria",
      "Leve",
      "Pesada"
    ]
  },
  "Contagem": "Vespasiano",
  "Porto Açu": {
    "Cais": [
      "Montagem/Soldagem"
    ],
    "Galpão Delp Açu": [
      "Administrativo",
      "Área de Produção",
      "Manutenção",
      "Montagem/Mov de Carga",
      "Soldagem"
    ],
    "Montagem Externa": [
      "Jumper Niterói/ Bacalhau"
    ]
  }
};

/* =========================
 * UTILS
 * ========================= */
const PLACEHOLDER = "Selecione";

function resolveUnitMap(unidade) {
  if (!unidade || !MAP[unidade]) {
    return null;
  }

  const entry = MAP[unidade];
  if (typeof entry === "string") {
    return MAP[entry] || null;
  }

  return entry;
}

function fillSelect($select, items, placeholder) {
  const safeItems = Array.isArray(items) ? items : [];
  const safePlaceholder = placeholder || PLACEHOLDER;

  $select.empty();
  $select.append($("<option />", { value: "", text: safePlaceholder }));

  safeItems.forEach(function (item) {
    $select.append($("<option />", { value: item, text: item }));
  });
}

function resetSelect($select, placeholder) {
  fillSelect($select, [], placeholder);
}

/* =========================
 * EVENTOS
 * ========================= */
$(function () {
  const $unidade = $("#unidadeSelect");
  const $setor = $("#setorSelect");
  const $subsetor = $("#subsetorSelect");

  function updateSetores() {
    const unitMap = resolveUnitMap($unidade.val());
    const setores = unitMap ? Object.keys(unitMap) : [];
    fillSelect($setor, setores, PLACEHOLDER);
    resetSelect($subsetor, PLACEHOLDER);
  }

  function updateSubsetores() {
    const unitMap = resolveUnitMap($unidade.val());
    const subsetores = unitMap && unitMap[$setor.val()] ? unitMap[$setor.val()] : [];
    fillSelect($subsetor, subsetores, PLACEHOLDER);
  }

  $unidade.on("change", function () {
    updateSetores();
  });

  $setor.on("change", function () {
    updateSubsetores();
  });

  /* =========================
   * INIT
   * ========================= */
  (function initCascade() {
    const unidadeAtual = $unidade.val();
    const setorAtual = $setor.val();
    const subsetorAtual = $subsetor.val();

    if (!unidadeAtual) {
      resetSelect($setor, PLACEHOLDER);
      resetSelect($subsetor, PLACEHOLDER);
      return;
    }

    const unitMap = resolveUnitMap(unidadeAtual);
    const setores = unitMap ? Object.keys(unitMap) : [];
    fillSelect($setor, setores, PLACEHOLDER);

    if (setorAtual && unitMap && unitMap[setorAtual]) {
      $setor.val(setorAtual);
      const subsetores = unitMap[setorAtual];
      fillSelect($subsetor, subsetores, PLACEHOLDER);

      if (subsetorAtual && subsetores.indexOf(subsetorAtual) !== -1) {
        $subsetor.val(subsetorAtual);
      }
    } else {
      resetSelect($subsetor, PLACEHOLDER);
    }
  })();
});
