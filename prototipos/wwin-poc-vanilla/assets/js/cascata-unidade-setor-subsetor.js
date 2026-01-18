/*
  Exemplo de inclusão no HTML:
  <select id="unidade" required></select>
  <select id="setor" required></select>
  <select id="subsetor" required></select>
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

function fillSelect(select, items, placeholder) {
  const safeItems = Array.isArray(items) ? items : [];
  const safePlaceholder = placeholder || PLACEHOLDER;

  select.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = safePlaceholder;
  select.appendChild(placeholderOption);

  safeItems.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function resetSelect(select, placeholder) {
  fillSelect(select, [], placeholder);
}

/* =========================
 * EVENTOS
 * ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const unidadeSelect = document.getElementById("unidade");
  const setorSelect = document.getElementById("setor");
  const subsetorSelect = document.getElementById("subsetor");

  if (!unidadeSelect || !setorSelect || !subsetorSelect) {
    return;
  }

  const updateSetores = () => {
    const unitMap = resolveUnitMap(unidadeSelect.value);
    const setores = unitMap ? Object.keys(unitMap) : [];
    fillSelect(setorSelect, setores, PLACEHOLDER);
    resetSelect(subsetorSelect, PLACEHOLDER);
  };

  const updateSubsetores = () => {
    const unitMap = resolveUnitMap(unidadeSelect.value);
    const subsetores = unitMap && unitMap[setorSelect.value] ? unitMap[setorSelect.value] : [];
    fillSelect(subsetorSelect, subsetores, PLACEHOLDER);
  };

  unidadeSelect.addEventListener("change", updateSetores);
  setorSelect.addEventListener("change", updateSubsetores);

  /* =========================
   * INIT
   * ========================= */
  (() => {
    const unidadeAtual = unidadeSelect.value;
    const setorAtual = setorSelect.value;
    const subsetorAtual = subsetorSelect.value;

    if (!unidadeAtual) {
      resetSelect(setorSelect, PLACEHOLDER);
      resetSelect(subsetorSelect, PLACEHOLDER);
      return;
    }

    const unitMap = resolveUnitMap(unidadeAtual);
    const setores = unitMap ? Object.keys(unitMap) : [];
    fillSelect(setorSelect, setores, PLACEHOLDER);

    if (setorAtual && unitMap && unitMap[setorAtual]) {
      setorSelect.value = setorAtual;
      const subsetores = unitMap[setorAtual];
      fillSelect(subsetorSelect, subsetores, PLACEHOLDER);

      if (subsetorAtual && subsetores.includes(subsetorAtual)) {
        subsetorSelect.value = subsetorAtual;
      }
    } else {
      resetSelect(subsetorSelect, PLACEHOLDER);
    }
  })();
});
