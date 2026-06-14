import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Máquinas à Venda | Caminhões à Venda",
  description: "Veja máquinas pesadas à venda: escavadeiras, motoniveladoras, retroescavadeiras, pás carregadeiras, tratores e mais. Negociação direta pelo WhatsApp.",
  alternates: { canonical: "/maquinas" },
};

export default async function MaquinasPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, truck_images(image_url, principal, ordem)`)
    .eq("status", "aprovado")
    .eq("perfil", "Máquinas")
    .order("created_at", { ascending: false })
    .limit(48);

  const maquinas = (data || []) as TruckCardData[];

  return (
    <div className="maq-page">
      <PublicHeader />

      {/* CTA BANNER */}
      <div className="maq-cta">
        <div className="maq-cta-inner">
          <div>
            <span className="maq-eyebrow">🚜 Máquinas pesadas</span>
            <h1 className="maq-title">Máquinas à Venda</h1>
            <p className="maq-sub">Escavadeiras, motoniveladoras, retroescavadeiras, pás carregadeiras, tratores e muito mais. Contato direto com o vendedor pelo WhatsApp.</p>
          </div>
          <Link href="/painel/anuncios/novo/maquina" className="maq-anuncie">
            + Anuncie sua máquina aqui
          </Link>
        </div>
      </div>

      {/* GRID */}
      <div className="maq-container">
        {maquinas.length > 0 ? (
          <>
            <p className="maq-count">{maquinas.length} máquina{maquinas.length !== 1 ? "s" : ""} encontrada{maquinas.length !== 1 ? "s" : ""}</p>
            <div className="maq-grid">
              {maquinas.map((item) => (
                <TruckCard key={item.id} truck={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="maq-empty">
            <span>🚜</span>
            <strong>Nenhuma máquina publicada ainda</strong>
            <p>Seja o primeiro a anunciar sua máquina aqui.</p>
            <Link href="/painel/anuncios/novo/maquina" className="maq-anuncie">Anunciar agora</Link>
          </div>
        )}
      </div>

      <style>{`
        .maq-page { min-height: 100vh; background: var(--bg); color: var(--text); padding-bottom: 64px; }
        .maq-cta { background: var(--surface); border-bottom: 1px solid var(--line); }
        .maq-cta-inner {
          width: min(1280px, calc(100vw - 32px)); margin: 0 auto;
          padding: 32px 0 28px;
          display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
        }
        .maq-eyebrow {
          display: inline-flex; padding: 4px 12px; border-radius: 999px;
          background: var(--blueSoft); color: var(--blue);
          font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 8px;
        }
        .maq-title { margin: 0 0 6px; font-size: clamp(26px, 3.5vw, 40px); letter-spacing: -.04em; line-height: 1.05; }
        .maq-sub { margin: 0; color: var(--muted); font-size: 15px; font-weight: 600; max-width: 54ch; line-height: 1.55; }
        .maq-anuncie {
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 52px; padding: 0 28px; border-radius: 14px;
          background: var(--blue); color: #fff;
          font-weight: 900; font-size: 15px; white-space: nowrap;
          text-decoration: none; flex-shrink: 0;
          transition: background .14s;
        }
        .maq-anuncie:hover { background: var(--blue2); }
        .maq-container { width: min(1280px, calc(100vw - 32px)); margin: 0 auto; padding-top: 28px; }
        .maq-count { margin: 0 0 16px; font-size: 13px; color: var(--muted); font-weight: 700; }
        .maq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }
        .maq-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px; padding: 72px 24px; text-align: center; color: var(--muted);
          background: var(--surface); border-radius: 20px; border: 1px solid var(--line);
        }
        .maq-empty span { font-size: 48px; }
        .maq-empty strong { font-size: 18px; color: var(--text); }
        .maq-empty p { margin: 0; font-size: 14px; max-width: 36ch; }
        @media (max-width: 680px) {
          .maq-cta-inner { flex-direction: column; align-items: flex-start; padding: 22px 0 20px; }
          .maq-anuncie { width: 100%; }
          .maq-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>
    </div>
  );
}
