import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MapPin, CheckCircle, ShieldCheck } from "lucide-react";
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
} from "./anuncio-utils";
import { AnuncioGaleria, AnuncioAsideActions } from "./AnuncioDetalheClient";
import { ChatWidget } from "@/components/ChatWidget";
import { RelatedAds } from "@/components/theme/RelatedAds";

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

  // Extrai o UUID do parâmetro (aceita UUID puro OU slug-completo-terminando-em-uuid)
  const { tipo, valor: uuid } = extrairIdDoParametroAnuncio(id);

  // Parâmetro sem UUID reconhecível → 404 imediato
  if (tipo !== "uuid") notFound();

  const truck = await getApprovedTruck(id);
  if (!truck) notFound();

  // Garante que a URL seja sempre o slug canônico
  // Ex: UUID puro → redireciona para slug completo
  // Ex: slug antigo com UUID embutido mas diferente do canônico → redireciona
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

  return (
    <main className="market-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <PublicHeader />

      <div className="market-container detail-layout">
        <div>
          <nav className="detail-breadcrumb" aria-label="Navegação">
            <Link href="/">Início</Link>
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
          </div>

          <div className="detail-card detail-desc-card">
            <h2 className="detail-section-title">{textos.sobre}</h2>
            <p className="detail-desc-text">
              {truck.descricao?.trim() || `Este anúncio ainda não possui descrição cadastrada. Fale pelo WhatsApp para confirmar estado ${textos.veiculo === "peça" ? "da" : "do"} ${textos.veiculo}, disponibilidade e condições de negociação.`}
            </p>
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
          )}
        </aside>
      </div>

      <RelatedAds
        currentId={truck.id}
        marca={truck.marca}
        perfil={truck.perfil}
      />

      <SiteFooter />

      <ChatWidget
        truckId={truck.id}
        truckTitulo={title}
        vendedorId={truck.user_id ?? ""}
      />

      <style>{`
        .detail-breadcrumb{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:800;color:var(--muted);padding:14px 0 8px}
        .detail-breadcrumb a:hover{color:var(--blue)}
        .detail-breadcrumb span[aria-hidden]{color:var(--line)}
        .detail-breadcrumb span:last-child{color:var(--text)}
        .detail-gallery-card{padding:14px;margin-bottom:14px}
        .detail-desc-card{padding:22px;margin-bottom:14px}
        .detail-aside-header{padding:22px;margin-bottom:14px}
        .detail-specs-card{padding:22px}
        .detail-safety{display:flex;gap:14px;align-items:flex-start;padding:18px 20px;color:var(--muted);margin-top:0}
        .detail-mobile-header{padding:18px 20px 14px;margin-bottom:14px;display:none}
        .detail-gallery-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px}
        .detail-badge{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 10px;border-radius:999px;background:var(--blueSoft);color:var(--blue);font-size:12px;font-weight:950}
        .detail-h1{margin:10px 0 6px;font-size:clamp(22px,2.8vw,34px);line-height:1.1;letter-spacing:-.04em}
        .detail-h1-aside{font-size:clamp(18px,2vw,26px)}
        .detail-location{display:flex;align-items:center;gap:5px;margin:0 0 10px;color:var(--muted);font-size:14px;font-weight:750}
        .detail-section-title{margin:0 0 16px;font-size:16px;font-weight:950;letter-spacing:-.02em}
        .detail-desc-text{margin:0;color:var(--muted);font-weight:700;line-height:1.7;white-space:pre-wrap}
        .detail-status-badge{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 10px;border-radius:999px;background:#dcfce7;color:#15803d;font-size:12px;font-weight:950;letter-spacing:.03em}
        body.public-theme-dark .detail-status-badge{background:#14532d;color:#86efac}
        .detail-price{display:block;color:var(--blue);font-size:clamp(28px,3.5vw,40px);line-height:1;letter-spacing:-.05em;margin:4px 0 10px}
        .detail-price-mobile{display:block;color:var(--blue);font-size:28px;letter-spacing:-.04em;line-height:1;margin-top:8px}
        .detail-aside-hint{margin:0 0 16px;color:var(--muted);font-size:13px;font-weight:750;line-height:1.5}
        .detail-whatsapp{min-height:52px;border-radius:14px;background:#25d366;color:#073b1d;display:flex;align-items:center;justify-content:center;gap:9px;font-weight:950;font-size:15px;margin-bottom:10px;box-shadow:0 8px 20px rgba(37,211,102,.28);transition:transform .18s,box-shadow .18s;text-decoration:none}
        .detail-whatsapp:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(37,211,102,.36)}
        .detail-whatsapp:active{transform:scale(.97)}
        .detail-safety-icon{flex-shrink:0;margin-top:2px;color:var(--blue)}
        .detail-safety strong{display:block;color:var(--text);font-size:14px;margin-bottom:4px}
        .detail-safety p{margin:0;font-size:13px;font-weight:700;line-height:1.5}
        .detail-specs-dl{display:grid;gap:0}
        .detail-spec-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid var(--line);font-size:14px}
        .detail-spec-row:last-child{border-bottom:0}
        .detail-spec-row dt{color:var(--muted);font-weight:800}
        .detail-spec-row dd{font-weight:950;text-align:right}
        .detail-aside{position:sticky;top:80px;align-self:start}
        @media(max-width:900px){
          .detail-aside{position:static}
          .detail-aside-header .detail-h1,.detail-aside-header .detail-location,.detail-aside-header .detail-status-badge,.detail-aside-header .detail-price{display:none}
          .detail-mobile-header{display:block}
        }
        @media(max-width:560px){
          .detail-gallery-card,.detail-desc-card,.detail-aside-header,.detail-specs-card,.detail-safety{padding:16px}
          .detail-whatsapp{min-height:56px;font-size:16px}
        }
      `}</style>
    </main>
  );
}
