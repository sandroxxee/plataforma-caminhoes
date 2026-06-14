import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Carretas à Venda | Caminhões à Venda",
  description: "Veja carretas e semirreboques à venda: graneleiras, porta-containers, pranchas, frigoríficas, tanques e muito mais. Negociação direta pelo WhatsApp.",
  alternates: { canonical: "/carretas" },
};

export default async function CarretasPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, truck_images(image_url, principal, ordem)`)
    .eq("status", "aprovado")
    .eq("perfil", "Carretas")
    .order("created_at", { ascending: false })
    .limit(48);

  const carretas = (data || []) as TruckCardData[];

  return (
    <div className="car-page">
      <PublicHeader />

      {/* CTA BANNER */}
      <div className="car-cta">
        <div className="car-cta-inner">
          <div>
            <span className="car-eyebrow">🚛 Carretas e semirreboques</span>
            <h1 className="car-title">Carretas à Venda</h1>
            <p className="car-sub">Graneleiras, porta-containers, pranchas, frigoríficas, tanques e muito mais. Contato direto com o vendedor pelo WhatsApp.</p>
          </div>
          <Link href="/painel/anuncios/novo/carreta" className="car-anuncie">
            + Anuncie sua carreta aqui
          </Link>
        </div>
      </div>

      {/* GRID */}
      <div className="car-container">
        {carretas.length > 0 ? (
          <>
            <p className="car-count">{carretas.length} carreta{carretas.length !== 1 ? "s" : ""} encontrada{carretas.length !== 1 ? "s" : ""}</p>
            <div className="car-grid">
              {carretas.map((item) => (
                <TruckCard key={item.id} truck={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="car-empty">
            <span>🚛</span>
            <strong>Nenhuma carreta publicada ainda</strong>
            <p>Seja o primeiro a anunciar sua carreta aqui.</p>
            <Link href="/painel/anuncios/novo/carreta" className="car-anuncie">Anunciar agora</Link>
          </div>
        )}
      </div>

      <style>{`
        .car-page { min-height: 100vh; background: var(--bg); color: var(--text); padding-bottom: 64px; }
        .car-cta { background: var(--surface); border-bottom: 1px solid var(--line); }
        .car-cta-inner {
          width: min(1280px, calc(100vw - 32px)); margin: 0 auto;
          padding: 32px 0 28px;
          display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
        }
        .car-eyebrow {
          display: inline-flex; padding: 4px 12px; border-radius: 999px;
          background: var(--blueSoft); color: var(--blue);
          font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 8px;
        }
        .car-title { margin: 0 0 6px; font-size: clamp(26px, 3.5vw, 40px); letter-spacing: -.04em; line-height: 1.05; }
        .car-sub { margin: 0; color: var(--muted); font-size: 15px; font-weight: 600; max-width: 54ch; line-height: 1.55; }
        .car-anuncie {
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 52px; padding: 0 28px; border-radius: 14px;
          background: var(--blue); color: #fff;
          font-weight: 900; font-size: 15px; white-space: nowrap;
          text-decoration: none; flex-shrink: 0;
          transition: background .14s;
        }
        .car-anuncie:hover { background: var(--blue2); }
        .car-container { width: min(1280px, calc(100vw - 32px)); margin: 0 auto; padding-top: 28px; }
        .car-count { margin: 0 0 16px; font-size: 13px; color: var(--muted); font-weight: 700; }
        .car-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }
        .car-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px; padding: 72px 24px; text-align: center; color: var(--muted);
          background: var(--surface); border-radius: 20px; border: 1px solid var(--line);
        }
        .car-empty span { font-size: 48px; }
        .car-empty strong { font-size: 18px; color: var(--text); }
        .car-empty p { margin: 0; font-size: 14px; max-width: 36ch; }
        @media (max-width: 680px) {
          .car-cta-inner { flex-direction: column; align-items: flex-start; padding: 22px 0 20px; }
          .car-anuncie { width: 100%; }
          .car-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>
    </div>
  );
}
