export type Truck = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: string;
  price: string;
  city: string;
  state: string;
  body: string;
  traction: string;
  engine: string;
  gearbox: string;
  km: string;
  description: string;
  badge: "Destaque" | "Disponível" | "Pendente" | "Reprovado" | "Vendido";
  emoji: string;
};

export const trucks: Truck[] = [
  {
    id: "volvo-fh-540",
    title: "Volvo FH 540 6x2 Automático",
    brand: "Volvo",
    model: "FH 540",
    year: "2018",
    price: "R$ 389.000",
    city: "Chapecó",
    state: "SC",
    body: "Cavalo mecânico",
    traction: "6x2",
    engine: "540 cv",
    gearbox: "Automático",
    km: "620.000 km",
    description: "Caminhão bem conservado, configuração forte para rodoviário, pronto para trabalhar e negociar direto pelo WhatsApp.",
    badge: "Destaque",
    emoji: "🚛",
  },
  {
    id: "scania-p420-cacamba",
    title: "Scania P420 6x4 Caçamba Meia-Cana",
    brand: "Scania",
    model: "P420",
    year: "2007",
    price: "R$ 430.000",
    city: "Xanxerê",
    state: "SC",
    body: "Caçamba meia-cana",
    traction: "6x4",
    engine: "420 cv",
    gearbox: "Manual sincronizada",
    km: "890.000 km",
    description: "Caçamba meia-cana, tração 6x4, boa configuração para trabalho pesado, com visual forte e contato direto.",
    badge: "Destaque",
    emoji: "🚚",
  },
  {
    id: "mb-2726-cacamba",
    title: "Mercedes-Benz 2726 Caçamba Basculante",
    brand: "Mercedes-Benz",
    model: "2726",
    year: "2011",
    price: "R$ 320.000",
    city: "Concórdia",
    state: "SC",
    body: "Caçamba basculante",
    traction: "6x4",
    engine: "260 cv",
    gearbox: "Manual",
    km: "740.000 km",
    description: "Traçado 6x4, caçamba basculante, caminhão de trabalho com estrutura original e documentação informada.",
    badge: "Disponível",
    emoji: "🚛",
  },
  {
    id: "vw-24280-prancha",
    title: "VW 24-280 Prancha",
    brand: "Volkswagen",
    model: "24-280",
    year: "2014",
    price: "R$ 290.000",
    city: "Passo Fundo",
    state: "RS",
    body: "Prancha",
    traction: "6x2",
    engine: "280 cv",
    gearbox: "Manual",
    km: "530.000 km",
    description: "Prancha para transporte de máquinas, bom conjunto para agro e equipamentos, com negociação direta.",
    badge: "Disponível",
    emoji: "🚜",
  },
  {
    id: "ford-cargo-2422",
    title: "Ford Cargo 2422 Traçado",
    brand: "Ford",
    model: "Cargo 2422",
    year: "2002",
    price: "R$ 220.000",
    city: "Erechim",
    state: "RS",
    body: "Carga seca",
    traction: "6x4",
    engine: "Cummins",
    gearbox: "Manual",
    km: "980.000 km",
    description: "Ford Cargo traçado, configuração para serviço pesado, ideal para quem procura caminhão forte e simples.",
    badge: "Disponível",
    emoji: "🚚",
  },
  {
    id: "vw-11180-bau",
    title: "VW 11-180 Baú",
    brand: "Volkswagen",
    model: "11-180",
    year: "2023",
    price: "R$ 320.000",
    city: "Curitiba",
    state: "PR",
    body: "Baú",
    traction: "4x2",
    engine: "180 cv",
    gearbox: "Automático",
    km: "58.000 km",
    description: "Baú moderno, baixa quilometragem, bom para distribuição urbana e operação comercial.",
    badge: "Destaque",
    emoji: "🚛",
  },
];
