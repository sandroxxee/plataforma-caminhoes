import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { getHomeContent } from "@/lib/site-content";
import { BrandsSection } from "@/components/theme/BrandsSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TruckCard } from "@/components/theme/TruckCard";
import type { TruckCardData } from "@/components/theme/TruckCard";
import Image from "next/image";
import Link from "next/link";
import { Truck, Container, Wrench, Tractor, Package, Store } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Caminhões à Venda | Anúncios de caminhões e implementos",
  description:
    "Veja caminhões usados, seminovos e implementos anunciados no Caminhões à Venda. Plataforma para comprar, vender e anunciar com contato direto pelo WhatsApp.",
  alternates: { canonical: "/" },
};

const CATEGORIAS = [
  { href: "/caminhoes",   icon: <Truck     size={32} strokeWidth={1.5} />, label: "Caminhões" },
  { href: "/carretas",    icon: <Container size={32} strokeWidth={1.5} />, label: "Carretas" },
  { href: "/implementos", icon: <Wrench    size={32} strokeWidth={1.5} />, label: "Implementos" },
  { href: "/maquinas",    icon: <Tractor   size={32} strokeWidth={1.5} />, label: "Máquinas" },
  { href: "/pecas",       icon: <Package   size={32} strokeWidth={1.5} />, label: "Peças" },
  { href: "/revendas",    icon: <Store     size={32} strokeWidth={1.5} />, label: "Revendas" },
];

