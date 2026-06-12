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

  const { data: anuncios } = await supabase
    .from("anuncios")
    .select("status")
    .eq("user_id", user.id);

  const total = anuncios?.length ?? 0;
  const ativos = anuncios?.filter((a) => a.status === "publicado").length ?? 0;
  const pendentes = anuncios?.filter((a) => a.status === "pendente").length ?? 0;
  const rejeitados = anuncios?.filter((a) => a.status === "rejeitado").length ?? 0;

  const nomeUsuario =
    user.user_metadata?.name || user.email?.split("@")[0] || "Anunciante";

  return (
    <PanelLayout
      title="Central do anunciante"
      subtitle="Gerencie seus anúncios e cadastre novos veículos com segurança."
      badge="Anunciante"
    >
      <style>{`
        .painel-greeting {
          font-size: 17px;
          color: #aeb8c2;
          margin-bottom: 20px;
        }
        .painel-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 32px;
        }
        .painel-stat {
          padding: 18px 16px;
          border-radius: 16px;
          background: #1f2327;
          border: 1px solid #343a40;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .painel-stat.green { border-color: rgba(34,197,94,.3); background: rgba(34,197,94,.07); }
        .painel-stat.yellow { border-color: rgba(234,179,8,.3); background: rgba(234,179,8,.07); }
        .painel-stat.red { border-color: rgba(239,68,68,.3); background: rgba(239,68,68,.07); }
        .painel-stat-num {
          font-size: 36px;
          font-weight: 900;
          color: #f8fafc;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .painel-stat-label {
          font-size: 12px;
          color: #aeb8c2;
          font-weight: 600;
        }
        .painel-section-title {
          font-size: 13px;
          color: #aeb8c2;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .painel-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .painel-card {
          min-height: 200px;
          padding: 22px;
          border-radius: 24px;
          background: #1f2327;
          border: 1px solid #343a40;
          color: #e8eaed;
          text-decoration: none;
          box-shadow: 0 18px 42px rgba(0,0,0,.22);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 12px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .painel-card:hover {
          border-color: rgba(34,197,94,.5);
          box-shadow: 0 22px 50px rgba(0,0,0,.3);
        }
        .painel-card-icon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: rgba(34,197,94,.14);
          border: 1px solid rgba(34,197,94,.28);
          font-size: 24px;
          flex-shrink: 0;
        }
        .painel-card-title {
          display: block;
          color: #f8fafc;
          font-size: 20px;
          line-height: 1.1;
          letter-spacing: -.04em;
        }
        .painel-card-text {
          margin: 0;
          color: #aeb8c2;
          line-height: 1.5;
          font-size: 13px;
          font-weight: 500;
          flex: 1;
        }
        .painel-card-btn {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border-radius: 14px;
          background: #22c55e;
          color: #06140b;
          text-decoration: none;
          font-weight: 950;
          font-size: 13px;
        }
        .painel-tip {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 14px;
          background: rgba(34,197,94,.08);
          border: 1px solid rgba(34,197,94,.22);
          margin-top: 8px;
        }
        .painel-tip-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
        .painel-tip-text { margin: 0; color: #aeb8c2; font-size: 13px; line-height: 1.6; }

        /* --- TABLET (até 900px) --- */
        @media (max-width: 900px) {
          .painel-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .painel-actions {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* --- MOBILE (até 560px) --- */
        @media (max-width: 560px) {
          .painel-greeting { font-size: 15px; margin-bottom: 14px; }
          .painel-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-bottom: 20px;
          }
          .painel-stat { padding: 14px 12px; border-radius: 12px; }
          .painel-stat-num { font-size: 28px; }
          .painel-stat-label { font-size: 11px; }
          .painel-actions {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 16px;
          }
          .painel-card {
            min-height: unset;
            flex-direction: row;
            align-items: center;
            padding: 16px;
            border-radius: 18px;
            gap: 14px;
          }
          .painel-card-icon { width: 44px; height: 44px; font-size: 20px; border-radius: 12px; }
          .painel-card-title { font-size: 16px; }
          .painel-card-text { display: none; }
          .painel-card-btn {
            min-height: 38px;
            white-space: nowrap;
            font-size: 12px;
            padding: 0 12px;
            border-radius: 10px;
            flex-shrink: 0;
          }
          .painel-tip { padding: 12px 14px; border-radius: 12px; }
          .painel-tip-text { font-size: 12px; }
        }
      `}</style>

      <p className="painel-greeting">
        Olá, <strong>{nomeUsuario}</strong> 👋
      </p>

      {/* Stats */}
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

      {/* Ações */}
      <h2 className="painel-section-title">O que deseja fazer?</h2>
      <section className="painel-actions">
        <Link href="/painel/anuncios" className="painel-card">
          <span className="painel-card-icon">🚛</span>
          <strong className="painel-card-title">Meus anúncios</strong>
          <p className="painel-card-text">
            Acompanhe seus anúncios, status de aprovação e publicação.
          </p>
          <span className="painel-card-btn">Ver anúncios</span>
        </Link>

        <Link href="/painel/anuncios/novo/caminhao" className="painel-card">
          <span className="painel-card-icon">➕</span>
          <strong className="painel-card-title">Anunciar caminhão</strong>
          <p className="painel-card-text">
            Cadastre um caminhão com dados, fotos, localização e contato.
          </p>
          <span className="painel-card-btn">Cadastrar</span>
        </Link>

        <Link href="/painel/anuncios/novo/implemento" className="painel-card">
          <span className="painel-card-icon">🛞</span>
          <strong className="painel-card-title">Anunciar implemento</strong>
          <p className="painel-card-text">
            Cadastre carreta, caçamba, prancha, baú, tanque ou outro implemento.
          </p>
          <span className="painel-card-btn">Cadastrar</span>
        </Link>
      </section>

      {/* Dicas contextuais */}
      {pendentes > 0 && (
        <div className="painel-tip">
          <span className="painel-tip-icon">💡</span>
          <p className="painel-tip-text">
            Você tem{" "}
            <strong>
              {pendentes} anúncio{pendentes > 1 ? "s" : ""}
            </strong>{" "}
            aguardando aprovação. Assim que aprovado, aparecerá no site.
          </p>
        </div>
      )}

      {total === 0 && (
        <div className="painel-tip">
          <span className="painel-tip-icon">🚀</span>
          <p className="painel-tip-text">
            Você ainda não tem anúncios. Cadastre seu primeiro caminhão ou
            implemento agora!
          </p>
        </div>
      )}
    </PanelLayout>
  );
}
