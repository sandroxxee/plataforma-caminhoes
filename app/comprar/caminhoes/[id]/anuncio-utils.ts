// Funções puras de SEO, formatação e dados — sem React, sem estado
import { formatMoney, getLocation, getTitle, formatImageUrl, type TruckCardData, type TruckImage } from "@/lib/truck-utils";
import { gerarSlugComId } from "@/lib/slug";

export const siteUrl = "https://www.caminhoesavenda.com";
export const defaultOgImage = "/og-caminhoes-a-venda.jpg";
export const truckSelect = `id,user_id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,quilometragem,motor,cambio,combustivel,cor,perfil,descricao,whatsapp,views,truck_images(image_url,principal,ordem)`;

export const UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export const SHORT_ID_REGEX = /-([a-f0-9]{8})$/;

export type Truck = TruckCardData & {
  user_id?: string | null;
  descricao: string | null;
  quilometragem?: number | null;
  km?: number | null;
  motor?: string | null;
  cambio?: string | null;
  combustivel?: string | null;
  cor?: string | null;
  perfil?: string | null;
  views?: number | null;
  truck_images?: TruckImage[];
};

// Textos dinâmicos por perfil
export const PERFIL_TEXTOS: Record<string, {
  sobre: string;
  whatsapp: string;
  ficha: string;
  veiculo: string;
  emoji: string;
}> = {
  Máquinas: {
    sobre:    "Sobre esta máquina",
    whatsapp: "Tenho interesse nesta máquina",
    ficha:    "Ficha técnica",
    veiculo:  "máquina",
    emoji:    "🏗️",
  },
  Peças: {
    sobre:    "Sobre esta peça",
    whatsapp: "Tenho interesse nesta peça",
    ficha:    "Especificações",
    veiculo:  "peça",
    emoji:    "🔩",
  },
  Carretas: {
    sobre:    "Sobre esta carreta",
    whatsapp: "Tenho interesse nesta carreta",
    ficha:    "Ficha técnica",
    veiculo:  "carreta",
    emoji:    "🚚",
  },
  Implementos: {
    sobre:    "Sobre este implemento",
    whatsapp: "Tenho interesse neste implemento",
    ficha:    "Especificações",
    veiculo:  "implemento",
    emoji:    "📦",
  },
};

const DEFAULT_TEXTOS = {
  sobre:    "Sobre este caminhão",
  whatsapp: "Tenho interesse neste caminhão",
  ficha:    "Ficha técnica",
  veiculo:  "caminhão",
  emoji:    "🚛",
};

export function getPerfilTextos(perfil?: string | null) {
  return (perfil && PERFIL_TEXTOS[perfil]) ? PERFIL_TEXTOS[perfil] : DEFAULT_TEXTOS;
}

export function getWhatsappLink(truck: Truck, title: string) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const textos = getPerfilTextos(truck.perfil);
  const text = encodeURIComponent(
    `Olá, tenho interesse ${textos.veiculo !== "caminhão" ? `n${["a","e"].includes(textos.veiculo[0]) ? "a" : "o"} ` : "no "}${textos.veiculo} ${title}${truck.ano_modelo ? ` ano ${truck.ano_modelo}` : ""}. Pode me passar mais informações?`
  );
  return phone ? `https://wa.me/${phone}?text=${text}` : "";
}

export function getCanonicalPath(truck: Truck) {
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
  return formatImageUrl(main) || defaultOgImage;
}

function getDriveWheel(tracao?: string | null): string | undefined {
  if (!tracao) return undefined;
  const t = tracao.toLowerCase();
  if (t.includes("4x4") || t.includes("4wd") || t.includes("integral")) return "https://schema.org/AllWheelDriveConfiguration";
  if (t.includes("6x4") || t.includes("6x2") || t.includes("traseira")) return "https://schema.org/RearWheelDriveConfiguration";
  if (t.includes("dianteira") || t.includes("4x2")) return "https://schema.org/FrontWheelDriveConfiguration";
  return undefined;
}

function getFuelType(combustivel?: string | null): string | undefined {
  if (!combustivel) return undefined;
  const c = combustivel.toLowerCase();
  if (c.includes("diesel")) return "https://schema.org/Diesel";
  if (c.includes("gas") || c.includes("gnv")) return "https://schema.org/CNG";
  if (c.includes("eletri")) return "https://schema.org/Electric";
  if (c.includes("híbrido") || c.includes("hibrido")) return "https://schema.org/Hybrid";
  return undefined;
}

export function getStructuredData(truck: Truck, title: string, location: string, whatsappLink: string) {
  const canonicalPath = getCanonicalPath(truck);
  const url = `${siteUrl}${canonicalPath}`;
  const image = getMainImage(truck);
  const price = getNumericPrice(truck.preco);
  const description =
    truck.descricao?.trim() ||
    `${title}${location ? ` em ${location}` : ""}. Anúncio revisado com contato direto pelo WhatsApp.`;
  const imageAbsolute = image.startsWith("http") ? image : `${siteUrl}${image}`;

  const vehicle = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: title, description, url,
    image: imageAbsolute,
    brand: truck.marca ? { "@type": "Brand", name: truck.marca } : undefined,
    model: truck.modelo || undefined,
    vehicleModelDate: truck.ano_modelo ? String(truck.ano_modelo) : undefined,
    modelDate: truck.ano_fabricacao ? String(truck.ano_fabricacao) : undefined,
    vehicleConfiguration: truck.carroceria || undefined,
    bodyType: truck.carroceria || undefined,
    driveWheelConfiguration: getDriveWheel(truck.tracao),
    fuelType: getFuelType(truck.combustivel ?? "Diesel"),
    color: truck.cor || undefined,
    vehicleEngine: truck.motor ? { "@type": "EngineSpecification", name: truck.motor } : undefined,
    mileageFromOdometer: truck.quilometragem
      ? { "@type": "QuantitativeValue", value: truck.quilometragem, unitCode: "KMT" }
      : undefined,
    itemCondition: "https://schema.org/UsedCondition",
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

  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title, description, url,
    image: imageAbsolute,
    sku: truck.id,
    brand: truck.marca ? { "@type": "Brand", name: truck.marca } : undefined,
    category: "Veículos > Caminhões",
    offers: {
      "@type": "Offer", url, priceCurrency: "BRL", price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: { "@type": "Organization", name: "Caminhões à Venda", url: siteUrl },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Caminhões", item: `${siteUrl}/comprar/caminhoes` },
      { "@type": "ListItem", position: 3, name: truck.marca || "Anúncio", item: `${siteUrl}/comprar/caminhoes?marca=${encodeURIComponent(truck.marca || "")}` },
      { "@type": "ListItem", position: 4, name: title, item: url },
    ],
  };

  return { vehicle, product, breadcrumb };
}

export function getSpecs(truck: Truck) {
  return [
    { label: "Marca",         value: truck.marca },
    { label: "Modelo",        value: truck.modelo },
    { label: "Ano/modelo",    value: truck.ano_modelo || truck.ano_fabricacao },
    { label: "Quilometragem", value: formatKm(truck.quilometragem || truck.km) },
    { label: "Tração",        value: truck.tracao },
    { label: "Carroceria",    value: truck.carroceria },
    { label: "Motor",         value: truck.motor },
    { label: "Câmbio",        value: truck.cambio },
    { label: "Combustível",   value: truck.combustivel },
    { label: "Cor",           value: truck.cor },
    { label: "Cidade",        value: getLocation(truck) },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value));
}
