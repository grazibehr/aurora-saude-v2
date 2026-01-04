// Exercícios de Respiração
export const breathingExercises = [
  {
    id: "box",
    name: "Respiração Quadrada",
    description: "Inspire, segure, expire e segure - cada etapa por 4 segundos",
    steps: [
      { action: "Inspire", duration: 4, color: "bg-blue-500" },
      { action: "Segure", duration: 4, color: "bg-purple-500" },
      { action: "Expire", duration: 4, color: "bg-teal-500" },
      { action: "Segure", duration: 4, color: "bg-indigo-500" },
    ],
    cycles: 4,
    benefits: "Reduz ansiedade e melhora o foco",
  },
  {
    id: "478",
    name: "Técnica 4-7-8",
    description: "Inspire por 4s, segure por 7s e expire por 8s",
    steps: [
      { action: "Inspire", duration: 4, color: "bg-blue-500" },
      { action: "Segure", duration: 7, color: "bg-purple-500" },
      { action: "Expire", duration: 8, color: "bg-teal-500" },
    ],
    cycles: 4,
    benefits: "Ideal para relaxar e dormir melhor",
  },
  {
    id: "calm",
    name: "Respiração Calmante",
    description: "Inspiração curta, expiração longa para acalmar",
    steps: [
      { action: "Inspire", duration: 3, color: "bg-blue-500" },
      { action: "Expire", duration: 6, color: "bg-teal-500" },
    ],
    cycles: 6,
    benefits: "Ativa o sistema nervoso parassimpático",
  },
];

// Exercícios de Alongamento
export const stretchingExercises = [
  {
    id: "neck",
    name: "Alongamento de Pescoço",
    duration: 30,
    instructions: [
      "Incline a cabeça para a direita, segure 15s",
      "Incline para a esquerda, segure 15s",
      "Gire suavemente em círculos",
    ],
    icon: "Brain",
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "shoulders",
    name: "Ombros e Costas",
    duration: 45,
    instructions: [
      "Eleve os ombros até as orelhas, segure 5s",
      "Solte e relaxe",
      "Entrelace as mãos atrás das costas e estique",
    ],
    icon: "Activity",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "wrists",
    name: "Pulsos e Mãos",
    duration: 30,
    instructions: [
      "Estenda o braço, puxe os dedos para baixo",
      "Depois puxe para cima",
      "Gire os pulsos em círculos",
    ],
    icon: "Wind",
    color: "bg-teal-100 text-teal-600",
  },
  {
    id: "back",
    name: "Lombar e Quadril",
    duration: 60,
    instructions: [
      "Sentado, gire o tronco para a direita",
      "Depois para a esquerda",
      "Incline-se para frente tocando os pés",
    ],
    icon: "Heart",
    color: "bg-red-100 text-red-600",
  },
  {
    id: "legs",
    name: "Pernas e Panturrilha",
    duration: 45,
    instructions: [
      "Em pé, puxe o pé até o glúteo",
      "Alterne as pernas",
      "Faça elevação na ponta dos pés",
    ],
    icon: "Leaf",
    color: "bg-green-100 text-green-600",
  },
];

// Labels para níveis de check-in
export const levelLabels = {
  1: "Muito ruim",
  2: "Ruim",
  3: "Regular",
  4: "Bom",
  5: "Excelente",
};

// Cores para score
export const scoreColors = {
  green: "from-green-500 to-emerald-500",
  lime: "from-lime-500 to-green-500",
  yellow: "from-yellow-500 to-amber-500",
  orange: "from-orange-500 to-amber-500",
  red: "from-red-500 to-rose-500",
};

// Cores e ícones para tendências
export const trendConfig = {
  icons: {
    improving: "TrendingUp",
    worsening: "TrendingDown",
    stable: "Minus",
  },
  colors: {
    improving: "text-green-600 bg-green-100",
    worsening: "text-red-600 bg-red-100",
    stable: "text-gray-600 bg-gray-100",
  },
};
