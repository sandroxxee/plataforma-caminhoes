export const MARCAS_VALIDAS = [
  "Mercedes-Benz",
  "Scania",
  "Volvo",
  "Volkswagen",
  "Ford",
  "Iveco",
  "DAF",
  "MAN",
  "Agrale",
];

export const ESTADOS_VALIDOS = [
  "SC", "PR", "RS", "SP", "MG", "MS",
  "MT", "GO", "BA", "RJ", "ES", "PE",
  "CE", "PA", "AM",
];

export const CARROCERIAS = [
  "Caçamba basculante", "Caçamba meia-cana", "Graneleira", "Chassis",
  "Tanque", "Prancha", "Plataforma", "Baú seco", "Baú frigorífico",
  "Cavalo mecânico", "Munck", "Outra"
];

export const TRACOES = ["4x2", "6x2", "6x4", "8x2", "8x4", "Truck", "Bitruck", "Traçado"];

export const FAIXAS = [
  { min: 0,       max: Infinity },
  { min: 0,       max: 100_000 },
  { min: 100_000, max: 200_000 },
  { min: 200_000, max: 400_000 },
  { min: 400_000, max: Infinity },
];
