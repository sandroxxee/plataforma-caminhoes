import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MapPin, CheckCircle, ShieldCheck, TrendingDown, Info, FileText, Map as MapIcon, Calendar, Gauge, Settings2, Truck as TruckIcon, Zap } from "lucide-react";
import { formatMoney, getLocation, getTitle } from "@/lib/truck-utils";
import { extrairIdDoParametroAnuncio } from "@/lib/slug";
import {
  type Truck,
  truckSelect,
  siteUrl,
  getCanonicalPath,
  getMainImage,
  getSeoTitle,
  getSeoDescription,
  getWhatsappLink,
  getStructuredData,
  getSpecs,
  getPerfilTextos,
  formatKm,
} from "./anuncio-utils";
import { AnuncioGaleria, AnuncioAsideActions } from "./AnuncioDetalheClient";
import { RelatedAds } from "@/components/theme/RelatedAds";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatFlutuante from "@/components/ChatFlutuante";

export const revalidate = 300;

type PageProps = { params: Promise<{ id: string }> };

async function getApprovedTruck(parametro: string): Promise<Truck | null> {
  const supabase = await createClient();
  const { tipo, valor } = extrairIdDoParametroAnuncio(parametro);
  if (tipo !== "uuid" && tipo !== "short_id") return null;

  const query = supabase
    .from("trucks")
    .select(truckSelect)
    .eq("status", "aprovado")
    .eq("vendido", false);

  if (tipo === "uuid") {
    query.eq("id", valor);
  } else {
    query.eq("short_id", valor);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) return null;
  return data as Truck;
}

function FipeBadge({ abaixoFipe }: { abaixoFipe: boolean }) {
  if (!abaixoFipe) return null;
  return (
    <span className="fipe-badge">
      <TrendingDown size={13} strokeWidth={2.5} aria-hidden="true" />
      Abaixo da FIPE
    </span>
  );
}



function SmartDescription({
  text,
  fallback,
  title,
  price,
  whatsapp,
}: {
  text?: string | null;
  fallback: string;
  title: string;
  price: number | null;
  whatsapp: string | null;
}) {
  if (!text?.trim()) return <p className="detail-desc-text">{fallback}</p>;

  const titleLower = title.toLowerCase();
  const priceStr = price ? price.toString() : "";
  const phoneDigits = whatsapp ? whatsapp.replace(/\D/g, "") : "";

  const lines = text
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean)
    .filter(line => {
      const lineLower = line.toLowerCase();
      const cleanLine = lineLower.replace(/[^\w\s]/g, "").trim();

      // 1. Se a linha for idêntica ao título do anúncio
      if (cleanLine === titleLower.replace(/[^\w\s]/g, "").trim()) {
        return false;
      }

      // 2. Se a linha contiver o título + termos redundantes de venda ou ano
      if (cleanLine.includes(titleLower.replace(/[^\w\s]/g, "").trim()) && 
          (lineLower.includes("venda") || lineLower.includes("vendo") || lineLower.includes("oferta") || lineLower.match(/\b\d{4}\b/))) {
        return false;
      }

      // 3. Se a linha for apenas o preço
      if (priceStr) {
        const digits = line.replace(/\D/g, "");
        if (digits === priceStr || digits === (priceStr + "00")) {
          return false;
        }
        if (lineLower.includes("r$") && lineLower.includes(priceStr.slice(0, 3))) {
          return false;
        }
      }

      // 4. Se a linha contiver telefone/contato
      if (phoneDigits && phoneDigits.length >= 8) {
        const lineDigits = line.replace(/\D/g, "");
        if (lineDigits.includes(phoneDigits.slice(-8)) || lineLower.includes("whatsapp") || lineLower.includes("whats") || lineLower.includes("fone") || lineLower.includes("contato")) {
          return false;
        }
      }

      return true;
    });

  if (lines.length === 0) {
    return <p className="detail-desc-text">{fallback}</p>;
  }

  return (
    <div className="smart-desc">
      {lines.map((line, idx) => {
        const isBullet = line.startsWith("•") || line.startsWith("-") || line.startsWith("*") || line.startsWith(">");
        const cleanLine = isBullet ? line.replace(/^[•\-\*>]\s*/, "") : line;

        if (isBullet) {
          return (
            <div key={idx} className="desc-bullet">
              <Zap size={14} className="text-blue-500 mt-1 flex-shrink-0" />
              <span>{cleanLine}</span>
            </div>
          );
        }

        return <p key={idx} className="detail-desc-text">{line}</p>;
      })}
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const truck = await getApprovedTruck(id);
  if (!truck) return { title: "Anúncio não encontrado", robots: { index: false, follow: false } };

  const title       = getTitle(truck);
  const seoTitle    = getSeoTitle(truck);
  const location    = getLocation(truck);
  const price       = formatMoney(truck.preco);
  const description = getSeoDescription(truck, title, location, price);
  const canonical   = getCanonicalPath(truck);
  const url         = `${siteUrl}${canonical}`;
  const image       = getMainImage(truck);

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
    twitter: {
      card: "summary_large_image",
      title: `${seoTitle} | Caminhões à Venda`,
      description,
      images: [image],
    },
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
  };
}

