import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { getHomeContent } from "@/lib/site-content";
import { BrandsSection } from "@/components/theme/BrandsSection";

import { TruckCard } from "@/components/theme/TruckCard";
import type { TruckCardData } from "@/components/theme/TruckCard";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Caminhões à Venda | Anúncios de caminhões e implementos",
  description:
    "Veja caminhões usados, seminovos e implementos anunciados no Caminhões à Venda. Plataforma para comprar, vender e anunciar com contato direto pelo WhatsApp.",
  alternates: { canonical: "/" },
};


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





        {/* ── ANÚNCIOS (SEM TÍTULOS TEXTUAIS) ─────────────────────────────────── */}
        <section className="section-wrap">
          <div className="premium-section" style={{ paddingTop: "8px" }}>
            <div className="section-header" style={{ justifyContent: "flex-end", marginBottom: "16px" }}>
              <Link href="/caminhoes" className="view-all">Ver todos anúncios →</Link>
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






      </div>

      <SiteFooter />

      <style>{`
        /* ── base ────────────────────────────────────────────────── */
        .premium-page { min-height: 100vh; background: #f8fafc; color: #0f172a; }
        .premium-main { display: flex; flex-direction: column; gap: 40px; padding: 40px 0 80px; }
        .section-wrap  { width: 100%; max-width: 1600px; margin: 0 auto; padding: 0 20px; }

        /* ── Barra de categorias mobile ────────────────────────── */
        .mobile-cat-bar {
          display: none;
        }
        @media (max-width: 640px) {
          .mobile-cat-bar {
            display: block;
            background: var(--surface, #fff);
            border-bottom: 1px solid rgba(0,0,0,0.06);
            position: sticky;
            top: 58px;
            z-index: 40;
          }
          .mobile-cat-scroll {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 0;
            padding: 0 4px;
          }
          .mobile-cat-scroll::-webkit-scrollbar { display: none; }
          .mobile-cat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 10px 14px;
            min-width: 70px;
            flex-shrink: 0;
            text-decoration: none;
            color: var(--muted, #64748b);
            font-size: 11px;
            font-weight: 800;
            scroll-snap-align: start;
            border-bottom: 2px solid transparent;
            transition: color 0.15s, border-color 0.15s;
            white-space: nowrap;
          }
          .mobile-cat-item:hover, .mobile-cat-item:active {
            color: var(--blue, #2563eb);
            border-bottom-color: var(--blue, #2563eb);
          }
          .mobile-cat-icon {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            background: var(--soft, #f1f5f9);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s;
          }
          .mobile-cat-item:hover .mobile-cat-icon,
          .mobile-cat-item:active .mobile-cat-icon {
            background: var(--blueSoft, #eff6ff);
            color: var(--blue, #2563eb);
          }
          .premium-main { padding-top: 16px !important; }
        }

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

        /* ── anúncios ────────────────────────────────────────────── */
        .premium-section { display:flex; flex-direction:column; gap:24px; }
        .section-header  { display:flex; align-items:flex-end; justify-content:space-between; gap:20px; }
        .title-box { display:flex; flex-direction:column; }
        .title   { font-size:32px; font-weight:900; letter-spacing:-.04em; margin:0; color:#0f172a; }
        .view-all { font-size:14px; font-weight:800; color:#2563eb; text-decoration:none; padding:10px 20px; background:#eff6ff; border-radius:12px; transition:all .2s; white-space:nowrap; }
        .view-all:hover { background:#dbeafe; transform:translateX(4px); }
        .premium-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:24px; }
        .empty-state { padding:40px; text-align:center; color:#94a3b8; }

        /* ── barra de categorias estilo olx ──────────────────────── */
        .olx-categories-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
          padding: 24px 0;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .olx-categories-bar::-webkit-scrollbar {
          display: none;
        }
        .olx-cat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          min-width: 80px;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .olx-cat-item:hover {
          transform: translateY(-2px);
        }
        .olx-cat-icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          border: 1px solid rgba(0, 0, 0, 0.04);
        }
        .olx-cat-item:hover .olx-cat-icon-circle {
          background: #eff6ff;
          color: #2563eb;
          border-color: #bfdbfe;
          box-shadow: 0 8px 24px rgba(24, 119, 242, 0.15);
        }
        .olx-cat-label {
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          text-align: center;
          transition: color 0.2s ease;
        }
        .olx-cat-item:hover .olx-cat-label {
          color: #2563eb;
        }

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
          .title { font-size:28px; }
          .sell-cta-card { padding:40px 32px; }
          .sell-title { font-size:28px; }
        }
        @media (max-width:640px) {
          .premium-grid { grid-template-columns:1fr; }
          .olx-categories-bar {
            justify-content: flex-start;
            padding: 16px 4px;
            gap: 20px;
          }
          .olx-cat-icon-circle {
            width: 56px;
            height: 56px;
          }
          .olx-cat-label {
            font-size: 12px;
          }
          .premium-main  { gap:32px; padding:24px 0; }
          .hero-actions  { flex-direction:column; }
          .sell-cta-card { padding:32px 24px; }
          .sell-btn      { align-self:stretch; justify-content:center; }
          .final-actions { flex-direction:column; align-items:center; }
        }
      `}</style>
    </main>
  );
}
