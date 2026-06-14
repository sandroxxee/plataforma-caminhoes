import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ShareAdButton } from "@/components/ShareAdButton";
import { SiteFooter } from "@/components/SiteFooter";
import { AdGallery } from "@/components/theme/AdGallery";
import { formatMoney, getCardTitle, getLocation, getTitle, type TruckCardData, type TruckImage } from "@/lib/truck-utils";
import { gerarSlugComId } from "@/lib/slug";
import { ViewCounter } from "@/components/ViewCounter";
import { MapPin, CheckCircle, ShieldCheck, Camera, MessageCircle } from "lucide-react";

export const revalidate = 300;

const siteUrl = "https://www.caminhoesavenda.com";
const defaultOgImage = "/og-caminhoes-a-venda.jpg";
const truckSelect = `id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,descricao,whatsapp,views,truck_images(image_url,principal,ordem)`;

const UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const SHORT_ID_REGEX = /-([a-f0-9]{8})$/;

type Truck = TruckCardData & {
  descricao: string | null;
  quilometragem?: number | null;
  km?: number | null;
  views?: number | null;
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
  const marca  = cleanText(truck.marca);
  const modelo = cleanText(truck.modelo || truck.titulo);
  const ano    = cleanText(truck.ano_modelo || truck.ano_fabricacao);
  const cidade = cleanText(truck.cidade);
  const uf     = cleanText(truck.estado);
  const partes = [marca, modelo, ano, cidade, uf].filter(Boolean);
  return partes.length ? partes.join(" ") : getTitle(truck);
}

function getSeoDescription(truck: Truck, title: string, location: string, price: string) {
  const tipo   = cleanText(truck.carroceria) || cleanText(truck.tracao) || "";
  const partes = [tipo, price !== "Preço sob consulta" ? price : "", location].filter(Boolean);
  const base   = `${title}${partes.length ? `. ${partes.join(" · ")}` : ""}. Veja fotos e fale pelo WhatsApp.`;
  return base.length > 125 ? base.slice(0, 122) + "..." : base;
}

async function getApprovedTruck(parametro: string): Promise<Truck | null> {
  const supabase = await createClient();
  const value = parametro.trim().toLowerCase();

  if (UUID_REGEX.test(value)) {
    const { data, error } = await supabase
      .from("trucks")
      .select(truckSelect)
      .eq("id", value)
      .eq("status", "aprovado")
      .eq("vendido", false)
      .maybeSingle();
    if (error || !data) return null;
    return data as Truck;
  }

  const shortIdMatch = value.match(SHORT_ID_REGEX);
  if (shortIdMatch) {
    const shortId = shortIdMatch[1];
    const { data: rpcData, error: rpcError } = await supabase
      .rpc("find_truck_by_short_id", { short_id: shortId });
    if (!rpcError && rpcData && rpcData.length > 0) {
      const truckBase = rpcData[0] as Truck;
      const { data: images } = await supabase
        .from("truck_images")
        .select("image_url, principal, ordem")
        .eq("truck_id", truckBase.id)
        .order("ordem", { ascending: true });
      return { ...truckBase, truck_images: (images || []) as TruckImage[] };
    }
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("trucks")
      .select(truckSelect)
      .eq("status", "aprovado")
      .eq("vendido", false)
      .ilike("id", `${shortId}%`);
    if (!fallbackError && fallbackData && fallbackData.length > 0) return fallbackData[0] as Truck;
  }

  return null;
}

function getMainImage(truck: Truck) {
  const images = truck.truck_images || [];
  const main = images.find((img) => img.principal)?.image_url || images[0]?.image_url;
  return main || defaultOgImage;
}

