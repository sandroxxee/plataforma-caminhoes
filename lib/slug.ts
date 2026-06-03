type TruckSlugData = {
  marca?: string | null;
  modelo?: string | null;
  ano?: number | string | null;
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

  const partes = [
    truck.marca,
    truck.modelo,
    truck.ano,
    truck.cidade,
    uf,
  ]
    .filter(Boolean)
    .map((parte) => String(parte));

  const slug = limparTextoParaSlug(partes.join(" "));

  return slug || "caminhao-a-venda";
}
