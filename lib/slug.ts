type TruckSlugData = {
  id?: string | null;
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

function limparTextoParaSlug(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
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
  const id   = String(truck.id || "").trim().toLowerCase();
  return id ? `${slug}-${id}` : slug;
}

/** Extrai o UUID do parâmetro de rota. Aceita UUID puro ou UUID no final do slug. */
export function extrairIdDoParametroAnuncio(parametro: string) {
  const value = String(parametro || "").trim().toLowerCase();

  if (UUID_REGEX.test(value)) {
    return { tipo: "uuid" as const, valor: value };
  }

  const match = value.match(UUID_AT_END);
  if (match) {
    return { tipo: "uuid" as const, valor: match[1] };
  }

  return { tipo: "nao_encontrado" as const, valor: value };
}
