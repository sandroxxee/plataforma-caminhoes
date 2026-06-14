import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Implementos à Venda | Caminhões à Venda",
  description: "Veja implementos rodoviários à venda: caçambas, munks, pranchas, baús, tanques, plataformas e muito mais. Negociação direta pelo WhatsApp.",
  alternates: { canonical: "/implementos" },
};

const TIPOS = [
  { label: "Caçamba",        slug: "cacamba",        emoji: "🟧" },
  { label: "Munk",           slug: "munk",           emoji: "🏷️" },
  { label: "Prancha",        slug: "prancha",        emoji: "⬛" },
  { label: "Baú Frigorífico",slug: "bau-frigorifico",emoji: "❄️" },
  { label: "Baú Seco",       slug: "bau-seco",       emoji: "📦" },
  { label: "Tanque",         slug: "tanque",         emoji: "🔵" },
  { label: "Plataforma",     slug: "plataforma",     emoji: "🟦" },
  { label: "Caçamba Agrícola",slug: "cacamba-agricola",emoji: "🌾" },
  { label: "Betoneira",      slug: "betoneira",      emoji: "�️" },
  { label: "Graneleiro",     slug: "graneleiro",     emoji: "🌾" },
];

export default async function ImplementosPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, destaque, created_at, truck_images(image_url, principal, ordem)`)
    .eq("status", "aprovado")
    .eq("perfil", "Implementos")
    .order("created_at", { ascending: false })
    .limit(48);

  const implementos = (data || []) as TruckCardData[];

  return (
    <div className="impl-page">
      <PublicHeader />

      <div className="impl-cta">
        <div className="impl-cta-inner">
          <div>
            <span className="impl-eyebrow">🚚 Implementos rodoviários</span>
            <h1 className="impl-title">Implementos à Venda</h1>
            <p className="impl-sub">Caçambas, munks, pranchas, baús frigoríficos, tanques, plataformas e muito mais. Contato direto com o vendedor pelo WhatsApp.</p>
          </div>
          <Link href="/painel/anuncios/novo/implemento" className="impl-anuncie">
            + Anuncie seu implemento aqui
          </Link>
        </div>
      </div>

      <div className="impl-container">

        {/* Filtro por tipo */}
        <div className="impl-tipos-wrap">
          <p className="impl-tipos-label">Filtrar por tipo</p>
          <div className="impl-tipos-grid">
            {TIPOS.map((tipo) => (
              <Link
                key={tipo.slug}
                href={`/implementos?tipo=${tipo.slug}`}
                className="impl-tipo-chip"
              >
                <span className="impl-tipo-emoji">{tipo.emoji}</span>
                <span className="impl-tipo-name">{tipo.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {implementos.length > 0 ? (
          <>
            <p className="impl-count">{implementos.length} implemento{implementos.length !== 1 ? "s" : ""} encontrado{implementos.length !== 1 ? "s" : ""}</p>
            <div className="impl-grid">
              {implementos.map((item) => <TruckCard key={item.id} truck={item} />)}
            </div>
          </>
        ) : (
          <div className="impl-empty">
            <span>🚚</span>
            <strong>Nenhum implemento publicado ainda</strong>
            <p>Seja o primeiro a anunciar seu implemento aqui.</p>
            <Link href="/painel/anuncios/novo/implemento" className="impl-anuncie">Anunciar agora</Link>
          </div>
        )}
      </div>

      <style>{`
        .impl-page { min-height: 100vh; background: var(--bg); color: var(--text); padding-bottom: 64px; }
        .impl-cta { background: var(--surface); border-bottom: 1px solid var(--line); }
        .impl-cta-inner {
          width: min(1280px, calc(100vw - 32px)); margin: 0 auto;
          padding: 32px 0 28px;
          display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
        }
        .impl-eyebrow {
          display: inline-flex; padding: 4px 12px; border-radius: 999px;
          background: var(--blueSoft); color: var(--blue);
          font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 8px;
        }
        .impl-title { margin: 0 0 6px; font-size: clamp(26px, 3.5vw, 40px); letter-spacing: -.04em; line-height: 1.05; }
        .impl-sub { margin: 0; color: var(--muted); font-size: 15px; font-weight: 600; max-width: 54ch; line-height: 1.55; }
        .impl-anuncie {
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 52px; padding: 0 28px; border-radius: 14px;
          background: var(--blue); color: #fff;
          font-weight: 900; font-size: 15px; white-space: nowrap;
          text-decoration: none; flex-shrink: 0; transition: background .14s;
        }
        .impl-anuncie:hover { background: var(--blue2); }
        .impl-container { width: min(1280px, calc(100vw - 32px)); margin: 0 auto; padding-top: 28px; }

        /* Tipos */
        .impl-tipos-wrap { margin-bottom: 24px; }
        .impl-tipos-label {
          margin: 0 0 10px; font-size: 12px; font-weight: 800;
          color: var(--muted); letter-spacing: .04em; text-transform: uppercase;
        }
        .impl-tipos-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .impl-tipo-chip {
          display: inline-flex; align-items: center; gap: 7px;
          height: 38px; padding: 0 14px 0 10px;
          background: var(--surface); border: 1.5px solid var(--line);
          border-radius: 999px; text-decoration: none;
          transition: border-color .14s, box-shadow .14s, transform .14s;
          box-shadow: var(--shadow);
        }
        .impl-tipo-chip:hover {
          border-color: var(--blue); box-shadow: var(--shadow2);
          transform: translateY(-1px);
        }
        .impl-tipo-emoji { font-size: 16px; line-height: 1; }
        .impl-tipo-name {
          font-size: 12px; font-weight: 800; color: var(--text); white-space: nowrap;
        }
        .impl-tipo-chip:hover .impl-tipo-name { color: var(--blue); }

        .impl-count { margin: 0 0 16px; font-size: 13px; color: var(--muted); font-weight: 700; }
        .impl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
        .impl-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px; padding: 72px 24px; text-align: center; color: var(--muted);
          background: var(--surface); border-radius: 20px; border: 1px solid var(--line);
        }
        .impl-empty span { font-size: 48px; }
        .impl-empty strong { font-size: 18px; color: var(--text); }
        .impl-empty p { margin: 0; font-size: 14px; max-width: 36ch; }
        @media (max-width: 680px) {
          .impl-cta-inner { flex-direction: column; align-items: flex-start; padding: 22px 0 20px; }
          .impl-anuncie { width: 100%; }
          .impl-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>
    </div>
  );
}
