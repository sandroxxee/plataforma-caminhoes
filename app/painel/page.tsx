import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";

export const dynamic = "force-dynamic";

export default async function PainelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: trucks } = await supabase
    .from("trucks")
    .select("status,views")
    .eq("user_id", user.id);

  const total = trucks?.length ?? 0;
  const ativos = trucks?.filter((a) => a.status === "aprovado").length ?? 0;
  const pendentes = trucks?.filter((a) => a.status === "pendente").length ?? 0;
  const rejeitados = trucks?.filter((a) => a.status === "rejeitado").length ?? 0;
  const totalViews = trucks?.reduce((acc, a) => acc + (a.views ?? 0), 0) ?? 0;
  const nomeUsuario = user.user_metadata?.name || user.email?.split("@")[0] || "Anunciante";

  return (
    <PanelLayout userName={nomeUsuario} role="anunciante">
      <style>{`
        /* Stats row */
        .ps-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 28px;
        }
        .ps-stat {
          border-radius: 16px;
          padding: 16px 14px;
          display: flex; flex-direction: column; gap: 4px;
          border: 1px solid rgba(255,255,255,.07);
          background: var(--surface);
        }
        .ps-stat-num { font-size: 32px; font-weight: 900; line-height: 1; letter-spacing: -.04em; color: #fff; }
        .ps-stat-label { font-size: 11px; font-weight: 800; color: var(--muted); }
        .ps-stat.green .ps-stat-num { color: #4ade80; }
        .ps-stat.yellow .ps-stat-num { color: #facc15; }
        .ps-stat.red .ps-stat-num { color: #f87171; }
        .ps-stat.blue .ps-stat-num { color: #60a5fa; }

        /* Views destaque */
        .ps-views {
          border-radius: 20px;
          padding: 20px 22px;
          margin-bottom: 24px;
          background: linear-gradient(135deg, rgba(34,197,94,.12), rgba(16,185,129,.06));
          border: 1px solid rgba(34,197,94,.2);
          display: flex; align-items: center; gap: 16px;
        }
        .ps-views-num { font-size: 44px; font-weight: 900; color: #4ade80; letter-spacing: -.05em; line-height: 1; }
        .ps-views-label { font-size: 13px; color: var(--muted); font-weight: 700; margin-top: 4px; }
        .ps-views-btn {
          margin-left: auto; flex-shrink: 0;
          height: 36px; padding: 0 16px; border-radius: 10px;
          background: rgba(34,197,94,.15); border: 1px solid rgba(34,197,94,.3);
          color: #86efac; font-size: 13px; font-weight: 800;
          white-space: nowrap;
        }

        /* Ações */
        .ps-section-label {
          font-size: 11px; font-weight: 900; letter-spacing: .08em;
          text-transform: uppercase; color: var(--muted);
          margin: 0 0 12px;
        }
        .ps-actions { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 20px; }
        .ps-action {
          border-radius: 20px; padding: 20px 16px;
          display: flex; flex-direction: column; gap: 10px;
          border: 1px solid rgba(255,255,255,.08);
          background: var(--surface);
          text-decoration: none; color: var(--text);
          transition: transform .18s, border-color .18s, box-shadow .18s;
          position: relative; overflow: hidden;
        }
        .ps-action::before {
          content: ""; position: absolute; inset: 0;
          opacity: 0; transition: opacity .18s;
        }
        .ps-action:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,.3); }
        .ps-action.primary { border-color: rgba(34,197,94,.3); background: linear-gradient(135deg, rgba(34,197,94,.1), rgba(16,185,129,.05)); }
        .ps-action.primary:hover { border-color: rgba(34,197,94,.5); }
        .ps-action-icon { font-size: 28px; line-height: 1; }
        .ps-action-title { font-size: 15px; font-weight: 900; letter-spacing: -.03em; line-height: 1.2; color: #fff; }
        .ps-action-desc { font-size: 12px; color: var(--muted); line-height: 1.5; flex: 1; }
        .ps-action-arrow {
          align-self: flex-start;
          display: inline-flex; align-items: center; height: 28px; padding: 0 10px;
          border-radius: 8px; font-size: 12px; font-weight: 900;
          background: rgba(255,255,255,.07); color: rgba(255,255,255,.7);
        }
        .ps-action.primary .ps-action-arrow { background: rgba(34,197,94,.2); color: #86efac; }

        /* Alerta */
        .ps-alert {
          border-radius: 16px; padding: 14px 18px;
          display: flex; gap: 12px; align-items: flex-start;
          border: 1px solid rgba(250,204,21,.2);
          background: rgba(250,204,21,.06);
          margin-top: 8px;
        }
        .ps-alert-icon { font-size: 18px; flex-shrink: 0; }
        .ps-alert-text { margin: 0; font-size: 13px; color: var(--muted); line-height: 1.6; font-weight: 700; }
        .ps-alert.success { border-color: rgba(34,197,94,.2); background: rgba(34,197,94,.06); }

        @media (max-width: 640px) {
          .ps-stats { grid-template-columns: repeat(2,1fr); gap: 8px; margin-bottom: 20px; }
          .ps-stat { padding: 14px 12px; border-radius: 14px; }
          .ps-stat-num { font-size: 26px; }
          .ps-views { padding: 16px; border-radius: 16px; }
          .ps-views-num { font-size: 36px; }
          .ps-actions { grid-template-columns: 1fr; gap: 10px; }
          .ps-action { flex-direction: row; align-items: center; padding: 16px; border-radius: 16px; gap: 14px; }
          .ps-action-desc { display: none; }
          .ps-action-arrow { margin-left: auto; flex-shrink: 0; }
        }
      `}</style>

      {/* Views destaque */}
      <div className="ps-views">
        <div>
          <div className="ps-views-num">{totalViews.toLocaleString("pt-BR")}</div>
          <div className="ps-views-label">visualizações totais nos seus anúncios</div>
        </div>
        <Link href="/painel/anuncios" className="ps-views-btn">Ver detalhes →</Link>
      </div>

      {/* Stats */}
      <section className="ps-stats">
        <div className="ps-stat">
          <span className="ps-stat-num">{total}</span>
          <span className="ps-stat-label">Total</span>
        </div>
        <div className="ps-stat green">
          <span className="ps-stat-num">{ativos}</span>
          <span className="ps-stat-label">Publicados</span>
        </div>
        <div className="ps-stat yellow">
          <span className="ps-stat-num">{pendentes}</span>
          <span className="ps-stat-label">Aguardando</span>
        </div>
        <div className="ps-stat red">
          <span className="ps-stat-num">{rejeitados}</span>
          <span className="ps-stat-label">Rejeitados</span>
        </div>
      </section>

      {/* Ações */}
      <p className="ps-section-label">Ações rápidas</p>
      <section className="ps-actions">
        <Link href="/painel/anuncios" className="ps-action">
          <span className="ps-action-icon">📄</span>
          <strong className="ps-action-title">Meus anúncios</strong>
          <p className="ps-action-desc">Veja status, visualizações e gerencie cada anúncio.</p>
          <span className="ps-action-arrow">Ver →</span>
        </Link>
        <Link href="/painel/anuncios/novo/caminhao" className="ps-action primary">
          <span className="ps-action-icon">🚛</span>
          <strong className="ps-action-title">Anunciar caminhão</strong>
          <p className="ps-action-desc">Cadastre com fotos, dados técnicos e contato WhatsApp.</p>
          <span className="ps-action-arrow">Cadastrar →</span>
        </Link>
        <Link href="/painel/anuncios/novo/implemento" className="ps-action">
          <span className="ps-action-icon">🛥</span>
          <strong className="ps-action-title">Anunciar implemento</strong>
          <p className="ps-action-desc">Carreta, caçamba, prancha, baú, tanque e mais.</p>
          <span className="ps-action-arrow">Cadastrar →</span>
        </Link>
      </section>

      {/* Alertas */}
      {pendentes > 0 && (
        <div className="ps-alert">
          <span className="ps-alert-icon">⏳</span>
          <p className="ps-alert-text">
            Você tem <strong>{pendentes} anúncio{pendentes > 1 ? "s" : ""}</strong> aguardando aprovação. Assim que aprovado, aparecerá no site.
          </p>
        </div>
      )}
      {total === 0 && (
        <div className="ps-alert success">
          <span className="ps-alert-icon">🚀</span>
          <p className="ps-alert-text">Cadastre seu primeiro caminhão ou implemento agora e comece a receber contatos!</p>
        </div>
      )}
    </PanelLayout>
  );
}
