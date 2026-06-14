// Funções puras de SEO, formatação e dados — sem React, sem estado
import { formatMoney, getLocation, getTitle, type TruckCardData, type TruckImage } from "@/lib/truck-utils";
import { gerarSlugComId } from "@/lib/slug";

export const siteUrl = "https://www.caminhoesavenda.com";
export const defaultOgImage = "/og-caminhoes-a-venda.jpg";
export const truckSelect = `id,user_id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,descricao,whatsapp,views,truck_images(image_url,principal,ordem)`;

export const UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export const SHORT_ID_REGEX = /-([a-f0-9]{8})$/;

export type Truck = TruckCardData & {
  user_id?: string | null;
  descricao: string | null;
  quilometragem?: number | null;
  km?: number | null;
  views?: number | null;
  truck_images?: TruckImage[];
};

export function getWhatsappLink(truck: Truck, title: string) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(
    `Olá, tenho interesse no caminhão ${title}${truck.ano_modelo ? ` ano ${truck.ano_modelo}` : ""}. Pode me passar mais informações?`
  );
  return phone ? `https://wa.me/${phone}?text=${text}` : "";
}

export function getCanonicalPath(truck: Truck) {
  return `/anuncios/${gerarSlugComId({
    id: truck.id,
    marca: truck.marca,
    modelo: truck.modelo,
    ano_modelo: truck.ano_modelo,
    ano_fabricacao: truck.ano_fabricacao,
    cidade: truck.cidade,
    estado: truck.estado,
  })}`;
}

export function formatKm(value?: number | null): string | null {
  if (!value) return null;
  return `${value.toLocaleString("pt-BR")} km`;
}

export function getNumericPrice(value?: number | string | null): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const price =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^\d,.-]/g, "").replace(".", "").replace(",", "."));
  return Number.isFinite(price) ? price : undefined;
}

function cleanText(value?: string | number | null) {
  return String(value || "").trim();
}

export function getSeoTitle(truck: Truck) {
  const partes = [
    cleanText(truck.marca),
    cleanText(truck.modelo || truck.titulo),
    cleanText(truck.ano_modelo || truck.ano_fabricacao),
    cleanText(truck.cidade),
    cleanText(truck.estado),
  ].filter(Boolean);
  return partes.length ? partes.join(" ") : getTitle(truck);
}

export function getSeoDescription(truck: Truck, title: string, location: string, price: string) {
  const tipo = cleanText(truck.carroceria) || cleanText(truck.tracao) || "";
  const partes = [tipo, price !== "Preço sob consulta" ? price : "", location].filter(Boolean);
  const base = `${title}${partes.length ? `. ${partes.join(" · ")}` : ""}. Veja fotos e fale pelo WhatsApp.`;
  return base.length > 125 ? base.slice(0, 122) + "..." : base;
}

export function getMainImage(truck: Truck) {
  const images = truck.truck_images || [];
  const main = images.find((img) => img.principal)?.image_url || images[0]?.image_url;
  return main || defaultOgImage;
}

export function getStructuredData(truck: Truck, title: string, location: string, whatsappLink: string) {
  const canonicalPath = getCanonicalPath(truck);
  const url = `${siteUrl}${canonicalPath}`;
  const image = getMainImage(truck);
  const price = getNumericPrice(truck.preco);
  const description =
    truck.descricao?.trim() ||
    `${title}${location ? ` em ${location}` : ""}. Anúncio revisado com contato direto pelo WhatsApp.`;

  const vehicle = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: title, description, url,
    image: image.startsWith("http") ? image : `${siteUrl}${image}`,
    brand: truck.marca ? { "@type": "Brand", name: truck.marca } : undefined,
    model: truck.modelo || undefined,
    vehicleModelDate: truck.ano_modelo ? String(truck.ano_modelo) : undefined,
    offers: {
      "@type": "Offer", url, priceCurrency: "BRL", price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: { "@type": "Organization", name: "Caminhões à Venda", url: siteUrl },
    },
    areaServed: location || undefined,
    potentialAction: whatsappLink
      ? { "@type": "ContactAction", target: whatsappLink, name: "Contato pelo WhatsApp" }
      : undefined,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Caminhões", item: `${siteUrl}/anuncios` },
      { "@type": "ListItem", position: 3, name: truck.marca || "Anúncio", item: `${siteUrl}/anuncios?marca=${encodeURIComponent(truck.marca || "")}` },
      { "@type": "ListItem", position: 4, name: title, item: url },
    ],
  };

  return { vehicle, breadcrumb };
}

export function getSpecs(truck: Truck) {
  return [
    { label: "Marca",         value: truck.marca },
    { label: "Modelo",        value: truck.modelo },
    { label: "Ano/modelo",    value: truck.ano_modelo || truck.ano_fabricacao },
    { label: "Quilometragem", value: formatKm(truck.quilometragem || truck.km) },
    { label: "Tração",        value: truck.tracao },
    { label: "Carroceria",    value: truck.carroceria },
    { label: "Cidade",        value: getLocation(truck) },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value));
}
