import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ShareAdButton } from "@/components/ShareAdButton";
import { SiteFooter } from "@/components/SiteFooter";
import { AdGallery } from "@/components/theme/AdGallery";
import { formatMoney, getCardTitle, getLocation, getTitle, type TruckCardData, type TruckImage } from "@/components/theme/TruckCard";
import { extrairIdDoParametroAnuncio, gerarSlugComId } from "@/lib/slug";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const siteUrl = "https://caminhoesavenda.com";
const defaultOgImage = "/og-caminhoes-a-venda.jpg";
const truckSelect = `id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,descricao,whatsapp,truck_images(image_url,principal,ordem)`;

type Truck = TruckCardData & {
  descricao: string | null;
  quilometragem?: number | null;
  km?: number | null;
  truck_images?: TruckImage[];
};

function getWhatsappLink(truck: Truck, title: string) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(`Olá, tenho interesse no caminhão ${title}${truck.ano_modelo ? ` ano ${truck.ano_modelo}` : ""}. Pode me passar mais informações?`);
  return phone ? `https://wa.me/${phone}?text=${text}` : "";
}

function getCanonicalPath(truck: Truck) {
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

function formatKm(value?: number | null) {
  if (!value) return "Não informado";
  return `${value.toLocaleString("pt-BR")} km`;
}

function getNumericPrice(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return undefined;
  const price = typeof value === "number" ? value : Number(String(value).replace(/[^\d,.-]/g, "").replace(".", "").replace(",", "."));
  return Number.isFinite(price) ? price : undefined;
}

function cleanText(value?: string | number | null) {
  return String(value || "").trim();
}

function getSeoTitle(truck: Truck) {
  const marca = cleanText(truck.marca);
  const modelo = cleanText(truck.modelo || truck.titulo);
  const ano = cleanText(truck.ano_modelo || truck.ano_fabricacao);
  const cidade = cleanText(truck.cidade);
  const uf = cleanText(truck.estado);
  const partes = [marca, modelo, ano, cidade, uf].filter(Boolean);

  return partes.length ? partes.join(" ") : getTitle(truck);
}

function getSeoDescription(truck: Truck, title: string, location: string, price: string) {
  const tipo = cleanText(truck.carroceria) || cleanText(truck.tracao) || "caminhão ou implemento";
  const detalhes = [tipo, price !== "Preço sob consulta" ? price : "", location].filter(Boolean).join(" · ");
  return `${title}. ${detalhes ? `${detalhes}. ` : ""}Veja fotos, detalhes do anúncio e contato direto pelo WhatsApp no Caminhões à Venda.`;
}

async function getApprovedTruck(parametro: string) {
  const supabase = await createClient();
  const parsed = extrairIdDoParametroAnuncio(parametro);

  if (parsed.tipo === "uuid") {
    const { data, error } = await supabase
      .from("trucks")
      .select(truckSelect)
      .eq("id", parsed.valor)
      .eq("status", "aprovado")
      .eq("vendido", false)
      .maybeSingle();

    if (error || !data) return null;
    return data as Truck;
  }

  const { data, error } = await supabase
    .from("trucks")
    .select(truckSelect)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .limit(5000);

  if (error || !data) return null;

  const truck = data.find((item) => String(item.id).toLowerCase().startsWith(parsed.valor));
  return truck ? truck as Truck : null;
}

function getMainImage(truck: Truck) {
  const images = truck.truck_images || [];
  const main = images.find((image) => image.principal)?.image_url || images[0]?.image_url;
  return main || defaultOgImage;
}

function getStructuredData(truck: Truck, title: string, location: string, whatsappLink: string) {
  const canonicalPath = getCanonicalPath(truck);
  const url = `${siteUrl}${canonicalPath}`;
  const image = getMainImage(truck);
  const price = getNumericPrice(truck.preco);
  const description = truck.descricao?.trim() || `${title}${location ? ` em ${location}` : ""}. Anúncio revisado com contato direto pelo WhatsApp.`;

  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: title,
    description,
    url,
    image: image.startsWith("http") ? image : `${siteUrl}${image}`,
    brand: truck.marca ? { "@type": "Brand", name: truck.marca } : undefined,
    model: truck.modelo || undefined,
    vehicleModelDate: truck.ano_modelo ? String(truck.ano_modelo) : undefined,
    mileageFromOdometer: truck.quilometragem || truck.km ? {
      "@type": "QuantitativeValue",
      value: truck.quilometragem || truck.km,
      unitCode: "KMT",
    } : undefined,
    vehicleConfiguration: [truck.tracao, truck.carroceria].filter(Boolean).join(" - ") || undefined,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "BRL",
      price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type": "Organization",
        name: "Caminhões à Venda",
        url: siteUrl,
      },
    },
    areaServed: location || undefined,
    potentialAction: whatsappLink ? {
      "@type": "ContactAction",
      target: whatsappLink,
      name: "Contato pelo WhatsApp",
    } : undefined,
  };
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const truck = await getApprovedTruck(id);

  if (!truck) {
    return {
      title: "Anúncio não encontrado",
      robots: { index: false, follow: false },
    };
  }

  const title = getTitle(truck);
  const seoTitle = getSeoTitle(truck);
  const location = getLocation(truck);
  const price = formatMoney(truck.preco);
  const description = getSeoDescription(truck, title, location, price);
  const canonicalPath = getCanonicalPath(truck);
  const url = `${siteUrl}${canonicalPath}`;
  const image = getMainImage(truck);

  return {
    title: seoTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: "Caminhões à Venda",
      title: `${seoTitle} | Caminhões à Venda`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: seoTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoTitle} | Caminhões à Venda`,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function AnuncioDetalhePage({ params }: PageProps) {
  const { id } = await params;
  const truck = await getApprovedTruck(id);

  if (!truck) notFound();

  const canonicalPath = getCanonicalPath(truck);
  if (`/anuncios/${id}` !== canonicalPath) {
    redirect(canonicalPath);
  }

  const title = getTitle(truck);
  const location = getLocation(truck);
  const whatsappLink = getWhatsappLink(truck, title);
  const structuredData = getStructuredData(truck, title, location, whatsappLink);
  const shareYear = truck.ano_modelo || truck.ano_fabricacao;
  const shareText = `🚛 ${getCardTitle(truck)}${shareYear ? ` ${shareYear}` : ""}`;

  return (
    <main className="market-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PublicHeader />

      <section className="market-container detail-layout">
        <div className="detail-card">
          <div className="detail-title">
            <Link href="/anuncios" className="detail-eyebrow">← Voltar ao estoque</Link>
            <h1>{title}</h1>
            <p>{location || "Localização não informada"}</p>
          </div>

          <AdGallery title={title} images={truck.truck_images || []} />

          <div className="detail-description">
            <h2>Descrição do caminhão</h2>
            <p>{truck.descricao?.trim() || "Este anúncio ainda não possui descrição cadastrada. Fale pelo WhatsApp para confirmar estado do veículo, disponibilidade e condições de negociação."}</p>
          </div>
        </div>

        <aside className="detail-card">
          <span className="detail-eyebrow">Anúncio disponível</span>
          <strong className="detail-price">{formatMoney(truck.preco)}</strong>
          <p className="stock-count">Fale direto pelo WhatsApp para confirmar disponibilidade, estado do caminhão e forma de negociação.</p>

          <div className="detail-specs">
            <div><span>Marca</span><b>{truck.marca || "-"}</b></div>
            <div><span>Modelo</span><b>{truck.modelo || "-"}</b></div>
            <div><span>Ano/modelo</span><b>{truck.ano_modelo || truck.ano_fabricacao || "-"}</b></div>
            <div><span>Km</span><b>{formatKm(truck.quilometragem || truck.km)}</b></div>
            <div><span>Tração</span><b>{truck.tracao || "-"}</b></div>
            <div><span>Carroceria</span><b>{truck.carroceria || "-"}</b></div>
            <div><span>Cidade</span><b>{location || "-"}</b></div>
          </div>

          {whatsappLink ? <a href={whatsappLink} target="_blank" rel="noreferrer" className="detail-whatsapp" data-whatsapp-click data-truck-id={truck.id}>Tenho interesse neste caminhão</a> : null}
          <ShareAdButton title={title} text={shareText} />

          <div className="detail-description">
            <h2>Contato e negociação</h2>
            <p>Anúncio revisado antes de aparecer no site. O contato é direto pelo WhatsApp para facilitar a conversa com o interessado.</p>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </main>
  );
}
