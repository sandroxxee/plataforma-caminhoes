import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Implementos \u00e0 Venda | Caminh\u00f5es \u00e0 Venda",
  description: "Veja implementos rodovi\u00e1rios \u00e0 venda: ca\u00e7ambas, munks, pranchas, ba\u00fas, tanques, plataformas e muito mais. Negocia\u00e7\u00e3o direta pelo WhatsApp.",
  alternates: { canonical: "/implementos" },
};

const TIPOS = [
  { label: "Ca\u00e7amba",         slug: "cacamba",         emoji: "\uD83D\uDFE7" },
  { label: "Munk",            slug: "munk",            emoji: "\uD83C\uDFF7\uFE0F" },
  { label: "Prancha",         slug: "prancha",         emoji: "\u2B1B" },
  { label: "Ba\u00fa Frigor\u00edfico", slug: "bau-frigorifico", emoji: "\u2744\uFE0F" },
  { label: "Ba\u00fa Seco",        slug: "bau-seco",        emoji: "\uD83D\uDCE6" },
  { label: "Tanque",          slug: "tanque",          emoji: "\uD83D\uDD35" },
  { label: "Plataforma",      slug: "plataforma",      emoji: "\uD83D\uDFE6" },
  { label: "Ca\u00e7amba Agr\u00edcola", slug: "cacamba-agricola", emoji: "\uD83C\uDF3E" },
  { label: "Betoneira",       slug: "betoneira",       emoji: "\uD83D\uDD04" },
  { label: "Graneleiro",      slug: "graneleiro",      emoji: "\uD83C\uDF3E" },
];

export default async function ImplementosPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, destaque, views, created_at, truck_images(image_url, principal, ordem)`)
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
            <h1 className="impl-title">Implementos \u00e0 Venda</h1>
            <p className="impl-sub">Ca\u00e7ambas, munks, pranchas, ba\u00fas, tanques e muito mais. Contato direto pelo WhatsApp.</p>
          </div>
          <Link href="/painel/anuncios/novo/implemento" className="impl-anuncie">
            + Anunciar implemento
          </Link>
        </div>
      </div>

      <div className="impl-container">

        {/* Chips de tipo — sem label redundante */}
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

        {implementos.length > 0 ? (
          <>
            <p className="impl-count">{implementos.length} implemento{implementos.length !== 1 ? "s" : ""} dispon\u00edve{implementos.length !== 1 ? "is" : "l"}</p>
            <div className="impl-grid">
              {implementos.map((item) => <TruckCard key={item.id} truck={item} />)}
            </div>
          </>
        ) : (
          <div className="impl-empty">
            <span>\uD83D\uDE9A</span>
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
          padding: 28px 0 24px;
          display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
        }
        .impl-title { margin: 0 0 4px; font-size: clamp(24px, 3.5vw, 38px); letter-spacing: -.04em; line-height: 1.05; }
        .impl-sub { margin: 0; color: var(--muted); font-size: 14px; font-weight: 600; max-width: 54ch; line-height: 1.5; }
        .impl-anuncie {
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 48px; padding: 0 24px; border-radius: 12px;
          background: var(--blue); color: #fff;
          font-weight: 900; font-size: 14px; white-space: nowrap;
          text-decoration: none; flex-shrink: 0; transition: background .14s;
        }
        .impl-anuncie:hover { background: var(--blue2); }
        .impl-container { width: min(1280px, calc(100vw - 32px)); margin: 0 auto; padding-top: 20px; }

        /* Tipos — sem label acima */
        .impl-tipos-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .impl-tipo-chip {
          display: inline-flex; align-items: center; gap: 7px;
          height: 36px; padding: 0 14px 0 10px;
          background: var(--surface); border: 1.5px solid var(--line);
          border-radius: 999px; text-decoration: none;
          transition: border-color .14s, box-shadow .14s, transform .14s;
          box-shadow: var(--shadow);
        }
        .impl-tipo-chip:hover {
          border-color: var(--blue); box-shadow: var(--shadow2);
          transform: translateY(-1px);
        }
        .impl-tipo-emoji { font-size: 15px; line-height: 1; }
        .impl-tipo-name { font-size: 12px; font-weight: 800; color: var(--text); white-space: nowrap; }
        .impl-tipo-chip:hover .impl-tipo-name { color: var(--blue); }

        .impl-count { margin: 0 0 14px; font-size: 13px; color: var(--muted); font-weight: 700; }
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
          .impl-cta-inner { flex-direction: column; align-items: flex-start; padding: 20px 0 18px; }
          .impl-anuncie { width: 100%; }
          .impl-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>
    </div>
  );
}
