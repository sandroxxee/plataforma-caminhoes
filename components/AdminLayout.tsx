import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AdminLayout({ title, subtitle, badge, actions, children }: Props) {
  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <Link href="/admin/pendentes" className="admin-brand">
          <span className="admin-brand-icon">⚙️</span>
          <span>
            <strong>Admin Truck</strong>
            <small>Controle da plataforma</small>
          </span>
        </Link>

        <nav className="admin-menu">
          <Link href="/admin/pendentes">Pendentes</Link>
          <Link href="/admin/anuncios">Todos anúncios</Link>
          <Link href="/painel/anuncios/novo">Criar anúncio</Link>
          <Link href="/painel/anuncios">Painel anunciante</Link>
        </nav>

        <div className="admin-bottom">
          <Link href="/anuncios" className="admin-public">Ver site público</Link>
          <Link href="/logout" className="admin-logout">Sair</Link>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-header">
          <div>
            {badge && <span className="admin-badge">{badge}</span>}
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="admin-actions">{actions}</div>}
        </header>

        <div className="admin-body">{children}</div>
      </section>

      <style>{`
        .admin-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 270px 1fr;
          background: linear-gradient(135deg,#020617 0%,#111827 55%,#020617 100%);
          color: white;
        }

        .admin-sidebar {
          padding: 24px;
          border-right: 1px solid rgba(255,255,255,.10);
          background: rgba(2,6,23,.78);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .admin-brand {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 18px;
          border-radius: 18px;
          background: rgba(234,179,8,.10);
          border: 1px solid rgba(234,179,8,.22);
          color: white;
          text-decoration: none;
        }

        .admin-brand-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #eab308;
        }

        .admin-brand small {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          margin-top: 4px;
        }

        .admin-menu {
          display: grid;
          gap: 12px;
        }

        .admin-menu a,
        .admin-public,
        .admin-logout {
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

        .admin-bottom {
          margin-top: auto;
          display: grid;
          gap: 12px;
        }

        .admin-public {
          background: rgba(255,255,255,.08);
          font-weight: 900;
        }

        .admin-logout {
          color: #fecaca;
          background: rgba(239,68,68,.10);
          border-color: rgba(239,68,68,.25);
          font-weight: 900;
        }

        .admin-content {
          padding: 34px 46px;
          min-width: 0;
        }

        .admin-header {
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

        .admin-badge {
          display: inline-flex;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(234,179,8,.12);
          color: #fde68a;
          border: 1px solid rgba(234,179,8,.24);
          font-weight: 900;
          font-size: 12px;
          text-transform: uppercase;
        }

        .admin-header h1 {
          margin: 12px 0 6px;
          font-size: 34px;
          line-height: 1.05;
        }

        .admin-header p {
          margin: 0;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .admin-body {
          min-width: 0;
        }

        @media (max-width: 900px) {
          .admin-page {
            display: block;
          }

          .admin-sidebar {
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

          .admin-brand {
            padding: 12px;
            flex-direction: row;
          }

          .admin-brand-icon {
            width: 38px;
            height: 38px;
          }

          .admin-brand small {
            display: none;
          }

          .admin-menu {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 2px;
            -webkit-overflow-scrolling: touch;
          }

          .admin-menu a {
            min-width: max-content;
            min-height: 42px;
            padding: 10px 13px;
            font-size: 14px;
          }

          .admin-bottom {
            margin-top: 0;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .admin-public,
          .admin-logout {
            min-height: 42px;
            padding: 10px 12px;
            font-size: 14px;
          }

          .admin-content {
            padding: 16px 12px 28px;
          }

          .admin-header {
            min-height: auto;
            padding: 18px;
            border-radius: 20px;
            display: grid;
            gap: 14px;
            margin-bottom: 16px;
          }

          .admin-header h1 {
            font-size: 26px;
          }

          .admin-actions,
          .admin-actions a,
          .admin-actions button {
            width: 100%;
          }

          .admin-body section,
          .admin-body form,
          .admin-body article {
            max-width: 100%;
          }

          .admin-body table {
            min-width: 760px;
          }

          .admin-body {
            overflow-x: auto;
          }
        }

        @media (max-width: 520px) {
          .admin-sidebar {
            padding: 10px;
          }

          .admin-brand {
            font-size: 14px;
          }

          .admin-menu a,
          .admin-public,
          .admin-logout {
            font-size: 13px;
          }

          .admin-header h1 {
            font-size: 23px;
          }
        }
      `}</style>
    </main>
  );
}
