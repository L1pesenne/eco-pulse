import type { Discovery, RegionId } from "./types";

export const REGION_META: Record<RegionId, {
  label: string;
  eyebrow: string;
  color: string;
  accent: string;
  description: string;
  terrain: string;
}> = {
  center: {
    label: "Centro",
    eyebrow: "NÚCLEO URBANO",
    color: "#e8c77b",
    accent: "#f4dca3",
    description: "Onde fluxos, pessoas e escolhas de consumo se encontram.",
    terrain: "concreto"
  },
  park: {
    label: "Parque",
    eyebrow: "CORREDOR VERDE",
    color: "#9de36b",
    accent: "#d0ff9f",
    description: "Um respiro coletivo que conecta a cidade à biodiversidade.",
    terrain: "grama"
  },
  river: {
    label: "Rio",
    eyebrow: "BACIA URBANA",
    color: "#72d7d0",
    accent: "#b7fff0",
    description: "A água registra, em silêncio, as decisões tomadas a montante.",
    terrain: "água"
  },
  forest: {
    label: "Floresta",
    eyebrow: "REFÚGIO NATIVO",
    color: "#4eaa78",
    accent: "#a0ec9b",
    description: "Camadas de vida onde cada espécie participa do equilíbrio.",
    terrain: "mata"
  },
  industrial: {
    label: "Zona Industrial",
    eyebrow: "BORDA PRODUTIVA",
    color: "#ef9569",
    accent: "#ffc09b",
    description: "Energia, materiais e oportunidades para uma transição justa.",
    terrain: "metal"
  },
  residential: {
    label: "Bairro Residencial",
    eyebrow: "VIDA COTIDIANA",
    color: "#b3a7ed",
    accent: "#d7d1ff",
    description: "Pequenas rotinas que, somadas, mudam a paisagem.",
    terrain: "bairro"
  }
};

export const REGION_ORDER: RegionId[] = ["center", "park", "river", "forest", "industrial", "residential"];

export const DISCOVERIES: Discovery[] = [
  {
    id: "center-refill",
    region: "center",
    kind: "sustainable",
    title: "Estação de reuso",
    description: "Um ponto comunitário de água potável e refil reduz embalagens de uso único no coração da cidade.",
    impact: "baixo",
    xp: 85,
    position: [-0.8, 0.22, 0.1],
    icon: "◌"
  },
  {
    id: "center-waste",
    region: "center",
    kind: "waste",
    title: "Lixeira transbordando",
    description: "Resíduos fora do contêiner mostram uma falha de coleta e um risco para a drenagem urbana.",
    impact: "médio",
    xp: 70,
    position: [0.65, 0.22, 0.18],
    icon: "✦"
  },
  {
    id: "park-bird",
    region: "park",
    kind: "species",
    title: "Sabiá-laranjeira",
    description: "Registro de uma ave observada entre as copas do corredor verde.",
    impact: "baixo",
    xp: 110,
    position: [-0.35, 0.28, -0.18],
    icon: "⌁",
    isSpecies: true,
    species: {
      name: "Sabiá-laranjeira",
      habitat: "Áreas arborizadas, parques e jardins urbanos.",
      curiosity: "Elemento educativo real: é uma espécie comum em muitas paisagens urbanas brasileiras.",
      rarity: "comum",
      isFictional: false
    }
  },
  {
    id: "park-pollinator",
    region: "park",
    kind: "preservation",
    title: "Jardim de polinizadores",
    description: "Plantas nativas foram reunidas para oferecer abrigo e alimento a insetos polinizadores.",
    impact: "baixo",
    xp: 95,
    position: [0.72, 0.24, 0.32],
    icon: "✺"
  },
  {
    id: "river-plastic",
    region: "river",
    kind: "waste",
    title: "Resíduos na margem",
    description: "Fragmentos de plástico se acumulam numa curva de baixa vazão próxima à ponte.",
    impact: "alto",
    xp: 100,
    position: [-0.7, 0.12, 0.08],
    icon: "≈"
  },
  {
    id: "river-water",
    region: "river",
    kind: "water",
    title: "Água com alteração de cor",
    description: "A coloração observada pede investigação e monitoramento; a origem ainda não foi confirmada.",
    impact: "crítico",
    xp: 130,
    position: [0.45, 0.12, -0.35],
    icon: "◒"
  },
  {
    id: "forest-tapir",
    region: "forest",
    kind: "species",
    title: "Rastro de anta",
    description: "Pegadas sugerem a passagem de um grande mamífero pelo fragmento de mata.",
    impact: "baixo",
    xp: 125,
    position: [-0.4, 0.27, 0.2],
    icon: "⌂",
    isSpecies: true,
    species: {
      name: "Anta do Vale (registro ficcional)",
      habitat: "Fragmentos de floresta conectados por corredores de fauna.",
      curiosity: "Elemento narrativo ficcional criado para a cidade ECO//PULSE; não é um registro zoológico.",
      rarity: "raro",
      isFictional: true
    }
  },
  {
    id: "forest-clearing",
    region: "forest",
    kind: "deforestation",
    title: "Clareira recente",
    description: "Uma abertura na cobertura vegetal interrompe a conexão entre dois trechos de habitat.",
    impact: "alto",
    xp: 115,
    position: [0.58, 0.27, -0.22],
    icon: "⌁"
  },
  {
    id: "industrial-smoke",
    region: "industrial",
    kind: "pollution",
    title: "Pluma acima do galpão",
    description: "Uma pluma persistente foi observada; o registro deve ser encaminhado para verificação técnica.",
    impact: "alto",
    xp: 105,
    position: [-0.62, 0.26, 0.05],
    icon: "∿"
  },
  {
    id: "industrial-solar",
    region: "industrial",
    kind: "sustainable",
    title: "Telhado solar",
    description: "Painéis no telhado da cooperativa sinalizam uma alternativa local para geração de energia.",
    impact: "baixo",
    xp: 90,
    position: [0.52, 0.25, 0.22],
    icon: "☼"
  },
  {
    id: "residential-leak",
    region: "residential",
    kind: "water-waste",
    title: "Vazamento na calçada",
    description: "Uma tubulação rompida desperdiça água e pode danificar o passeio se não for reportada.",
    impact: "médio",
    xp: 75,
    position: [-0.55, 0.22, -0.2],
    icon: "⌇"
  },
  {
    id: "residential-compost",
    region: "residential",
    kind: "sustainable",
    title: "Compostagem de bairro",
    description: "Moradores transformam resíduos orgânicos em adubo para hortas compartilhadas.",
    impact: "baixo",
    xp: 100,
    position: [0.62, 0.24, 0.18],
    icon: "✿"
  }
];

export function getDiscoveriesForRegion(region: RegionId) {
  return DISCOVERIES.filter((discovery) => discovery.region === region);
}
