import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PanelLayout({ title, subtitle, badge, actions, children }: Props) {
  return (
    <main className="panel-page">
      <aside className="panel-sidebar">
        <Link href="/painel" className="panel-brand">
          <span className="panel-brand-icon">🚛</span>
          <span>
            <strong>Plataforma Truck</strong>
            <small>Painel do anunciante</small>
          </span>
        </Link>

        <nav className="panel-menu">
          <Link href="/painel">Painel</Link>
          <Link href="/painel/anuncios">Meus anúncios</Link>
          <Link href="/painel/anuncios/novo">Novo anúncio</Link>
        </nav>

        <div className="panel-bottom">
          <Link href="/anuncios" className="panel-public">Ver site público</Link>
          <Link href="/logout" className="panel-logout">Sair</Link>
        </div>
      </aside>

      <section className="panel-content">
        <header className="panel-header">
          <div>
            {badge && <span className="panel-badge">{badge}</span>}
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="panel-actions">{actions}</div>}
        </header>

        <div className="panel-body">{children}</div>
      </section>

      <style>{`
        .panel-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 260px 1fr;
          background: linear-gradient(135deg,#020617 0%,#071f1b 60%,#020617 100%);
          color: white;
        }

        .panel-sidebar {
          padding: 24px;
          border-right: 1px solid rgba(255,255,255,.10);
          background: rgba(2,6,23,.72);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .panel-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 10px;
          padding: 18px;
          border-radius: 18px;
          background: rgba(34,197,94,.10);
          border: 1px solid rgba(34,197,94,.20);
          color: white;
          text-decoration: none;
        }

        .panel-brand-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #22c55e;
        }

        .panel-brand small {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          margin-top: 4px;
        }

        .panel-menu {
          display: grid;
          gap: 12px;
        }

        .panel-menu a,
        .panel-public,
        .panel-logout {
          min-height: 48px;
          padding: 13px 14px;
          border-radius: 14px;
          color: white;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.10);
          text-decoration: none;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
        }

        .panel-bottom {
          margin-top: auto;
          display: grid;
          gap: 12px;
        }

        .panel-public {
          background: rgba(255,255,255,.08);
          font-weight: 900;
        }

        .panel-logout {
          color: #fecaca;
          background: rgba(239,68,68,.10);
          border-color: rgba(239,68,68,.25);
          font-weight: 900;
        }

        .panel-content {
          padding: 34px 46px;
          min-width: 0;
        }

        .panel-header {
          min-height: 120px;
          padding: 28px;
          border-radius: 26px;
          background: rgba(15,23,42,.72);
          border: 1px solid rgba(255,255,255,.10);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 24px;
        }

        .panel-badge {
          display: inline-flex;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(34,197,94,.12);
          color: #86efac;
          border: 1px solid rgba(34,197,94,.22);
          font-weight: 900;
          font-size: 12px;
          text-transform: uppercase;
        }

        .panel-header h1 {
          margin: 12px 0 6px;
          font-size: 34px;
          line-height: 1.05;
        }

        .panel-header p {
          margin: 0;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .panel-body {
          min-width: 0;
        }

        @media (max-width: 900px) {
          .panel-page {
            display: block;
          }

          .panel-sidebar {
            position: sticky;
            top: 0;
            z-index: 20;
            padding: 12px;
            border-right: 0;
            border-bottom: 1px solid rgba(255,255,255,.10);
            gap: 12px;
            background: rgba(2,6,23,.96);
            backdrop-filter: blur(14px);
          }

          .panel-brand {
            padding: 12px;
            flex-direction: row;
            justify-content: center;
          }

          .panel-brand-icon {
            width: 38px;
            height: 38px;
          }

          .panel-brand small {
            display: none;
          }

          .panel-menu {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 2px;
            -webkit-overflow-scrolling: touch;
          }

          .panel-menu a {
            min-width: max-content;
            min-height: 42px;
            padding: 10px 13px;
            font-size: 14px;
          }

          .panel-bottom {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 0;
          }

          .panel-public,
          .panel-logout {
            min-height: 42px;
            padding: 10px 12px;
            font-size: 14px;
          }

          .panel-content {
            padding: 16px 12px 28px;
          }

          .panel-header {
            min-height: auto;
            padding: 18px;
            border-radius: 20px;
            display: grid;
            gap: 14px;
            margin-bottom: 16px;
          }

          .panel-header h1 {
            font-size: 26px;
          }

          .panel-actions,
          .panel-actions a,
          .panel-actions button {
            width: 100%;
          }

          .panel-body section,
          .panel-body form,
          .panel-body article {
            max-width: 100%;
          }

          .panel-body table {
            min-width: 720px;
          }

          .panel-body {
            overflow-x: auto;
          }
        }

        @media (max-width: 520px) {
          .panel-sidebar {
            padding: 10px;
          }

          .panel-brand {
            font-size: 14px;
          }

          .panel-menu a,
          .panel-public,
          .panel-logout {
            font-size: 13px;
          }

          .panel-header h1 {
            font-size: 23px;
          }
        }
      `}</style>
    </main>
  );
}
