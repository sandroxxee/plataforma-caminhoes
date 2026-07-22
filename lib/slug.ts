type TruckSlugData = {
  id?: string | null;
  short_id?: string | null;
  marca?: string | null;
  modelo?: string | null;
  ano?: number | string | null;
  ano_modelo?: number | string | null;
  ano_fabricacao?: number | string | null;
  cidade?: string | null;
  uf?: string | null;
  estado?: string | null;
};

const UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const UUID_AT_END = /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i;
const SHORT_ID_REGEX = /-([a-f0-9]{8})$/i;
const SHORT_ID_PURE = /^[a-f0-9]{8}$/i;

function limparTextoParaSlug(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function limparTextoCurtoSemTracos(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function gerarSlug(truck: TruckSlugData) {
  const uf  = truck.uf || truck.estado;
  const ano = truck.ano || truck.ano_modelo || truck.ano_fabricacao;

  const partes = [truck.marca, truck.modelo, ano, truck.cidade, uf]
    .filter(Boolean)
    .map((p) => String(p));

  return limparTextoParaSlug(partes.join(" ")) || "caminhao-a-venda";
}

export function gerarSlugComId(truck: TruckSlugData) {
  const slug = gerarSlug(truck);
  let id = "";
  if (truck.short_id) {
    id = String(truck.short_id).trim().toLowerCase();
  } else if (truck.id) {
    id = String(truck.id).trim().toLowerCase().split("-")[0];
  }
  return id ? `${slug}-${id}` : slug;
}

export function gerarSlugCurtoLimpo(truck: TruckSlugData) {
  const marcaLimpa = limparTextoCurtoSemTracos(truck.marca || "");
  const modeloLimpo = limparTextoCurtoSemTracos(truck.modelo || "");

  const textoMarcaModelo = (marcaLimpa + modeloLimpo) || "caminhao";

  let id = "";
  if (truck.short_id) {
    id = String(truck.short_id).trim().toLowerCase();
  } else if (truck.id) {
    id = String(truck.id).trim().toLowerCase().split("-")[0];
  }

  return id ? `${textoMarcaModelo}-${id}` : textoMarcaModelo;
}

export function gerarSlugUltraLimpo(truck: TruckSlugData) {
  const marcaLimpa = limparTextoCurtoSemTracos(truck.marca || "");
  const modeloLimpo = limparTextoCurtoSemTracos(truck.modelo || "");

  return (marcaLimpa + modeloLimpo) || "caminhao";
}

/** Extrai o UUID ou short_id do parâmetro de rota. Aceita UUID puro, UUID no final, short_id puro ou short_id no final. */
export function extrairIdDoParametroAnuncio(parametro: string) {
  const value = String(parametro || "").trim().toLowerCase();

  // 1. UUID completo
  if (UUID_REGEX.test(value)) {
    return { tipo: "uuid" as const, valor: value };
  }
  const matchUuid = value.match(UUID_AT_END);
  if (matchUuid) {
    return { tipo: "uuid" as const, valor: matchUuid[1] };
  }

  // 2. Short ID (8 hex chars)
  if (SHORT_ID_PURE.test(value)) {
    return { tipo: "short_id" as const, valor: value };
  }
  const matchShort = value.match(SHORT_ID_REGEX);
  if (matchShort) {
    return { tipo: "short_id" as const, valor: matchShort[1] };
  }

  return { tipo: "nao_encontrado" as const, valor: value };
}