function getStructuredData(truck: Truck, title: string, location: string, whatsappLink: string) {
  const canonicalPath = getCanonicalPath(truck);
  const url   = `${siteUrl}${canonicalPath}`;
  const image = getMainImage(truck);
  const price = getNumericPrice(truck.preco);
  const description = truck.descricao?.trim() || `${title}${location ? ` em ${location}` : ""}. Anúncio revisado com contato direto pelo WhatsApp.`;

  const vehicle = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: title, description, url,
    image: image.startsWith("http") ? image : `${siteUrl}${image}`,
    brand:  truck.marca  ? { "@type": "Brand", name: truck.marca } : undefined,
    model:  truck.modelo || undefined,
    vehicleModelDate: truck.ano_modelo ? String(truck.ano_modelo) : undefined,
    offers: {
      "@type": "Offer", url, priceCurrency: "BRL", price,
      availability:   "https://schema.org/InStock",
      itemCondition:  "https://schema.org/UsedCondition",
      seller: { "@type": "Organization", name: "Caminhões à Venda", url: siteUrl },
    },
    areaServed: location || undefined,
    potentialAction: whatsappLink ? { "@type": "ContactAction", target: whatsappLink, name: "Contato pelo WhatsApp" } : undefined,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início",    item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Caminhões", item: `${siteUrl}/anuncios` },
      { "@type": "ListItem", position: 3, name: truck.marca || "Anúncio", item: `${siteUrl}/anuncios?marca=${encodeURIComponent(truck.marca || "")}` },
      { "@type": "ListItem", position: 4, name: title, item: url },
    ],
  };

  return { vehicle, breadcrumb };
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const truck = await getApprovedTruck(id);
  if (!truck) return { title: "Anúncio não encontrado", robots: { index: false, follow: false } };

  const title    = getTitle(truck);
  const seoTitle = getSeoTitle(truck);
  const location = getLocation(truck);
  const price    = formatMoney(truck.preco);
  const description   = getSeoDescription(truck, title, location, price);
  const canonicalPath = getCanonicalPath(truck);
  const url   = `${siteUrl}${canonicalPath}`;
  const image = getMainImage(truck);

  return {
    title: seoTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website", locale: "pt_BR", url,
      siteName: "Caminhões à Venda",
      title: `${seoTitle} | Caminhões à Venda`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: seoTitle }],
    },
    twitter: { card: "summary_large_image", title: `${seoTitle} | Caminhões à Venda`, description, images: [image] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function AnuncioDetalhePage({ params }: PageProps) {
  const { id } = await params;
  const truck = await getApprovedTruck(id);

  if (!truck) notFound();

  const canonicalPath = getCanonicalPath(truck);
  if (UUID_REGEX.test(id.toLowerCase()) && `/anuncios/${id}` !== canonicalPath) {
    redirect(canonicalPath);
  }

  const title        = getTitle(truck);
  const location     = getLocation(truck);
  const whatsappLink = getWhatsappLink(truck, title);
  const { vehicle: structuredData, breadcrumb: breadcrumbData } = getStructuredData(truck, title, location, whatsappLink);
  const shareYear  = truck.ano_modelo || truck.ano_fabricacao;
  const shareText  = `🚛 ${getCardTitle(truck)}${shareYear ? ` ${shareYear}` : ""}${location ? ` · ${location}` : ""}\n${formatMoney(truck.preco)}`;
  const photoCount    = (truck.truck_images || []).length;
  const initialViews  = truck.views ?? 0;

  const specs = [
    { label: "Marca",         value: truck.marca },
    { label: "Modelo",        value: truck.modelo },
    { label: "Ano/modelo",    value: truck.ano_modelo || truck.ano_fabricacao },
    { label: "Quilometragem", value: formatKm(truck.quilometragem || truck.km) === "Não informado" ? null : formatKm(truck.quilometragem || truck.km) },
    { label: "Tração",        value: truck.tracao },
    { label: "Carroceria",    value: truck.carroceria },
    { label: "Cidade",        value: location },
  ].filter((s) => s.value);

  return (
    <main className="market-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <PublicHeader />

      <div className="market-container detail-layout">

        {/* Coluna principal */}
        <div>
          {/* Breadcrumb */}
          <nav className="detail-breadcrumb" aria-label="Navegação">
            <Link href="/">Início</Link>
            <span aria-hidden="true">›</span>
            <Link href="/anuncios">Caminhões</Link>
            <span aria-hidden="true">›</span>
            <span>{truck.marca || "Anúncio"}</span>
          </nav>

          {/* Galeria */}
          <div className="detail-card detail-gallery-card">
            <div className="detail-gallery-meta">
              {photoCount > 0 && (
                <div className="detail-badge">
                  <Camera size={13} strokeWidth={2.5} aria-hidden="true" />
                  {photoCount} {photoCount === 1 ? "foto" : "fotos"}
                </div>
              )}
              <ViewCounter truckId={truck.id} initialViews={initialViews} />
            </div>
            <AdGallery title={title} images={truck.truck_images || []} />
          </div>

          {/* Título mobile — apenas mobile, sem aside */}
          <div className="detail-card detail-mobile-header">
            <h1 className="detail-h1">{title}</h1>
            {location && (
              <p className="detail-location">
                <MapPin size={13} strokeWidth={2} aria-hidden="true" />
                {location}
              </p>
            )}
            <strong className="detail-price-mobile">{formatMoney(truck.preco)}</strong>
          </div>

          {/* Descrição */}
          <div className="detail-card detail-desc-card">
            <h2 className="detail-section-title">Sobre este caminhão</h2>
            <p className="detail-desc-text">
              {truck.descricao?.trim() || "Este anúncio ainda não possui descrição cadastrada. Fale pelo WhatsApp para confirmar estado do veículo, disponibilidade e condições de negociação."}
            </p>
          </div>

          {/* Aviso de segurança */}
          <div className="detail-card detail-safety">
            <ShieldCheck size={18} strokeWidth={1.8} className="detail-safety-icon" aria-hidden="true" />
            <div>
              <strong>Anúncio revisado</strong>
              <p>Todos os anúncios passam por aprovação antes de aparecer no site. Sempre confira documentos e estado do veículo antes de fechar negócio.</p>
            </div>
          </div>
        </div>

        {/* Aside sticky */}
        <aside className="detail-aside">
          <div className="detail-card detail-aside-header">
            <span className="detail-status-badge">
              <CheckCircle size={12} strokeWidth={2.5} aria-hidden="true" />
              Disponível
            </span>
            <h1 className="detail-h1 detail-h1-aside">{title}</h1>
            {location && (
              <p className="detail-location">
                <MapPin size={13} strokeWidth={2} aria-hidden="true" />
                {location}
              </p>
            )}
            <strong className="detail-price">{formatMoney(truck.preco)}</strong>
            <p className="detail-aside-hint">Fale direto pelo WhatsApp para confirmar disponibilidade e condições de negociação.</p>

            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="detail-whatsapp"
                data-whatsapp-click
                data-truck-id={truck.id}
              >
                <MessageCircle size={20} strokeWidth={2} aria-hidden="true" />
                Tenho interesse neste caminhão
              </a>
            )}

            <ShareAdButton title={title} text={shareText} />
          </div>

          {specs.length > 0 && (
            <div className="detail-card detail-specs-card">
              <h2 className="detail-section-title">Ficha técnica</h2>
              <dl className="detail-specs-dl">
                {specs.map((spec) => (
                  <div key={spec.label} className="detail-spec-row">
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </aside>
      </div>

      <SiteFooter />

      <style>{`
        /* Breadcrumb */
        .detail-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 800;
          color: var(--muted); padding: 14px 0 8px;
        }
        .detail-breadcrumb a:hover { color: var(--blue); }
        .detail-breadcrumb span[aria-hidden] { color: var(--line); }
        .detail-breadcrumb span:last-child { color: var(--text); }

        /* Cards */
        .detail-gallery-card  { padding: 14px; margin-bottom: 14px; }
        .detail-desc-card     { padding: 22px; margin-bottom: 14px; }
        .detail-aside-header  { padding: 22px; margin-bottom: 14px; }
        .detail-specs-card    { padding: 22px; }
        .detail-safety        { display: flex; gap: 14px; align-items: flex-start; padding: 18px 20px; color: var(--muted); margin-top: 0; }

        /* Mobile header — oculto no desktop */
        .detail-mobile-header { padding: 18px 20px 14px; margin-bottom: 14px; display: none; }

        /* Gallery meta badges */
        .detail-gallery-meta {
          display: flex; align-items: center; gap: 8px;
          flex-wrap: wrap; margin-bottom: 10px;
        }
        .detail-badge {
          display: inline-flex; align-items: center; gap: 5px;
          height: 26px; padding: 0 10px; border-radius: 999px;
          background: var(--blueSoft); color: var(--blue);
          font-size: 12px; font-weight: 950;
        }

        /* Tipografia */
        .detail-h1 {
          margin: 10px 0 6px;
          font-size: clamp(22px, 2.8vw, 34px);
          line-height: 1.1; letter-spacing: -.04em;
        }
        .detail-h1-aside { font-size: clamp(18px, 2vw, 26px); }
        .detail-location {
          display: flex; align-items: center; gap: 5px;
          margin: 0 0 10px; color: var(--muted);
          font-size: 14px; font-weight: 750;
        }
        .detail-section-title {
          margin: 0 0 16px; font-size: 16px;
          font-weight: 950; letter-spacing: -.02em;
        }
        .detail-desc-text {
          margin: 0; color: var(--muted); font-weight: 700;
          line-height: 1.7; white-space: pre-wrap;
        }

        /* Status badge */
        .detail-status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          height: 26px; padding: 0 10px; border-radius: 999px;
          background: #dcfce7; color: #15803d;
          font-size: 12px; font-weight: 950; letter-spacing: .03em;
        }
        body.public-theme-dark .detail-status-badge {
          background: #14532d; color: #86efac;
        }

        /* Preço */
        .detail-price {
          display: block; color: var(--blue);
          font-size: clamp(28px, 3.5vw, 40px);
          line-height: 1; letter-spacing: -.05em; margin: 4px 0 10px;
        }
        .detail-price-mobile {
          display: block; color: var(--blue);
          font-size: 28px; letter-spacing: -.04em;
          line-height: 1; margin-top: 8px;
        }
        .detail-aside-hint {
          margin: 0 0 16px; color: var(--muted);
          font-size: 13px; font-weight: 750; line-height: 1.5;
        }

        /* WhatsApp CTA */
        .detail-whatsapp {
          min-height: 52px; border-radius: 14px;
          background: #25d366; color: #073b1d;
          display: flex; align-items: center; justify-content: center;
          gap: 9px; font-weight: 950; font-size: 15px;
          margin-bottom: 10px;
          box-shadow: 0 8px 20px rgba(37,211,102,.28);
          transition: transform .18s, box-shadow .18s;
          text-decoration: none;
        }
        .detail-whatsapp:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(37,211,102,.36);
        }
        .detail-whatsapp:active { transform: scale(.97); }

        /* Safety */
        .detail-safety-icon { flex-shrink: 0; margin-top: 2px; color: var(--blue); }
        .detail-safety strong { display: block; color: var(--text); font-size: 14px; margin-bottom: 4px; }
        .detail-safety p { margin: 0; font-size: 13px; font-weight: 700; line-height: 1.5; }

        /* Ficha técnica */
        .detail-specs-dl  { display: grid; gap: 0; }
        .detail-spec-row  {
          display: flex; align-items: center;
          justify-content: space-between; gap: 12px;
          padding: 11px 0; border-bottom: 1px solid var(--line);
          font-size: 14px;
        }
        .detail-spec-row:last-child { border-bottom: 0; }
        .detail-spec-row dt { color: var(--muted); font-weight: 800; }
        .detail-spec-row dd { font-weight: 950; text-align: right; }

        /* Aside sticky */
        .detail-aside { position: sticky; top: 80px; align-self: start; }

        /* Responsive */
        @media (max-width: 900px) {
          .detail-aside { position: static; }
          .detail-aside-header .detail-h1,
          .detail-aside-header .detail-location,
          .detail-aside-header .detail-status-badge,
          .detail-aside-header .detail-price { display: none; }
          .detail-mobile-header { display: block; }
        }
        @media (max-width: 560px) {
          .detail-gallery-card,
          .detail-desc-card,
          .detail-aside-header,
          .detail-specs-card,
          .detail-safety { padding: 16px; }
          .detail-whatsapp { min-height: 56px; font-size: 16px; }
        }
      `}</style>
    </main>
  );
}
