import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Peças para Caminhão à Venda | Caminhões à Venda",
  description: "Veja peças para caminhão à venda: motores, câmbios, eixos, suspensão, freios, elétrica e muito mais. Negociação direta pelo WhatsApp.",
  alternates: { canonical: "/pecas" },
};

export default async function PecasPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, truck_images(image_url, principal, ordem)`)
    .eq("status", "aprovado")
    .eq("perfil", "Peças")
    .order("created_at", { ascending: false })
    .limit(48);

  const pecas = (data || []) as TruckCardData[];

  return (
    <div className="pec-page">
      <PublicHeader />

      {/* CTA BANNER */}
      <div className="pec-cta">
        <div className="pec-cta-inner">
          <div>
            <span className="pec-eyebrow">🔧 Peças para caminhão</span>
            <h1 className="pec-title">Peças à Venda</h1>
            <p className="pec-sub">Motores, câmbios, eixos, suspensão, freios, elétrica e muito mais. Contato direto com o vendedor pelo WhatsApp.</p>
          </div>
          <Link href="/painel/anuncios/novo/peca" className="pec-anuncie">
            + Anuncie sua peça aqui
          </Link>
        </div>
      </div>

      {/* GRID */}
      <div className="pec-container">
        {pecas.length > 0 ? (
          <>
            <p className="pec-count">{pecas.length} peça{pecas.length !== 1 ? "s" : ""} encontrada{pecas.length !== 1 ? "s" : ""}</p>
            <div className="pec-grid">
              {pecas.map((item) => (
                <TruckCard key={item.id} truck={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="pec-empty">
            <span>🔧</span>
            <strong>Nenhuma peça publicada ainda</strong>
            <p>Seja o primeiro a anunciar sua peça aqui.</p>
            <Link href="/painel/anuncios/novo/peca" className="pec-anuncie">Anunciar agora</Link>
          </div>
        )}
      </div>

      <style>{`
        .pec-page { min-height: 100vh; background: var(--bg); color: var(--text); padding-bottom: 64px; }
        .pec-cta { background: var(--surface); border-bottom: 1px solid var(--line); }
        .pec-cta-inner {
          width: min(1280px, calc(100vw - 32px)); margin: 0 auto;
          padding: 32px 0 28px;
          display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
        }
        .pec-eyebrow {
          display: inline-flex; padding: 4px 12px; border-radius: 999px;
          background: var(--blueSoft); color: var(--blue);
          font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 8px;
        }
        .pec-title { margin: 0 0 6px; font-size: clamp(26px, 3.5vw, 40px); letter-spacing: -.04em; line-height: 1.05; }
        .pec-sub { margin: 0; color: var(--muted); font-size: 15px; font-weight: 600; max-width: 54ch; line-height: 1.55; }
        .pec-anuncie {
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 52px; padding: 0 28px; border-radius: 14px;
          background: var(--blue); color: #fff;
          font-weight: 900; font-size: 15px; white-space: nowrap;
          text-decoration: none; flex-shrink: 0;
          transition: background .14s;
        }
        .pec-anuncie:hover { background: var(--blue2); }
        .pec-container { width: min(1280px, calc(100vw - 32px)); margin: 0 auto; padding-top: 28px; }
        .pec-count { margin: 0 0 16px; font-size: 13px; color: var(--muted); font-weight: 700; }
        .pec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }
        .pec-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px; padding: 72px 24px; text-align: center; color: var(--muted);
          background: var(--surface); border-radius: 20px; border: 1px solid var(--line);
        }
        .pec-empty span { font-size: 48px; }
        .pec-empty strong { font-size: 18px; color: var(--text); }
        .pec-empty p { margin: 0; font-size: 14px; max-width: 36ch; }
        @media (max-width: 680px) {
          .pec-cta-inner { flex-direction: column; align-items: flex-start; padding: 22px 0 20px; }
          .pec-anuncie { width: 100%; }
          .pec-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>
    </div>
  );
}