export default async function AnuncioDetalhePage({ params }: PageProps) {
  const { id } = await params;

  const { tipo } = extrairIdDoParametroAnuncio(id);
  if (tipo !== "uuid" && tipo !== "short_id") notFound();

  const truck = await getApprovedTruck(id);
  if (!truck) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let initialFavorito = false;
  if (user) {
    const { data } = await supabase
      .from("favoritos")
      .select("id")
      .eq("truck_id", truck.id)
      .eq("user_id", user.id)
      .maybeSingle();
    initialFavorito = !!data;
  }

  const canonicalPath = getCanonicalPath(truck);
  const currentPath   = `/caminhoes/${id}`;
  if (currentPath !== canonicalPath && !canonicalPath.includes(id)) {
    redirect(canonicalPath);
  }

  const title        = getTitle(truck);
  const location     = getLocation(truck);
  const whatsappLink = getWhatsappLink(truck, title);
  const textos       = getPerfilTextos(truck.perfil);
  const { vehicle: structuredData, product: productData, breadcrumb: breadcrumbData } = getStructuredData(truck, title, location, whatsappLink);
  const shareYear    = truck.ano_modelo || truck.ano_fabricacao;
  const shareText    = `${textos.emoji} ${title}${shareYear ? ` ${shareYear}` : ""}${location ? ` · ${location}` : ""}\n${formatMoney(truck.preco)}`;
  const specs        = getSpecs(truck);
  const initialViews = truck.views ?? 0;
  const abaixoFipe   = (truck as any).abaixo_fipe === true;

  return (
    <main className="market-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <PublicHeader />

      <div className="market-container detail-layout">
        <div>


          {/* Título Mobile acima das Fotos */}
          <div className="mobile-title-container" style={{ padding: "10px 16px 14px", display: "none" }}>
            <h1 className="detail-h1">{title}</h1>
            {location && (
              <p className="detail-location">
                <MapPin size={13} strokeWidth={2} aria-hidden="true" />
                {location}
              </p>
            )}
          </div>

          <AnuncioGaleria
            truckId={truck.id}
            title={title}
            images={truck.truck_images || []}
            initialViews={initialViews}
          />

          <div className="detail-content-blocks" style={{ display: "grid", gap: 14, marginTop: 14 }}>
            <div className="detail-card detail-desc-card">
              <h2 className="detail-section-title">{textos.sobre}</h2>
              <div className="detail-desc-body">
                <SmartDescription
                  text={truck.descricao}
                  fallback={`Este anúncio ainda não possui descrição cadastrada. Fale pelo WhatsApp para confirmar estado ${textos.veiculo === "peça" ? "da" : "do"} ${textos.veiculo}, disponibilidade e condições de negociação.`}
                  title={title}
                  price={truck.preco}
                  whatsapp={truck.whatsapp}
                />

                {/* Preço e Status na última linha da descrição (Mobile) */}
                <div className="mobile-only-price-block" style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)", display: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "var(--muted)" }}>Preço do veículo</span>
                    <FipeBadge abaixoFipe={abaixoFipe} />
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                    <strong style={{ fontSize: 26, fontWeight: 950, color: "var(--blue)" }}>{formatMoney(truck.preco)}</strong>
                    <span className="detail-status-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "#2563eb", border: "1px solid rgba(37, 99, 235, 0.15)" }}>
                      <ShieldCheck size={12} strokeWidth={2.5} aria-hidden="true" style={{ marginRight: 4 }} />
                      Anúncio revisado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="detail-aside">
          <div className="detail-card detail-aside-header">
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <span className="detail-status-badge">
                <CheckCircle size={12} strokeWidth={2.5} aria-hidden="true" />
                Disponível
              </span>
              <span className="detail-status-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "#2563eb", border: "1px solid rgba(37, 99, 235, 0.15)" }}>
                <ShieldCheck size={12} strokeWidth={2.5} aria-hidden="true" style={{ marginRight: 4 }} />
                Anúncio revisado
              </span>
            </div>
            <h1 className="detail-h1 detail-h1-aside">{title}</h1>
            {location && (
              <p className="detail-location">
                <MapPin size={13} strokeWidth={2} aria-hidden="true" />
                {location}
              </p>
            )}
            <strong className="detail-price">{formatMoney(truck.preco)}</strong>
            <FipeBadge abaixoFipe={abaixoFipe} />
            <p className="detail-aside-hint">Fale direto pelo WhatsApp para confirmar disponibilidade e condições de negociação.</p>

            <AnuncioAsideActions
              truckId={truck.id}
              title={title}
              whatsappLink={whatsappLink}
              shareText={shareText}
              whatsappLabel={textos.whatsapp}
              initialFavorito={initialFavorito}
            />
          </div>


        </aside>
      </div>

      <RelatedAds
        currentId={truck.id}
        marca={truck.marca}
        perfil={truck.perfil}
      />

      <SiteFooter />

      <ChatFlutuante truck={truck} />

      <style>{`
        .detail-breadcrumb{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:800;color:var(--muted);padding:14px 0 8px}
        .detail-breadcrumb a:hover{color:var(--blue)}
        .detail-breadcrumb span[aria-hidden]{color:var(--line)}
        .detail-breadcrumb span:last-child{color:var(--text)}
        .detail-gallery-card{padding:14px;margin-bottom:14px}
        .detail-desc-card{padding:22px;}
        .detail-aside-header{padding:22px;margin-bottom:14px}
        .detail-specs-card{padding:22px}
        .detail-specs-card-desktop{padding:22px; margin-top: 14px;}
        .detail-location-card{padding:22px}
        .detail-location-info{display:flex;gap:16px;align-items:center;margin-top:10px}
        .detail-safety{display:flex;gap:14px;align-items:flex-start;padding:18px 20px;color:var(--muted);margin-top:14px}
        .detail-mobile-header{padding:18px 20px 14px;margin-bottom:14px;display:none}
        .detail-h1{margin:10px 0 6px;font-size:clamp(22px,2.8vw,34px);line-height:1.1;letter-spacing:-.04em}
        .detail-h1-aside{font-size:clamp(18px,2vw,26px)}
        .detail-location{display:flex;align-items:center;gap:5px;margin:0 0 10px;color:var(--muted);font-size:14px;font-weight:750}
        .detail-section-title{margin:0 0 16px;font-size:16px;font-weight:950;letter-spacing:-.02em}
        .detail-desc-text{margin:0 0 12px;color:var(--muted);font-weight:700;line-height:1.7;white-space:pre-wrap}
        .detail-desc-text:last-child{margin-bottom:0}
        .highlights-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; }
        .highlight-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--soft); border-radius: 14px; border: 1px solid var(--line); }
        .highlight-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--surface); color: var(--blue); border-radius: 10px; flex-shrink: 0; box-shadow: var(--shadow); }
        .highlight-info { display: flex; flex-direction: column; gap: 2px; }
        .highlight-label { font-size: 11px; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .highlight-value { font-size: 14px; font-weight: 950; color: var(--text); }
        .smart-desc { display: flex; flex-direction: column; gap: 8px; }
        .desc-bullet { display: flex; gap: 10px; align-items: flex-start; padding: 12px; background: rgba(59,130,246,0.05); border-radius: 12px; font-size: 14px; font-weight: 750; color: var(--text); line-height: 1.5; border-left: 3px solid var(--blue); }
        @media(max-width:560px){
          .highlights-grid { grid-template-columns: 1fr; gap: 8px; }
          .highlight-item { padding: 10px; }
          .highlight-icon { width: 32px; height: 32px; }
          .highlight-value { font-size: 13px; }
        }
        .detail-status-badge{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 10px;border-radius:999px;background:#dcfce7;color:#15803d;font-size:12px;font-weight:950;letter-spacing:.03em}
        body.public-theme-dark .detail-status-badge{background:#14532d;color:#86efac}
        .detail-price{display:block;color:var(--blue);font-size:clamp(28px,3.5vw,40px);line-height:1;letter-spacing:-.05em;margin:4px 0 6px}
        .detail-price-mobile{display:block;color:var(--blue);font-size:28px;letter-spacing:-.04em;line-height:1;margin-top:8px}
        .fipe-badge{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:950;letter-spacing:.01em;margin-bottom:10px;background:#dcfce7;color:#15803d}
        body.public-theme-dark .fipe-badge{background:#14532d;color:#86efac}
        .detail-aside-hint{margin:0 0 16px;color:var(--muted);font-size:13px;font-weight:750;line-height:1.5}
        .detail-safety-icon{flex-shrink:0;margin-top:2px;color:var(--blue)}
        .detail-safety strong{display:block;color:var(--text);font-size:14px;margin-bottom:4px}
        .detail-safety p{margin:0;font-size:13px;font-weight:700;line-height:1.5}
        .detail-specs-dl{display:grid;gap:0}
        .detail-spec-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid var(--line);font-size:14px}
        .detail-spec-row:last-child{border-bottom:0}
        .detail-spec-row dt{color:var(--muted);font-weight:800}
        .detail-spec-row dd{font-weight:950;text-align:right}
        .detail-aside{position:sticky;top:80px;align-self:start}
        .detail-tabs-wrap { margin-top: 14px; }
        .detail-tabs-list {
          display: flex; gap: 8px; background: var(--soft);
          padding: 6px; border-radius: 16px; margin-bottom: 14px;
          border: 1px solid var(--line);
        }
        .detail-tab-trigger {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 8px; height: 40px; border-radius: 12px;
          font-size: 14px; font-weight: 800; color: var(--muted);
          transition: all 0.2s; border: none; background: transparent; cursor: pointer;
        }
        .detail-tab-trigger[data-state="active"] {
          background: var(--surface); color: var(--blue);
          box-shadow: var(--shadow);
        }
        .detail-tab-content { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @media(max-width:900px){
          .detail-aside{position:static}
          .detail-aside-header .detail-h1,.detail-aside-header .detail-location,.detail-aside-header .detail-status-badge,.detail-aside-header .detail-price,.detail-aside-header .fipe-badge{display:none}
          .mobile-title-container {
            display: block !important;
            text-align: center;
          }
          .mobile-title-container .detail-h1 {
            font-size: 22px;
            margin-bottom: 6px;
            text-align: center;
          }
          .mobile-title-container .detail-location {
            justify-content: center;
            margin-bottom: 0;
          }
          .mobile-only-price-block {
            display: block !important;
          }
          .detail-breadcrumb {
            justify-content: center;
            font-size: 11px;
            padding: 10px 0;
          }
          .detail-specs-card-desktop { display: none; }
        }
        @media(max-width:560px){
          .detail-gallery-card,.detail-desc-card,.detail-aside-header,.detail-specs-card,.detail-safety{padding:16px}
          .detail-tab-trigger { font-size: 12px; gap: 4px; }
          .mobile-title-container .detail-h1 {
            font-size: 19px;
          }
        }
      `}</style>
    </main>
  );
}
