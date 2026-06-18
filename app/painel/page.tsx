import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { Eye, FileText, Clock, XCircle, Truck, Package, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PainelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: trucks } = await supabase
    .from("trucks")
    .select("status,views")
    .eq("user_id", user.id);

  const total      = trucks?.length ?? 0;
  const ativos     = trucks?.filter((a) => a.status === "aprovado").length ?? 0;
  const pendentes  = trucks?.filter((a) => a.status === "pendente").length ?? 0;
  const rejeitados = trucks?.filter((a) => a.status === "rejeitado").length ?? 0;
  const totalViews = trucks?.reduce((acc, a) => acc + (a.views ?? 0), 0) ?? 0;
  const nomeUsuario = user.user_metadata?.name || user.email?.split("@")[0] || "Anunciante";

  const stats = [
    { label: "Publicados",  value: ativos,     icon: FileText,  color: "#22c55e",  bg: "rgba(34,197,94,.1)",   border: "rgba(34,197,94,.2)" },
    { label: "Aguardando",  value: pendentes,  icon: Clock,     color: "#facc15",  bg: "rgba(250,204,21,.1)",  border: "rgba(250,204,21,.2)" },
    { label: "Rejeitados",  value: rejeitados, icon: XCircle,   color: "#f87171",  bg: "rgba(248,113,113,.1)", border: "rgba(248,113,113,.2)" },
    { label: "Total",       value: total,      icon: FileText,  color: "#60a5fa",  bg: "rgba(96,165,250,.1)",  border: "rgba(96,165,250,.2)" },
  ];

  return (
    <PanelLayout userName={nomeUsuario} role="anunciante">
      <style>{`
        /* Views hero card */
        .ps-views {
          border-radius: 20px; padding: 24px 26px;
          margin-bottom: 20px;
          background: linear-gradient(135deg, rgba(34,197,94,.1) 0%, rgba(16,185,129,.05) 100%);
          border: 1px solid rgba(34,197,94,.18);
          display: flex; align-items: center; gap: 20px;
          position: relative; overflow: hidden;
        }
        .ps-views::before {
          content: ''; position: absolute;
          right: -20px; top: -20px;
          width: 120px; height: 120px; border-radius: 50%;
          background: radial-gradient(circle, rgba(34,197,94,.12), transparent 70%);
          pointer-events: none;
        }
        .ps-views-icon {
          width: 52px; height: 52px; border-radius: 16px; flex-shrink: 0;
          background: rgba(34,197,94,.15); border: 1px solid rgba(34,197,94,.25);
          display: flex; align-items: center; justify-content: center;
          color: #4ade80;
        }
        .ps-views-num {
          font-size: clamp(32px, 4vw, 44px); font-weight: 900;
          color: #4ade80; letter-spacing: -.05em; line-height: 1;
        }
        .ps-views-label { font-size: 13px; color: rgba(255,255,255,.5); font-weight: 700; margin-top: 3px; }
        .ps-views-btn {
          margin-left: auto; flex-shrink: 0;
          display: inline-flex; align-items: center; gap: 6px;
          height: 38px; padding: 0 16px; border-radius: 12px;
          background: rgba(34,197,94,.15); border: 1px solid rgba(34,197,94,.3);
          color: #86efac; font-size: 13px; font-weight: 800;
          text-decoration: none; white-space: nowrap;
          transition: background .15s;
        }
        .ps-views-btn:hover { background: rgba(34,197,94,.25); }

        /* Stats grid */
        .ps-stats {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 10px; margin-bottom: 24px;
        }
        .ps-stat {
          border-radius: 16px; padding: 18px 16px;
          display: flex; flex-direction: column; gap: 12px;
          border: 1px solid; background: rgba(255,255,255,.03);
        }
        .ps-stat-top {
          display: flex; align-items: center;
          justify-content: space-between;
        }
        .ps-stat-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .ps-stat-num {
          font-size: clamp(24px,3vw,32px); font-weight: 900;
          line-height: 1; letter-spacing: -.04em;
        }
        .ps-stat-label {
          font-size: 11px; font-weight: 800;
          color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: .06em;
        }

        /* Ações */
        .ps-section-label {
          font-size: 11px; font-weight: 900; letter-spacing: .08em;
          text-transform: uppercase; color: rgba(255,255,255,.35);
          margin: 0 0 12px;
        }
        .ps-actions { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 20px; }
        .ps-action {
          border-radius: 20px; padding: 22px 18px;
          display: flex; flex-direction: column; gap: 12px;
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.03);
          text-decoration: none; color: var(--text);
          transition: transform .18s, border-color .18s, box-shadow .18s;
        }
        .ps-action:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,.4); border-color: rgba(255,255,255,.14); }
        .ps-action.primary {
          border-color: rgba(34,197,94,.25);
          background: linear-gradient(135deg, rgba(34,197,94,.08), rgba(16,185,129,.04));
        }
        .ps-action.primary:hover { border-color: rgba(34,197,94,.4); }
        .ps-action-icon {
          width: 44px; height: 44px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.06); flex-shrink: 0;
        }
        .ps-action.primary .ps-action-icon { background: rgba(34,197,94,.15); color: #4ade80; }
        .ps-action-title { font-size: 15px; font-weight: 900; letter-spacing: -.03em; color: #fff; line-height: 1.2; }
        .ps-action-desc { font-size: 12px; color: rgba(255,255,255,.4); line-height: 1.6; flex: 1; }
        .ps-action-arrow {
          display: inline-flex; align-items: center; gap: 4px;
          align-self: flex-start;
          height: 28px; padding: 0 10px; border-radius: 8px;
          font-size: 12px; font-weight: 900;
          background: rgba(255,255,255,.06); color: rgba(255,255,255,.6);
        }
        .ps-action.primary .ps-action-arrow { background: rgba(34,197,94,.18); color: #86efac; }

        /* Alertas */
        .ps-alert {
          border-radius: 16px; padding: 16px 18px;
          display: flex; gap: 12px; align-items: flex-start;
          border: 1px solid rgba(250,204,21,.2);
          background: rgba(250,204,21,.05); margin-top: 8px;
        }
        .ps-alert-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
        .ps-alert-text { margin: 0; font-size: 13px; color: rgba(255,255,255,.55); line-height: 1.6; font-weight: 700; }
        .ps-alert-text strong { color: #facc15; }
        .ps-alert.success { border-color: rgba(34,197,94,.2); background: rgba(34,197,94,.05); }
        .ps-alert.success .ps-alert-text { color: rgba(255,255,255,.55); }
        .ps-alert.success .ps-alert-text strong { color: #4ade80; }

        @media (max-width: 640px) {
          .ps-stats { grid-template-columns: repeat(2,1fr); gap: 8px; }
          .ps-views { padding: 18px; flex-wrap: wrap; }
          .ps-views-btn { width: 100%; justify-content: center; }
          .ps-actions { grid-template-columns: 1fr; gap: 10px; }
          .ps-action { flex-direction: row; align-items: center; padding: 16px; border-radius: 16px; gap: 14px; }
          .ps-action-desc { display: none; }
          .ps-action-arrow { margin-left: auto; }
        }
      `}</style>

      {/* Views hero */}
      <div className="ps-views">
        <div className="ps-views-icon">
          <Eye size={24} strokeWidth={1.8} />
        </div>
        <div>
          <div className="ps-views-num">{totalViews.toLocaleString("pt-BR")}</div>
          <div className="ps-views-label">visualizações nos seus anúncios</div>
        </div>
        <Link href="/painel/anuncios" className="ps-views-btn">
          Ver detalhes <ArrowRight size={13} />
        </Link>
      </div>

      {/* Stats */}
      <section className="ps-stats" aria-label="Resumo dos anúncios">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="ps-stat"
              style={{ borderColor: s.border }}
            >
              <div className="ps-stat-top">
                <div className="ps-stat-icon" style={{ background: s.bg, color: s.color }}>
                  <Icon size={16} strokeWidth={2} />
                </div>
              </div>
              <div className="ps-stat-num" style={{ color: s.color }}>{s.value}</div>
              <div className="ps-stat-label">{s.label}</div>
            </div>
          );
        })}
      </section>

      {/* Ações rápidas */}
      <p className="ps-section-label">Ações rápidas</p>
      <section className="ps-actions" aria-label="Ações rápidas">
        <Link href="/painel/anuncios" className="ps-action">
          <div className="ps-action-icon" style={{ color: "#60a5fa" }}>
            <FileText size={20} strokeWidth={1.8} />
          </div>
          <strong className="ps-action-title">Meus anúncios</strong>
          <p className="ps-action-desc">Veja status, visualizações e gerencie cada anúncio.</p>
          <span className="ps-action-arrow">Ver <ArrowRight size={11} /></span>
        </Link>

        <Link href="/painel/anuncios/novo/caminhao" className="ps-action primary">
          <div className="ps-action-icon">
            <Truck size={20} strokeWidth={1.8} />
          </div>
          <strong className="ps-action-title">Anunciar caminhão</strong>
          <p className="ps-action-desc">Cadastre com fotos, dados técnicos e contato WhatsApp.</p>
          <span className="ps-action-arrow">Cadastrar <ArrowRight size={11} /></span>
        </Link>

        <Link href="/painel/anuncios/novo/implemento" className="ps-action">
          <div className="ps-action-icon" style={{ color: "#c084fc" }}>
            <Package size={20} strokeWidth={1.8} />
          </div>
          <strong className="ps-action-title">Anunciar implemento</strong>
          <p className="ps-action-desc">Carreta, caçamba, prancha, baú, tanque e mais.</p>
          <span className="ps-action-arrow">Cadastrar <ArrowRight size={11} /></span>
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
          <p className="ps-alert-text">
            <strong>Bem-vindo!</strong> Cadastre seu primeiro caminhão ou implemento e comece a receber contatos.
          </p>
        </div>
      )}
    </PanelLayout>
  );
}
