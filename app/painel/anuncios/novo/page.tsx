import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";

export const dynamic = "force-dynamic";

export default async function NovoAnuncioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <PanelLayout role="anunciante">
      <div className="novo-wrap">
        <div className="novo-header">
          <div>
            <h1 className="novo-title">Novo anúncio</h1>
            <p className="novo-sub">Selecione a categoria do que você quer anunciar.</p>
          </div>
          <Link href="/painel/anuncios" className="novo-back">← Voltar</Link>
        </div>

        <div className="novo-list">
          <Link href="/painel/anuncios/novo/caminhao" className="novo-item">
            <div className="novo-item-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="1" y="10" width="15" height="9" rx="2"/>
                <path d="M16 13h3l3 3v3h-6v-6z"/>
                <circle cx="5.5" cy="20.5" r="1.5"/>
                <circle cx="18.5" cy="20.5" r="1.5"/>
              </svg>
            </div>
            <div className="novo-item-body">
              <span className="novo-item-title">Caminhão</span>
              <span className="novo-item-desc">Cavalo, truck, toco, 3/4, baú, tanque…</span>
            </div>
            <svg className="novo-item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </Link>

          <Link href="/painel/anuncios/novo/carreta" className="novo-item">
            <div className="novo-item-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="1" y="9" width="22" height="9" rx="2"/>
                <circle cx="5" cy="20" r="2"/>
                <circle cx="12" cy="20" r="2"/>
                <circle cx="19" cy="20" r="2"/>
              </svg>
            </div>
            <div className="novo-item-body">
              <span className="novo-item-title">Carreta</span>
              <span className="novo-item-desc">Graneleira, porta-contêiner, frigorífica, tanque…</span>
            </div>
            <svg className="novo-item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </Link>

          <Link href="/painel/anuncios/novo/implemento" className="novo-item">
            <div className="novo-item-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="2" y="8" width="20" height="10" rx="2"/>
                <circle cx="6" cy="20" r="2"/>
                <circle cx="18" cy="20" r="2"/>
                <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <div className="novo-item-body">
              <span className="novo-item-title">Implemento</span>
              <span className="novo-item-desc">Caçamba, prancha, sider, dolly, baú…</span>
            </div>
            <svg className="novo-item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </Link>

          <Link href="/painel/anuncios/novo/maquina" className="novo-item">
            <div className="novo-item-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
            </div>
            <div className="novo-item-body">
              <span className="novo-item-title">Máquina</span>
              <span className="novo-item-desc">Escavadeira, motoniveladora, pá carregadeira, trator…</span>
            </div>
            <svg className="novo-item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </Link>

          <Link href="/painel/anuncios/novo/peca" className="novo-item">
            <div className="novo-item-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <div className="novo-item-body">
              <span className="novo-item-title">Peça</span>
              <span className="novo-item-desc">Motor, câmbio, eixo, suspensão, elétrica…</span>
            </div>
            <svg className="novo-item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </Link>
        </div>
      </div>

      <style>{`
        .novo-wrap {
          width: min(560px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 28px 0 64px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .novo-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .novo-title {
          font-size: clamp(20px, 3vw, 26px);
          font-weight: 900;
          letter-spacing: -.03em;
          color: var(--text);
          margin: 0;
          line-height: 1.15;
        }
        .novo-sub {
          margin: 3px 0 0;
          font-size: 13.5px;
          font-weight: 700;
          color: var(--muted);
        }
        .novo-back {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          height: 34px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid var(--line);
          background: var(--surface);
          color: var(--muted);
          text-decoration: none;
          font-size: 12.5px;
          font-weight: 800;
          transition: all .15s;
        }
        .novo-back:hover { background: var(--soft); color: var(--text); }

        .novo-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--line);
          box-shadow: var(--shadow);
        }
        .novo-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          background: var(--surface);
          border-bottom: 1px solid var(--line);
          text-decoration: none;
          color: var(--text);
          transition: background .14s;
        }
        .novo-item:last-child { border-bottom: none; }
        .novo-item:hover { background: var(--soft); }
        .novo-item:hover .novo-item-icon { color: var(--blue); background: var(--blueSoft); }

        .novo-item-icon {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: var(--soft);
          color: var(--muted);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background .14s, color .14s;
        }
        .novo-item-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .novo-item-title {
          font-size: 15px;
          font-weight: 900;
          letter-spacing: -.02em;
          color: var(--text);
        }
        .novo-item-desc {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .novo-item-arrow {
          flex-shrink: 0;
          color: var(--line);
          transition: color .14s, transform .14s;
        }
        .novo-item:hover .novo-item-arrow {
          color: var(--blue);
          transform: translateX(2px);
        }

        @media (max-width: 640px) {
          .novo-wrap { padding: 20px 0 80px; }
          .novo-item { padding: 14px 16px; gap: 12px; }
          .novo-item-icon { width: 38px; height: 38px; border-radius: 10px; }
          .novo-item-title { font-size: 14px; }
          .novo-item-desc { font-size: 12px; }
        }
      `}</style>
    </PanelLayout>
  );
}
