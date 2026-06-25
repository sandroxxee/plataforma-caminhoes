import { gerarSlugComId } from "@/lib/slug";

export type TruckImage = {
  image_url: string | null;
  principal: boolean | null;
  ordem: number | null;
};

export type TruckCardData = {
  id: string;
  user_id?: string | null;
  titulo: string | null;
  marca: string | null;
  modelo: string | null;
  ano_modelo: number | null;
  ano_fabricacao: number | null;
  preco: number | null;
  cidade: string | null;
  estado: string | null;
  carroceria: string | null;
  tracao: string | null;
  whatsapp: string | null;
  truck_images?: TruckImage[];
};

export function formatMoney(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function normalizeCity(city: string | null) {
  const value = (city || "").trim();
  if (!value) return "";
  const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (normalized === "xanxere") return "Xanxer\u00ea";
  if (normalized === "florianopolis") return "Florian\u00f3polis";
  return value;
}

export function getLocation(truck: TruckCardData) {
  const city = normalizeCity(truck.cidade);
  if (city && truck.estado) return `${city} \u2022 ${truck.estado}`;
  if (truck.estado) return truck.estado;
  return city || "";
}

export function getTitle(truck: TruckCardData) {
  return truck.titulo || `${truck.marca || ""} ${truck.modelo || ""}`.trim() || "Caminh\u00e3o anunciado";
}

export function getCardTitle(truck: TruckCardData) {
  const title = getTitle(truck);
  const ano = truck.ano_modelo || truck.ano_fabricacao;
  if (!ano) return title;
  return title
    .replace(new RegExp(`\\s*[-\u2013\u2014]?\\s*ano\\s*${ano}\\b`, "i"), "")
    .replace(new RegExp(`\\s*[-\u2013\u2014]\\s*${ano}\\b`, "i"), "")
    .replace(/\s{2,}/g, " ").trim() || title;
}

export function getTruckImage(truck: TruckCardData) {
  const images = [...(truck.truck_images || [])]
    .filter((img) => img.image_url)
    .sort((a, b) => {
      if (a.principal && !b.principal) return -1;
      if (!a.principal && b.principal) return 1;
      return (a.ordem || 0) - (b.ordem || 0);
    });
  return images[0]?.image_url || "";
}

export function getWhatsappLink(truck: TruckCardData) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(`Ol\u00e1, tenho interesse no caminh\u00e3o ${getTitle(truck)}.`);
  return phone ? `https://wa.me/${phone}?text=${text}` : "";
}

export function getTruckUrl(truck: TruckCardData) {
  return `/comprar/caminhoes/${gerarSlugComId({
    id: truck.id,
    marca: truck.marca,
    modelo: truck.modelo,
    ano_modelo: truck.ano_modelo,
    ano_fabricacao: truck.ano_fabricacao,
    cidade: truck.cidade,
    estado: truck.estado,
  })}`;
}
