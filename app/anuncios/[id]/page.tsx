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
import { ViewCounter } from "@/components/ViewCounter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const siteUrl = "https://caminhoesavenda.com";
const defaultOgImage = "/og-caminhoes-a-venda.jpg";
const truckSelect = `id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,descricao,whatsapp,views,truck_images(image_url,principal,ordem)`;

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
  if (`/anuncios/${id}` !== canonicalPath) redirect(canonicalPath);

  const title = getTitle(truck);
  const location = getLocation(truck);
  const whatsappLink = getWhatsappLink(truck, title);
  const structuredData = getStructuredData(truck, title, location, whatsappLink);
  const shareYear = truck.ano_modelo || truck.ano_fabricacao;
  const shareText = `🚛 ${getCardTitle(truck)}${shareYear ? ` ${shareYear}` : ""}`;
  const photoCount = (truck.truck_images || []).length;
  const initialViews = truck.views ?? 0;

  // Specs: apenas campos com valor
  const specs = [
    { label: "Marca", value: truck.marca },
    { label: "Modelo", value: truck.modelo },
    { label: "Ano/modelo", value: truck.ano_modelo || truck.ano_fabricacao },
    { label: "Quilometragem", value: formatKm(truck.quilometragem || truck.km) === "Não informado" ? null : formatKm(truck.quilometragem || truck.km) },
    { label: "Tração", value: truck.tracao },
    { label: "Carroceria", value: truck.carroceria },
    { label: "Cidade", value: location },
  ].filter((s) => s.value);

  return (
    <main className="market-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PublicHeader />

      <div className="market-container detail-layout">

        {/* ===== COLUNA ESQUERDA ===== */}
        <div>

          {/* Breadcrumb */}
          <nav className="detail-breadcrumb" aria-label="Navegação">
            <Link href="/">Início</Link>
            <span aria-hidden="true">›</span>
            <Link href="/anuncios">Caminhões</Link>
            <span aria-hidden="true">›</span>
            <span>{truck.marca || "Anúncio"}</span>
          </nav>

          {/* Título mobile (aparece antes da galeria no mobile) */}
          <div className="detail-card detail-mobile-title">
            <h1 className="detail-h1">{title}</h1>
            {location && <p className="detail-location">📍 {location}</p>}
            <strong className="detail-price-mobile">{formatMoney(truck.preco)}</strong>
          </div>

          {/* Galeria */}
          <div className="detail-card detail-gallery-card">
            <div className="detail-gallery-meta">
              {photoCount > 0 && (
                <div className="detail-photo-count">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  {photoCount} {photoCount === 1 ? "foto" : "fotos"}
                </div>
              )}
              <ViewCounter truckId={truck.id} initialViews={initialViews} />
            </div>
            <AdGallery title={title} images={truck.truck_images || []} />
          </div>

          {/* Descrição */}
          <div className="detail-card detail-desc-card">
            <h2 className="detail-section-title">Sobre este caminhão</h2>
            <p className="detail-desc-text">
              {truck.descricao?.trim() ||
                "Este anúncio ainda não possui descrição cadastrada. Fale pelo WhatsApp para confirmar estado do veículo, disponibilidade e condições de negociação."}
            </p>
          </div>

          {/* Aviso de segurança */}
          <div className="detail-card detail-safety">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div>
              <strong>Anúncio revisado</strong>
              <p>Todos os anúncios passam por aprovação antes de aparecer no site. Sempre confira documentos e estado do veículo antes de fechar negócio.</p>
            </div>
          </div>
        </div>

        {/* ===== COLUNA DIREITA (ASIDE sticky) ===== */}
        <aside className="detail-aside">

          {/* Título + preço (desktop) */}
          <div className="detail-card detail-aside-header">
            <span className="detail-status-badge">✅ Disponível</span>
            <h1 className="detail-h1 detail-h1-aside">{title}</h1>
            {location && <p className="detail-location">📍 {location}</p>}
            <strong className="detail-price">{formatMoney(truck.preco)}</strong>
            <p className="detail-aside-hint">Fale direto pelo WhatsApp para confirmar disponibilidade e condições de negociação.</p>

            {/* Botão WhatsApp */}
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="detail-whatsapp"
                data-whatsapp-click
                data-truck-id={truck.id}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.563 4.14 1.546 5.877L.057 23.886l6.187-1.621A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.045-1.393l-.361-.215-3.735.979.995-3.638-.235-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                </svg>
                Tenho interesse neste caminhão
              </a>
            ) : null}

            <ShareAdButton title={title} text={shareText} />
          </div>

          {/* Ficha técnica */}
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
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 800;
          color: var(--muted);
          padding: 14px 0 8px;
        }
        .detail-breadcrumb a:hover { color: var(--blue); }
        .detail-breadcrumb span[aria-hidden] { color: var(--line); }
        .detail-breadcrumb span:last-child { color: var(--text); }

        /* Cards do layout */
        .detail-gallery-card { padding: 14px; margin-bottom: 14px; }
        .detail-desc-card { padding: 22px; margin-bottom: 14px; }
        .detail-aside-header { padding: 22px; margin-bottom: 14px; }
        .detail-specs-card { padding: 22px; }

        /* Título mobile */
        .detail-mobile-title { padding: 18px 20px 14px; margin-bottom: 14px; display: none; }

        /* Meta da galeria (fotos + views) */
        .detail-gallery-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        /* Contador de fotos */
        .detail-photo-count {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          height: 26px;
          padding: 0 10px;
          border-radius: 999px;
          background: var(--blueSoft);
          color: var(--blue);
          font-size: 12px;
          font-weight: 950;
        }

        /* Contador de visualizações */
        .detail-views-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          height: 26px;
          padding: 0 10px;
          border-radius: 999px;
          background: var(--soft);
          color: var(--muted);
          font-size: 12px;
          font-weight: 950;
          border: 1px solid var(--line);
        }

        /* Título */
        .detail-h1 {
          margin: 10px 0 6px;
          font-size: clamp(22px, 2.8vw, 34px);
          line-height: 1.1;
          letter-spacing: -.04em;
        }
        .detail-h1-aside { font-size: clamp(18px, 2vw, 26px); }
        .detail-location {
          margin: 0 0 10px;
          color: var(--muted);
          font-size: 14px;
          font-weight: 750;
        }
        .detail-status-badge {
          display: inline-flex;
          height: 26px;
          align-items: center;
          padding: 0 10px;
          border-radius: 999px;
          background: #dcfce7;
          color: #15803d;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .03em;
        }
        body.public-theme-dark .detail-status-badge { background: #14532d; color: #86efac; }

        /* Preço desktop (aside) */
        .detail-price {
          display: block;
          color: var(--blue);
          font-size: clamp(28px, 3.5vw, 40px);
          line-height: 1;
          letter-spacing: -.05em;
          margin: 4px 0 10px;
        }
        /* Preço mobile */
        .detail-price-mobile {
          display: block;
          color: var(--blue);
          font-size: 28px;
          letter-spacing: -.04em;
          line-height: 1;
          margin-top: 8px;
        }
        .detail-aside-hint {
          margin: 0 0 16px;
          color: var(--muted);
          font-size: 13px;
          font-weight: 750;
          line-height: 1.5;
        }

        /* WhatsApp */
        .detail-whatsapp {
          min-height: 52px;
          border-radius: 14px;
          background: #25d366;
          color: #073b1d;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-weight: 950;
          font-size: 15px;
          margin-bottom: 10px;
          box-shadow: 0 8px 20px rgba(37,211,102,.28);
          transition: transform .18s, box-shadow .18s;
        }
        .detail-whatsapp:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(37,211,102,.36);
        }
        .detail-whatsapp:active { transform: scale(.97); }

        /* Ficha técnica */
        .detail-section-title {
          margin: 0 0 16px;
          font-size: 16px;
          font-weight: 950;
          letter-spacing: -.02em;
        }
        .detail-specs-dl { display: grid; gap: 0; }
        .detail-spec-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid var(--line);
          font-size: 14px;
        }
        .detail-spec-row:last-child { border-bottom: 0; }
        .detail-spec-row dt { color: var(--muted); font-weight: 800; }
        .detail-spec-row dd { font-weight: 950; text-align: right; }

        /* Descrição */
        .detail-desc-text {
          margin: 0;
          color: var(--muted);
          font-weight: 700;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        /* Aviso de segurança */
        .detail-safety {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 18px 20px;
          color: var(--muted);
          margin-top: 0;
        }
        .detail-safety svg { flex-shrink: 0; margin-top: 2px; color: var(--blue); }
        .detail-safety strong { display: block; color: var(--text); font-size: 14px; margin-bottom: 4px; }
        .detail-safety p { margin: 0; font-size: 13px; font-weight: 700; line-height: 1.5; }

        /* Aside sticky */
        .detail-aside { position: sticky; top: 80px; align-self: start; }

        /* Mobile */
        @media (max-width: 900px) {
          .detail-aside { position: static; }
          .detail-aside-header .detail-h1,
          .detail-aside-header .detail-location,
          .detail-aside-header .detail-status-badge,
          .detail-aside-header .detail-price { display: none; }
          .detail-mobile-title { display: block; }
        }
        @media (max-width: 560px) {
          .detail-gallery-card, .detail-desc-card, .detail-aside-header, .detail-specs-card, .detail-safety { padding: 16px; }
          .detail-whatsapp { min-height: 56px; font-size: 16px; }
        }
      `}</style>
    </main>
  );
}
