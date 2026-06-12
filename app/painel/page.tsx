import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";

export const dynamic = "force-dynamic";

export default async function PainelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: trucks } = await supabase
    .from("trucks")
    .select("status")
    .eq("user_id", user!.id);

  const total = trucks?.length ?? 0;
  const ativos = trucks?.filter((a) => a.status === "aprovado").length ?? 0;
  const pendentes = trucks?.filter((a) => a.status === "pendente").length ?? 0;
  const rejeitados = trucks?.filter((a) => a.status === "rejeitado").length ?? 0;

  const nomeUsuario =
    user!.user_metadata?.name || user!.email?.split("@")[0] || "Anunciante";

  return (
    <PanelLayout
      title="Central do anunciante"
      subtitle="Gerencie seus anúncios e cadastre novos veículos com segurança."
      badge="Anunciante"
    >
      <style>{`
        .painel-greeting { font-size: 17px; color: var(--muted); margin-bottom: 20px; }
        .painel-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 28px; }
        .painel-stat { padding: 18px 16px; border-radius: 16px; background: var(--surface); border: 1px solid var(--line); display: flex; flex-direction: column; gap: 6px; }
        .painel-stat.green { border-color: rgba(34,197,94,.3); background: rgba(34,197,94,.06); }
        .painel-stat.yellow { border-color: rgba(234,179,8,.3); background: rgba(234,179,8,.06); }
        .painel-stat.red { border-color: rgba(239,68,68,.3); background: rgba(239,68,68,.06); }
        .painel-stat-num { font-size: 36px; font-weight: 900; color: var(--text); line-height: 1; letter-spacing: -.03em; }
        .painel-stat-label { font-size: 12px; color: var(--muted); font-weight: 700; }
        .painel-section-title { font-size: 11px; color: var(--muted); font-weight: 800; margin: 0 0 12px; letter-spacing: .07em; text-transform: uppercase; }
        .painel-actions { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 20px; }
        .painel-card { padding: 20px; border-radius: 18px; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); color: var(--text); text-decoration: none; display: flex; flex-direction: column; gap: 10px; transition: border-color .18s, box-shadow .18s; }
        .painel-card:hover { border-color: var(--blue); box-shadow: var(--shadow2); }
        .painel-card-icon { font-size: 22px; }
        .painel-card-title { display: block; font-size: 17px; font-weight: 900; letter-spacing: -.03em; line-height: 1.1; }
        .painel-card-text { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.5; flex: 1; }
        .painel-card-btn { align-self: flex-start; display: inline-flex; align-items: center; height: 36px; padding: 0 14px; border-radius: 10px; background: var(--blue); color: #fff; font-weight: 800; font-size: 13px; }
        .painel-tip { display: flex; align-items: flex-start; gap: 12px; padding: 14px 18px; border-radius: 14px; background: var(--blueSoft); border: 1px solid rgba(24,119,242,.2); margin-top: 4px; }
        .painel-tip-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
        .painel-tip-text { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.6; }
        @media (max-width: 900px) { .painel-stats { grid-template-columns: repeat(2,1fr); } .painel-actions { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px) {
          .painel-stats { grid-template-columns: repeat(2,1fr); gap: 8px; margin-bottom: 18px; }
          .painel-stat { padding: 14px 12px; border-radius: 12px; }
          .painel-stat-num { font-size: 28px; }
          .painel-actions { grid-template-columns: 1fr; gap: 10px; }
          .painel-card { flex-direction: row; align-items: center; padding: 14px 16px; }
          .painel-card-text { display: none; }
        }
      `}</style>

      <p className="painel-greeting">Olá, <strong>{nomeUsuario}</strong> 👋</p>

      <section className="painel-stats">
        <div className="painel-stat">
          <span className="painel-stat-num">{total}</span>
          <span className="painel-stat-label">Total de anúncios</span>
        </div>
        <div className="painel-stat green">
          <span className="painel-stat-num">{ativos}</span>
          <span className="painel-stat-label">✅ Publicados</span>
        </div>
        <div className="painel-stat yellow">
          <span className="painel-stat-num">{pendentes}</span>
          <span className="painel-stat-label">⏳ Aguardando</span>
        </div>
        <div className="painel-stat red">
          <span className="painel-stat-num">{rejeitados}</span>
          <span className="painel-stat-label">❌ Rejeitados</span>
        </div>
      </section>

      <h2 className="painel-section-title">O que deseja fazer?</h2>
      <section className="painel-actions">
        <Link href="/painel/anuncios" className="painel-card">
          <span className="painel-card-icon">🚛</span>
          <strong className="painel-card-title">Meus anúncios</strong>
          <p className="painel-card-text">Acompanhe seus anúncios, status de aprovação e publicação.</p>
          <span className="painel-card-btn">Ver anúncios</span>
        </Link>
        <Link href="/painel/anuncios/novo/caminhao" className="painel-card">
          <span className="painel-card-icon">➕</span>
          <strong className="painel-card-title">Anunciar caminhão</strong>
          <p className="painel-card-text">Cadastre um caminhão com dados, fotos, localização e contato.</p>
          <span className="painel-card-btn">Cadastrar</span>
        </Link>
        <Link href="/painel/anuncios/novo/implemento" className="painel-card">
          <span className="painel-card-icon">🛥</span>
          <strong className="painel-card-title">Anunciar implemento</strong>
          <p className="painel-card-text">Cadastre carreta, caçamba, prancha, baú, tanque ou outro implemento.</p>
          <span className="painel-card-btn">Cadastrar</span>
        </Link>
      </section>

      {pendentes > 0 && (
        <div className="painel-tip">
          <span className="painel-tip-icon">💡</span>
          <p className="painel-tip-text">Você tem <strong>{pendentes} anúncio{pendentes > 1 ? "s" : ""}</strong> aguardando aprovação. Assim que aprovado, aparecerá no site.</p>
        </div>
      )}
      {total === 0 && (
        <div className="painel-tip">
          <span className="painel-tip-icon">🚀</span>
          <p className="painel-tip-text">Você ainda não tem anúncios. Cadastre seu primeiro caminhão ou implemento agora!</p>
        </div>
      )}
    </PanelLayout>
  );
}