export default async function HomePage() {
  const supabase = await createClient();

  // ── conteúdo dinâmico do admin/aparencia ─────────────────────────────────
  const content = await getHomeContent(supabase);

  // ── últimos anúncios ──────────────────────────────────────────────────────
  const { data: trucksData } = await supabase
    .from("trucks")
    .select(`
      id, titulo, marca, modelo, ano_modelo, ano_fabricacao,
      preco, cidade, estado, carroceria, tracao, whatsapp,
      destaque, created_at,
      truck_images ( image_url, principal, ordem )
    `)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .order("created_at", { ascending: false })
    .limit(8);

  const trucks = (trucksData || []) as TruckCardData[];

  return (
    <main className="premium-page">
      <PublicHeader />

      <div className="premium-main">

        {/* ── HERO BANNER (quando definido no admin) ───────────────────── */}
        {content.heroBannerUrl && (
          <section className="hero-banner-wrap">
            <div className="hero-banner-inner">
              <Image
                src={content.heroBannerUrl}
                alt="Banner principal"
                fill
                priority
                className="hero-banner-img"
                sizes="100vw"
              />
              <div className="hero-banner-overlay" />
              <div className="hero-banner-content">
                {content.heroMini && (
                  <span className="eyebrow white">{content.heroMini}</span>
                )}
                <h1 className="hero-title">{content.heroTitle}</h1>
                {content.heroSubtitle && (
                  <p className="hero-subtitle">{content.heroSubtitle}</p>
                )}
                <div className="hero-actions">
                  <Link href={content.primaryButtonHref} className="hero-btn-primary">
                    {content.primaryButtonText}
                  </Link>
                  <Link href={content.secondaryButtonHref} className="hero-btn-secondary">
                    {content.secondaryButtonText}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── HERO TEXTO (quando NÃO há banner) ───────────────────────── */}
        {!content.heroBannerUrl && (
          <section className="section-wrap">
            <div className="hero-text-block">
              {content.heroMini && (
                <span className="eyebrow blue">{content.heroMini}</span>
              )}
              <h1 className="title">{content.heroTitle}</h1>
              {content.heroSubtitle && (
                <p className="hero-text-sub">{content.heroSubtitle}</p>
              )}
              <div className="hero-text-actions">
                <Link href={content.primaryButtonHref} className="btn-primary">
                  {content.primaryButtonText}
                </Link>
                <Link href={content.secondaryButtonHref} className="btn-outline">
                  {content.secondaryButtonText}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── FAIXA DE CONFIANÇA ───────────────────────────────────────── */}
        {(content.trust1Title || content.trust2Title) && (
          <section className="section-wrap">
            <div className="trust-strip">
              {[
                { t: content.trust1Title, d: content.trust1Text },
                { t: content.trust2Title, d: content.trust2Text },
                { t: content.trust3Title, d: content.trust3Text },
                { t: content.trust4Title, d: content.trust4Text },
              ].filter(i => i.t).map((item, i) => (
                <div key={i} className="trust-item">
                  <strong className="trust-title">{item.t}</strong>
                  {item.d && <span className="trust-desc">{item.d}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── ÚLTIMOS ANÚNCIOS ─────────────────────────────────────────── */}
        <section className="section-wrap">
          <div className="premium-section">
            <div className="section-header">
              <div className="title-box">
                <span className="eyebrow">Recém adicionados</span>
                <h2 className="title">Últimos anúncios</h2>
              </div>
              <Link href="/anuncios" className="view-all">Ver todos anúncios →</Link>
            </div>
            {trucks.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum anúncio disponível no momento.</p>
              </div>
            ) : (
              <div className="premium-grid">
                {trucks.map((t) => (
                  <TruckCard key={t.id} truck={t} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── TEXTOS COMERCIAIS (compra / venda / segurança) ───────────── */}
        {(content.buyerTitle || content.sellerTitle || content.securityTitle) && (
          <section className="section-wrap">
            <div className="commercial-grid">
              {[
                { t: content.buyerTitle,    d: content.buyerText },
                { t: content.sellerTitle,   d: content.sellerText },
                { t: content.securityTitle, d: content.securityText },
              ].filter(i => i.t).map((item, i) => (
                <div key={i} className="commercial-card">
                  <strong className="commercial-title">{item.t}</strong>
                  {item.d && <p className="commercial-desc">{item.d}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SOBRE / CATEGORIAS ──────────────────────────────────────── */}
        <section className="section-wrap">
          <div className="home-sobre-card">
            <div className="sobre-content">
              <span className="eyebrow blue">Plataforma completa</span>
              <h2 className="sobre-title">Tudo para comprar e vender veículos pesados</h2>
              <p className="sobre-desc">
                O <strong>Caminhões à Venda</strong> é a plataforma especializada para quem compra
                ou vende caminhões, carretas, implementos, máquinas e peças no Brasil.
              </p>
              <div className="sobre-actions">
                <Link href={content.primaryButtonHref} className="btn-primary">
                  {content.primaryButtonText}
                </Link>
                <Link href={content.secondaryButtonHref} className="btn-outline">
                  {content.secondaryButtonText}
                </Link>
              </div>
            </div>
            <div className="sobre-cats-grid">
              {CATEGORIAS.map((c) => (
                <Link key={c.href} href={c.href} className="cat-chip">
                  <span className="cat-icon-wrap">{c.icon}</span>
                  <strong className="cat-label">{c.label}</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CHAMADA PARA ANUNCIAR ────────────────────────────────────── */}
        {content.sellTitle && (
          <section className="section-wrap">
            <div className="sell-cta-card">
              {content.sellMini && (
                <span className="eyebrow white">{content.sellMini}</span>
              )}
              <h2 className="sell-title">{content.sellTitle}</h2>
              {content.sellText && (
                <p className="sell-text">{content.sellText}</p>
              )}
              <Link href={content.secondaryButtonHref} className="sell-btn">
                {content.secondaryButtonText}
              </Link>
            </div>
          </section>
        )}

        {/* ── COMO FUNCIONA ────────────────────────────────────────────── */}
        <div className="section-wrap">
          <HowItWorksSection />
        </div>

        {/* ── CHAMADA FINAL ────────────────────────────────────────────── */}
        {content.finalTitle && (
          <section className="section-wrap">
            <div className="final-cta">
              {content.finalMini && (
                <span className="eyebrow blue">{content.finalMini}</span>
              )}
              <h2 className="final-title">{content.finalTitle}</h2>
              <div className="final-actions">
                <Link href={content.primaryButtonHref}   className="btn-primary">{content.primaryButtonText}</Link>
                <Link href={content.secondaryButtonHref} className="btn-outline">{content.secondaryButtonText}</Link>
              </div>
            </div>
          </section>
        )}

      </div>

      <SiteFooter />

      <style>{`
        /* ── base ────────────────────────────────────────────────── */
        .premium-page { min-height: 100vh; background: #f8fafc; color: #0f172a; }
        .premium-main { display: flex; flex-direction: column; gap: 40px; padding: 40px 0 80px; }
        .section-wrap  { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 20px; }

        /* ── eyebrow ─────────────────────────────────────────────── */
        .eyebrow { font-size:11px; font-weight:900; text-transform:uppercase; letter-spacing:.1em; color:#64748b; margin-bottom:4px; display:block; }
        .eyebrow.blue  { color:#2563eb; }
        .eyebrow.white { color:rgba(255,255,255,.75); }

        /* ── hero banner ─────────────────────────────────────────── */
        .hero-banner-wrap  { width:100%; }
        .hero-banner-inner { position:relative; width:100%; height:clamp(280px,40vw,520px); overflow:hidden; }
        .hero-banner-img   { object-fit:cover; }
        .hero-banner-overlay { position:absolute; inset:0; background:linear-gradient(to right,rgba(0,0,0,.65) 0%,rgba(0,0,0,.25) 60%,transparent 100%); }
        .hero-banner-content { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:0 clamp(20px,5vw,80px); max-width:680px; }
        .hero-title   { font-size:clamp(26px,4vw,52px); font-weight:900; letter-spacing:-.04em; line-height:1.05; margin:8px 0 16px; color:#fff; }
        .hero-subtitle { font-size:clamp(14px,1.8vw,18px); color:rgba(255,255,255,.85); line-height:1.6; margin:0 0 32px; max-width:520px; }
        .hero-actions { display:flex; gap:14px; flex-wrap:wrap; }
        .hero-btn-primary  { height:52px; padding:0 32px; border-radius:16px; background:#fff; color:#0f172a; font-weight:900; display:inline-flex; align-items:center; transition:all .2s; text-decoration:none; }
        .hero-btn-primary:hover  { background:#f1f5f9; transform:translateY(-2px); }
        .hero-btn-secondary { height:52px; padding:0 32px; border-radius:16px; background:transparent; border:2px solid rgba(255,255,255,.6); color:#fff; font-weight:900; display:inline-flex; align-items:center; transition:all .2s; text-decoration:none; }
        .hero-btn-secondary:hover { border-color:#fff; background:rgba(255,255,255,.1); }

        /* ── hero texto (sem banner) ─────────────────────────────── */
        .hero-text-block { padding:48px 0 16px; }
        .hero-text-sub   { font-size:18px; color:#64748b; line-height:1.6; margin:12px 0 28px; max-width:600px; }
        .hero-text-actions { display:flex; gap:16px; flex-wrap:wrap; }

        /* ── faixa de confiança ──────────────────────────────────── */
        .trust-strip { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; }
        .trust-item  { padding:20px 24px; border-radius:20px; background:#fff; border:1px solid rgba(0,0,0,.04); box-shadow:0 2px 8px rgba(0,0,0,.03); display:flex; flex-direction:column; gap:4px; }
        .trust-title { font-size:15px; font-weight:900; color:#0f172a; }
        .trust-desc  { font-size:13px; color:#64748b; font-weight:600; }

        /* ── anúncios ────────────────────────────────────────────── */
        .premium-section { display:flex; flex-direction:column; gap:24px; }
        .section-header  { display:flex; align-items:flex-end; justify-content:space-between; gap:20px; }
        .title-box { display:flex; flex-direction:column; }
        .title   { font-size:32px; font-weight:900; letter-spacing:-.04em; margin:0; color:#0f172a; }
        .view-all { font-size:14px; font-weight:800; color:#2563eb; text-decoration:none; padding:10px 20px; background:#eff6ff; border-radius:12px; transition:all .2s; white-space:nowrap; }
        .view-all:hover { background:#dbeafe; transform:translateX(4px); }
        .premium-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:24px; }
        .empty-state { padding:40px; text-align:center; color:#94a3b8; }

        /* ── textos comerciais ───────────────────────────────────── */
        .commercial-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:20px; }
        .commercial-card { padding:28px; border-radius:24px; background:#fff; border:1px solid rgba(0,0,0,.04); box-shadow:0 4px 16px rgba(0,0,0,.03); }
        .commercial-title { font-size:18px; font-weight:900; color:#0f172a; display:block; margin-bottom:10px; }
        .commercial-desc  { font-size:15px; color:#64748b; line-height:1.6; margin:0; }

        /* ── sobre / categorias ──────────────────────────────────── */
        .home-sobre-card { background:#fff; border-radius:32px; padding:48px; border:1px solid rgba(0,0,0,.04); box-shadow:0 4px 20px rgba(0,0,0,.02); display:grid; grid-template-columns:1.2fr 1fr; gap:64px; align-items:center; }
        .sobre-title { font-size:36px; font-weight:900; letter-spacing:-.04em; line-height:1.1; margin:12px 0 20px; }
        .sobre-desc  { font-size:16px; color:#64748b; line-height:1.6; margin-bottom:32px; }
        .sobre-actions { display:flex; gap:16px; }
        .sobre-cats-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .cat-chip { padding:24px; border-radius:24px; background:#f8fafc; border:1px solid #f1f5f9; display:flex; flex-direction:column; align-items:center; gap:12px; text-decoration:none; text-align:center; transition:all .2s; }
        .cat-chip:hover { background:#fff; border-color:var(--blue); box-shadow:0 12px 40px rgba(24,119,242,.12); transform:translateY(-4px); }
        .cat-icon-wrap { color:var(--blue); opacity:.8; }
        .cat-label { font-size:14px; font-weight:800; color:#0f172a; }

        /* ── botões reutilizáveis ────────────────────────────────── */
        .btn-primary { height:52px; padding:0 32px; border-radius:16px; background:#0f172a; color:#fff; font-weight:800; display:inline-flex; align-items:center; justify-content:center; transition:all .2s; text-decoration:none; }
        .btn-primary:hover { background:#1e293b; transform:translateY(-2px); }
        .btn-outline { height:52px; padding:0 32px; border-radius:16px; background:transparent; border:2px solid #e2e8f0; color:#0f172a; font-weight:800; display:inline-flex; align-items:center; justify-content:center; transition:all .2s; text-decoration:none; }
        .btn-outline:hover { border-color:#0f172a; }

        /* ── chamada para anunciar ───────────────────────────────── */
        .sell-cta-card { background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%); border-radius:32px; padding:56px 48px; display:flex; flex-direction:column; gap:16px; }
        .sell-title { font-size:36px; font-weight:900; letter-spacing:-.04em; color:#fff; margin:4px 0 0; line-height:1.1; }
        .sell-text  { font-size:16px; color:rgba(255,255,255,.7); line-height:1.6; margin:0 0 8px; max-width:560px; }
        .sell-btn   { align-self:flex-start; height:52px; padding:0 32px; border-radius:16px; background:#fff; color:#0f172a; font-weight:900; display:inline-flex; align-items:center; transition:all .2s; text-decoration:none; margin-top:8px; }
        .sell-btn:hover { background:#f1f5f9; transform:translateY(-2px); }

        /* ── chamada final ───────────────────────────────────────── */
        .final-cta     { text-align:center; padding:48px 20px; }
        .final-title   { font-size:clamp(24px,3.5vw,44px); font-weight:900; letter-spacing:-.04em; color:#0f172a; margin:8px 0 32px; line-height:1.1; }
        .final-actions { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }

        /* ── responsivo ──────────────────────────────────────────── */
        @media (max-width:1024px) {
          .home-sobre-card { grid-template-columns:1fr; gap:40px; padding:32px; }
          .title { font-size:28px; }
          .sobre-title { font-size:28px; }
          .sell-cta-card { padding:40px 32px; }
          .sell-title { font-size:28px; }
        }
        @media (max-width:640px) {
          .premium-grid { grid-template-columns:1fr; }
          .sobre-cats-grid { grid-template-columns:1fr 1fr; }
          .sobre-actions { flex-direction:column; }
          .premium-main  { gap:32px; padding:24px 0; }
          .hero-actions  { flex-direction:column; }
          .sell-cta-card { padding:32px 24px; }
          .sell-btn      { align-self:stretch; justify-content:center; }
          .final-actions { flex-direction:column; align-items:center; }
          .trust-strip   { grid-template-columns:1fr 1fr; }
        }
      `}</style>
    </main>
  );
}
