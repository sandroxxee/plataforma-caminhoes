import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MapPin, CheckCircle, ShieldCheck, TrendingDown, Info, FileText, Map as MapIcon, Calendar, Gauge, Settings2, Truck as TruckIcon, Zap } from "lucide-react";
import { formatMoney, getLocation, getTitle, formatKm } from "@/lib/truck-utils";
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
  if (tipo !== "uuid") return null;

  const { data, error } = await supabase
    .from("trucks")
    .select(truckSelect)
    .eq("id", valor)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .maybeSingle();

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

function AnuncioHighlights({ truck }: { truck: Truck }) {
  const highlights = [
    { label: "Ano", value: truck.ano_modelo || truck.ano_fabricacao, icon: <Calendar size={18} /> },
    { label: "Quilometragem", value: formatKm(truck.quilometragem || truck.km), icon: <Gauge size={18} /> },
    { label: "Tração", value: truck.tracao, icon: <Settings2 size={18} /> },
    { label: "Carroceria", value: truck.carroceria, icon: <TruckIcon size={18} /> },
  ].filter(h => h.value);

  if (highlights.length === 0) return null;

  return (
    <div className="highlights-grid">
      {highlights.map((h) => (
        <div key={h.label} className="highlight-item">
          <div className="highlight-icon">{h.icon}</div>
          <div className="highlight-info">
            <span className="highlight-label">{h.label}</span>
            <span className="highlight-value">{h.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SmartDescription({ text, fallback }: { text?: string | null; fallback: string }) {
  if (!text?.trim()) return <p className="detail-desc-text">{fallback}</p>;

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

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

  const { tipo, valor: uuid } = extrairIdDoParametroAnuncio(id);
  if (tipo !== "uuid") notFound();

  const truck = await getApprovedTruck(id);
  if (!truck) notFound();

  const canonicalPath = getCanonicalPath(truck);
  const currentPath   = `/anuncios/${id}`;
  if (currentPath !== canonicalPath) {
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
          <nav className="detail-breadcrumb" aria-label="Navegação">
            <Link href="/">Ínicio</Link>
            <span aria-hidden="true">›</span>
            <Link href="/anuncios">Anúncios</Link>
            <span aria-hidden="true">›</span>
            <span>{truck.marca || truck.perfil || "Anúncio"}</span>
          </nav>

          <AnuncioGaleria
            truckId={truck.id}
            title={title}
            images={truck.truck_images || []}
            initialViews={initialViews}
          />

          <div className="detail-card detail-mobile-header">
            <h1 className="detail-h1">{title}</h1>
            {location && (
              <p className="detail-location">
                <MapPin size={13} strokeWidth={2} aria-hidden="true" />
                {location}
              </p>
            )}
            <strong className="detail-price-mobile">{formatMoney(truck.preco)}</strong>
            <FipeBadge abaixoFipe={abaixoFipe} />
          </div>

          <div className="detail-tabs-wrap">
            <Tabs defaultValue="sobre" className="w-full">
              <TabsList className="detail-tabs-list">
                <TabsTrigger value="sobre" className="detail-tab-trigger">
                  <Info size={16} /> Sobre
                </TabsTrigger>
                {specs.length > 0 && (
                  <TabsTrigger value="ficha" className="detail-tab-trigger">
                    <FileText size={16} /> Ficha Técnica
                  </TabsTrigger>
                )}
                <TabsTrigger value="localizacao" className="detail-tab-trigger">
                  <MapIcon size={16} /> Localização
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sobre" className="detail-tab-content">
                <div className="detail-card detail-desc-card">
                  <h2 className="detail-section-title">{textos.sobre}</h2>

                  <AnuncioHighlights truck={truck} />

                  <div className="detail-desc-body">
                    <SmartDescription
                      text={truck.descricao}
                      fallback={`Este anúncio ainda não possui descrição cadastrada. Fale pelo WhatsApp para confirmar estado ${textos.veiculo === "peça" ? "da" : "do"} ${textos.veiculo}, disponibilidade e condições de negociação.`}
                    />
                  </div>
                </div>
              </TabsContent>

              {specs.length > 0 && (
                <TabsContent value="ficha" className="detail-tab-content">
                  <div className="detail-card detail-specs-card">
                    <h2 className="detail-section-title">{textos.ficha}</h2>
                    <dl className="detail-specs-dl">
                      {specs.map((spec) => (
                        <div key={spec.label} className="detail-spec-row">
                          <dt>{spec.label}</dt>
                          <dd>{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </TabsContent>
              )}

              <TabsContent value="localizacao" className="detail-tab-content">
                <div className="detail-card detail-location-card">
                  <h2 className="detail-section-title">Localização do Veículo</h2>
                  <div className="detail-location-info">
                    <MapPin size={24} className="text-blue-500" />
                    <div>
                      <p className="text-lg font-bold">{location || "Localização não informada"}</p>
                      <p className="text-muted-foreground text-sm">Entre em contato com o vendedor para agendar uma visita e ver o veículo pessoalmente.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="detail-card detail-safety">
            <ShieldCheck size={18} strokeWidth={1.8} className="detail-safety-icon" aria-hidden="true" />
            <div>
              <strong>Anúncio revisado</strong>
              <p>Todos os anúncios passam por aprovação antes de aparecer no site. Sempre confira documentos e estado {textos.veiculo === "peça" ? "da peça" : `do ${textos.veiculo}`} antes de fechar negócio.</p>
            </div>
          </div>
        </div>

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
            <FipeBadge abaixoFipe={abaixoFipe} />
            <p className="detail-aside-hint">Fale direto pelo WhatsApp para confirmar disponibilidade e condições de negociação.</p>

            <AnuncioAsideActions
              truckId={truck.id}
              title={title}
              whatsappLink={whatsappLink}
              shareText={shareText}
              whatsappLabel={textos.whatsapp}
            />
          </div>

          {specs.length > 0 && (
            <div className="detail-card detail-specs-card-desktop">
              <h2 className="detail-section-title">{textos.ficha}</h2>
              <dl className="detail-specs-dl">
                {specs.slice(0, 6).map((spec) => (
                  <div key={spec.label} className="detail-spec-row">
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
              {specs.length > 6 && (
                <p className="text-xs text-muted-foreground mt-3 font-bold text-center">Veja a ficha completa nas abas ao lado.</p>
              )}
            </div>
          )}
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
          .detail-mobile-header{display:block}
          .detail-specs-card-desktop { display: none; }
        }
        @media(max-width:560px){
          .detail-gallery-card,.detail-desc-card,.detail-aside-header,.detail-specs-card,.detail-safety{padding:16px}
          .detail-tab-trigger { font-size: 12px; gap: 4px; }
        }
      `}</style>
    </main>
  );
}
