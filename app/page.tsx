import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { HeroMarketplace } from "@/components/theme/HeroMarketplace";
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
  { href: "/implementos", emoji: "⚙️", label: "Implementos" },
  { href: "/maquinas",    emoji: "🏗️", label: "Máquinas" },
  { href: "/pecas",       emoji: "🔧", label: "Peças" },
  { href: "/revendas",    emoji: "🏢", label: "Revendas" },
];

export default async function HomePage() {
  const supabase = await createClient();

  // Últimos anúncios aprovados
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

  // Revendas com anúncios ativos
  const { data: revendasData } = await supabase
    .from("profiles")
    .select("id, nome_empresa, cidade, estado, logo_url, slug")
    .eq("tipo", "revenda")
    .eq("ativo", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const trucks = (trucksData || []) as TruckCardData[];
  const revendas = revendasData || [];

  return (
    <main className="market-page">
      <PublicHeader />

      <div className="market-main">

        {/* ── HERO ── */}
        <HeroMarketplace />

        {/* ── CATEGORIAS ── */}
        <section className="market-container">
          <div className="market-section">
            <div className="market-section-head">
              <div>
                <span>Navegue por categoria</span>
                <h2>O que você procura?</h2>
              </div>
            </div>
            <div className="home-cats">
              {CATEGORIAS.map((c) => (
                <Link key={c.href} href={c.href} className="home-cat-card">
                  <span className="home-cat-emoji">{c.emoji}</span>
                  <strong>{c.label}</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── MARCAS ── */}
        <BrandsSection />

        {/* ── ÚLTIMOS ANÚNCIOS ── */}
        <section className="market-container">
          <div className="market-section">
            <div className="market-section-head">
              <div>
                <span>Recém adicionados</span>
                <h2>Últimos anúncios</h2>
              </div>
              <Link href="/anuncios">Ver todos →</Link>
            </div>
            {trucks.length === 0 ? (
              <p style={{ color: "var(--muted)", fontWeight: 700 }}>Nenhum anúncio disponível no momento.</p>
            ) : (
              <div className="market-grid">
                {trucks.map((t) => (
                  <TruckCard key={t.id} truck={t} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── REVENDAS ── */}
        {revendas.length > 0 && (
          <section className="market-container">
            <div className="market-section">
              <div className="market-section-head">
                <div>
                  <span>Estoque profissional</span>
                  <h2>Revendas parceiras</h2>
                </div>
                <Link href="/revendas">Ver todas →</Link>
              </div>
              <div className="home-revendas">
                {revendas.map((r: any) => (
                  <Link key={r.id} href={`/revendas/${r.slug || r.id}`} className="home-revenda-card">
                    <div className="home-revenda-logo">
                      {r.logo_url
                        ? <img src={r.logo_url} alt={r.nome_empresa} />
                        : <span>🏢</span>
                      }
                    </div>
                    <div className="home-revenda-info">
                      <strong>{r.nome_empresa || "Revenda"}</strong>
                      {r.cidade && <span>{r.cidade}{r.estado ? ` — ${r.estado}` : ""}</span>}
                    </div>
                    <span className="home-revenda-cta">Ver estoque →</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── SOBRE / O QUE O SITE OFERECE ── */}
        <section className="market-container">
          <div className="home-sobre">
            <div className="home-sobre-text">
              <span className="stock-eyebrow">Plataforma completa</span>
              <h2>Tudo para comprar e vender veículos pesados</h2>
              <p>O <strong>Caminhões à Venda</strong> é a plataforma especializada para quem compra ou vende caminhões, carretas, implementos, máquinas e peças no Brasil.</p>
              <ul className="home-sobre-list">
                <li>📋 Anúncie seu veículo em minutos com fotos e contato direto pelo WhatsApp</li>
                <li>🔍 Busque por marca, modelo, estado e faixa de preço</li>
                <li>🏢 Revendas com estoque completo em um só lugar</li>
                <li>📍 Encontre veículos perto de você no mapa</li>
                <li>✅ Anúncios verificados e aprovados pela equipe</li>
              </ul>
              <div className="home-sobre-ctas">
                <Link href="/anuncios" className="contact-button">Ver anúncios</Link>
                <Link href="/anunciar" className="home-sobre-btn-outline">Anunciar grátis</Link>
              </div>
            </div>
            <div className="home-sobre-cats">
              {CATEGORIAS.map((c) => (
                <Link key={c.href} href={c.href} className="home-sobre-cat">
                  <span>{c.emoji}</span>
                  <strong>{c.label}</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMO FUNCIONA ── */}
        <div className="market-container">
          <HowItWorksSection />
        </div>

      </div>

      <SiteFooter />

      <style>{`
        /* === CATEGORIAS HOME === */
        .home-cats {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
        }
        .home-cat-card {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; padding: 22px 10px;
          background: var(--soft); border-radius: var(--radius);
          border: 1.5px solid var(--line);
          font-weight: 900; font-size: 13px; color: var(--text);
          text-decoration: none; text-align: center;
          transition: all .18s;
        }
        .home-cat-card:hover { border-color: var(--blue); color: var(--blue); background: var(--blueSoft); transform: translateY(-2px); box-shadow: var(--shadow2); }
        .home-cat-emoji { font-size: 28px; line-height: 1; }

        /* === REVENDAS HOME === */
        .home-revendas {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }
        .home-revenda-card {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 18px; border-radius: var(--radius-sm);
          background: var(--soft); border: 1.5px solid var(--line);
          text-decoration: none; color: var(--text);
          transition: all .18s;
        }
        .home-revenda-card:hover { border-color: var(--blue); box-shadow: var(--shadow); transform: translateY(-1px); }
        .home-revenda-logo {
          width: 52px; height: 52px; border-radius: 12px;
          background: var(--surface); border: 1px solid var(--line);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; overflow: hidden; font-size: 22px;
        }
        .home-revenda-logo img { width: 100%; height: 100%; object-fit: cover; }
        .home-revenda-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
        .home-revenda-info strong { font-size: 14px; font-weight: 900; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .home-revenda-info span { font-size: 12px; color: var(--muted); font-weight: 700; }
        .home-revenda-cta { font-size: 12px; font-weight: 900; color: var(--blue); white-space: nowrap; }

        /* === SOBRE === */
        .home-sobre {
          display: grid; grid-template-columns: 1fr 280px;
          gap: 32px; align-items: start;
          background: var(--surface); border-radius: var(--radius);
          padding: 36px 36px; box-shadow: var(--shadow); border: 1px solid var(--line);
        }
        .home-sobre-text h2 { font-size: clamp(22px,2.8vw,32px); margin: 8px 0 12px; }
        .home-sobre-text p { color: var(--muted); font-weight: 700; margin: 0 0 16px; line-height: 1.7; }
        .home-sobre-list { padding: 0; margin: 0 0 24px; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .home-sobre-list li { font-size: 14px; font-weight: 700; color: var(--text); }
        .home-sobre-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
        .home-sobre-btn-outline {
          min-height: 44px; border-radius: 10px; padding: 0 20px;
          display: inline-flex; align-items: center;
          border: 1.5px solid var(--line); color: var(--text);
          font-weight: 900; text-decoration: none; transition: all .15s;
        }
        .home-sobre-btn-outline:hover { border-color: var(--blue); color: var(--blue); }
        .home-sobre-cats {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        .home-sobre-cat {
          display: flex; flex-direction: column; align-items: center;
          gap: 6px; padding: 16px 8px; border-radius: var(--radius-sm);
          background: var(--soft); border: 1.5px solid var(--line);
          font-size: 12px; font-weight: 900; color: var(--text);
          text-decoration: none; text-align: center; transition: all .15s;
        }
        .home-sobre-cat:hover { border-color: var(--blue); color: var(--blue); background: var(--blueSoft); }
        .home-sobre-cat span { font-size: 22px; }

        /* === MOBILE === */
        @media (max-width: 900px) {
          .home-cats { grid-template-columns: repeat(3, 1fr); }
          .home-sobre { grid-template-columns: 1fr; padding: 24px 20px; }
          .home-sobre-cats { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .home-cats { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .home-cat-card { padding: 16px 8px; font-size: 12px; }
          .home-cat-emoji { font-size: 24px; }
          .home-revendas { grid-template-columns: 1fr; }
          .home-sobre-cats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </main>
  );
}
