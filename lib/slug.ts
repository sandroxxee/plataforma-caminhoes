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
  const uf = truck.uf || truck.estado;
  const ano = truck.ano || truck.ano_modelo || truck.ano_fabricacao;

  const partes = [
    truck.marca,
    truck.modelo,
    ano,
    truck.cidade,
    uf,
  ]
    .filter(Boolean)
    .map((parte) => String(parte));

  const slug = limparTextoParaSlug(partes.join(" "));

  return slug || "caminhao-a-venda";
}

export function getShortTruckId(id?: string | null) {
  return String(id || "").replace(/[^a-f0-9]/gi, "").slice(0, 8).toLowerCase();
}

export function gerarSlugComId(truck: TruckSlugData) {
  const slug = gerarSlug(truck);
  const id = String(truck.id || "").trim().toLowerCase();
  return id ? `${slug}-${id}` : slug;
}

export function extrairIdDoParametroAnuncio(parametro: string) {
  const value = String(parametro || "").trim().toLowerCase();
  const uuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

  if (uuidRegex.test(value)) {
    return { tipo: "uuid" as const, valor: value };
  }

  // UUID completo no final do slug: qualquer-texto-uuid
  const uuidAtEnd = value.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/);
  if (uuidAtEnd) {
    return { tipo: "uuid" as const, valor: uuidAtEnd[1] };
  }

  const shortId = value.match(/-([a-f0-9]{8})$/)?.[1];

  if (shortId) {
    return { tipo: "short" as const, valor: shortId };
  }

  return { tipo: "slug" as const, valor: value };
}
