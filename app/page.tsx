import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { BrandsSection } from "@/components/theme/BrandsSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TruckCard } from "@/components/theme/TruckCard";
import type { TruckCardData } from "@/components/theme/TruckCard";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Caminhões à Venda | Anúncios de caminhões e implementos",
  description:
    "Veja caminhões usados, seminovos e implementos anunciados no Caminhões à Venda. Plataforma para comprar, vender e anunciar com contato direto pelo WhatsApp.",
  alternates: { canonical: "/" },
};

const CATEGORIAS = [
  { href: "/caminhoes",    emoji: "🚛", label: "Caminhões" },
  { href: "/carretas",    emoji: "🚚", label: "Carretas" },
  { href: "/implementos", emoji: "⚙️",  label: "Implementos" },
  { href: "/maquinas",    emoji: "🏗️", label: "Máquinas" },
  { href: "/pecas",       emoji: "🔧", label: "Peças" },
  { href: "/revendas",    emoji: "🏢", label: "Revendas" },
];

export default async function HomePage() {
  const supabase = await createClient();

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

        {/* MARCAS */}
        <div className="section-wrap">
          <BrandsSection />
        </div>

        {/* ÚLTIMOS ANÚNCIOS */}
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

        {/* SOBRE */}
        <section className="section-wrap">
          <div className="home-sobre-card">
            <div className="sobre-content">
              <span className="eyebrow blue">Plataforma completa</span>
              <h2 className="sobre-title">Tudo para comprar e vender veículos pesados</h2>
              <p className="sobre-desc">O <strong>Caminhões à Venda</strong> é a plataforma especializada para quem compra ou vende caminhões, carretas, implementos, máquinas e peças no Brasil.</p>

              <div className="sobre-actions">
                <Link href="/anuncios" className="btn-primary">Ver anúncios</Link>
                <Link href="/anunciar" className="btn-outline">Anunciar grátis</Link>
              </div>
            </div>

            <div className="sobre-cats-grid">
              {CATEGORIAS.map((c) => (
                <Link key={c.href} href={c.href} className="cat-chip">
                  <span className="cat-emoji">{c.emoji}</span>
                  <strong className="cat-label">{c.label}</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <div className="section-wrap">
          <HowItWorksSection />
        </div>

      </div>

      <SiteFooter />

      <style>{`
        .premium-page {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
        }
        .premium-main {
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding: 40px 0 80px;
        }
        .section-wrap {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .premium-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }
        .eyebrow {
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #64748b;
          margin-bottom: 4px;
          display: block;
        }
        .eyebrow.blue { color: #2563eb; }
        .title {
          font-size: 32px;
          font-weight: 900;
          letter-spacing: -0.04em;
          margin: 0;
          color: #0f172a;
        }
        .view-all {
          font-size: 14px;
          font-weight: 800;
          color: #2563eb;
          text-decoration: none;
          padding: 10px 20px;
          background: #eff6ff;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .view-all:hover { background: #dbeafe; transform: translateX(4px); }

        .premium-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .home-sobre-card {
          background: #ffffff;
          border-radius: 32px;
          padding: 48px;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .sobre-title {
          font-size: 36px;
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin: 12px 0 20px;
        }
        .sobre-desc {
          font-size: 16px;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .sobre-actions {
          display: flex;
          gap: 16px;
        }
        .btn-primary {
          height: 52px; padding: 0 32px; border-radius: 16px;
          background: #0f172a; color: #fff; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .btn-primary:hover { background: #1e293b; transform: translateY(-2px); }
        .btn-outline {
          height: 52px; padding: 0 32px; border-radius: 16px;
          background: transparent; border: 2px solid #e2e8f0;
          color: #0f172a; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .btn-outline:hover { border-color: #0f172a; }

        .sobre-cats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .cat-chip {
          padding: 24px; border-radius: 24px;
          background: #f8fafc; border: 1px solid #f1f5f9;
          display: flex; flex-direction: column; align-items: center;
          gap: 12px; text-decoration: none; text-align: center;
          transition: all 0.2s;
        }
        .cat-chip:hover { background: #fff; border-color: #2563eb; box-shadow: 0 12px 30px rgba(37,99,235,0.1); transform: translateY(-4px); }
        .cat-emoji { font-size: 32px; }
        .cat-label { font-size: 14px; font-weight: 800; color: #0f172a; }

        @media (max-width: 1024px) {
          .home-sobre-card { grid-template-columns: 1fr; gap: 40px; padding: 32px; }
          .title { font-size: 28px; }
          .sobre-title { font-size: 28px; }
        }
        @media (max-width: 640px) {
          .premium-grid { grid-template-columns: 1fr; }
          .sobre-cats-grid { grid-template-columns: 1fr 1fr; }
          .sobre-actions { flex-direction: column; }
          .premium-main { gap: 32px; padding: 24px 0; }
        }
      `}</style>
    </main>
  );
}
