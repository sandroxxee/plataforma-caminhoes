import Link from "next/link";
import type { ReactNode } from "react";
import { sair } from "@/app/logout/actions";
import { AdminMenu } from "@/components/AdminMenu";
import { ThemeToggle } from "@/components/ThemeToggle";

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
};

function AdminBrandIcon() {
  return (
    <span className="admin-brand-icon" aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img">
        <path className="shield" d="M24 6 38 11v11c0 8.5-5.5 15.8-14 20-8.5-4.2-14-11.5-14-20V11l14-5Z" />
        <path className="check" d="m17 24 5 5 10-12" />
      </svg>
    </span>
  );
}

export function AdminLayout({ title, subtitle, badge, actions, children }: Props) {
  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <Link href="/admin/pendentes" className="admin-brand" prefetch={false}>
          <AdminBrandIcon />
          <span>
            <strong>Admin</strong>
            <small>Controle da plataforma</small>
          </span>
        </Link>

        <AdminMenu />

        <div className="admin-bottom">
          <ThemeToggle />
          <a href="/anuncios" className="admin-public">Ver site público</a>
          <form action={sair}>
            <button type="submit" className="admin-logout">Sair</button>
          </form>
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
          grid-template-columns: 280px 1fr;
          background: #f8fafc;
          color: #0f172a;
          font-family: var(--font-manrope), sans-serif;
        }
        .admin-sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          padding: 24px;
          border-right: 1px solid rgba(148,163,184,0.12);
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
        }
        .admin-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          border-radius: 20px;
          background: #f8fafc;
          border: 1px solid rgba(148,163,184,0.08);
          color: #0f172a;
          text-decoration: none;
          transition: all 0.2s;
        }
        .admin-brand:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }
        .admin-brand-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: var(--blue);
          flex: 0 0 auto;
          box-shadow: 0 4px 12px rgba(24,119,242,0.2);
        }
        .admin-brand-icon svg { width: 30px; height: 30px; display: block; }
        .shield { fill: #ffffff; }
        .check { fill: none; stroke: #ffffff; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
        .admin-brand strong { display: block; font-size: 16px; font-weight: 800; line-height: 1.1; color: #0f172a; }
        .admin-brand small { display: block; color: #64748b; font-size: 12px; margin-top: 4px; font-weight: 700; }
        .admin-menu { display: grid; gap: 6px; }
        .admin-menu a, .admin-public, .admin-logout, .theme-toggle {
          width: 100%; min-height: 48px; padding: 12px 16px; border-radius: 14px;
          color: #475569; background: transparent; border: 1px solid transparent;
          text-decoration: none; font-weight: 700; font-size: 14px;
          display: flex; align-items: center; justify-content: flex-start;
          font-family: inherit; cursor: pointer; transition: all 0.2s;
        }
        .admin-menu a:hover, .admin-public:hover, .theme-toggle:hover {
          background: #f1f5f9; color: var(--blue);
        }
        .admin-menu a.active {
          background: var(--blueSoft); color: var(--blue); border-color: rgba(24,119,242,0.08); font-weight: 800;
        }
        .admin-bottom { margin-top: auto; display: grid; gap: 8px; padding-top: 20px; border-top: 1px solid rgba(148,163,184,0.1); }
        .admin-bottom form { margin: 0; }
        .admin-public, .theme-toggle { background: #f8fafc; color: #475569; border: 1px solid rgba(148,163,184,0.1); justify-content: center; font-weight: 800; }
        .admin-logout { color: #ef4444; background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.1); font-weight: 800; justify-content: center; }
        .admin-logout:hover { background: rgba(239,68,68,0.1); color: #dc2626; }
        .admin-content { padding: 32px 48px; min-width: 0; }
        .admin-header {
          min-height: auto; padding: 24px 32px; border-radius: 24px;
          background: #ffffff; border: 1px solid rgba(148,163,184,0.1);
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 20px; margin-bottom: 32px; box-shadow: 0 4px 20px rgba(15,23,42,0.04);
        }
        .admin-badge {
          display: inline-flex; padding: 6px 12px; border-radius: 999px;
          background: var(--blueSoft); color: var(--blue);
          font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .admin-header h1 { margin: 12px 0 8px; font-size: 32px; font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; color: #0f172a; }
        .admin-header p { margin: 0; color: #64748b; font-weight: 600; line-height: 1.6; max-width: 800px; font-size: 15px; }
        .admin-body { min-width: 0; }
        @media(max-width: 900px) {
          .admin-page { display: block; }
          .admin-sidebar { position: sticky; top: 0; z-index: 20; height: auto; padding: 12px; border-right: 0; border-bottom: 1px solid rgba(148,163,184,0.1); gap: 12px; }
          .admin-brand { padding: 12px; border-radius: 16px; }
          .admin-brand-icon { width: 40px; height: 40px; }
          .admin-brand-icon svg { width: 24px; height: 24px; }
          .admin-brand small { display: none; }
          .admin-menu { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch; }
          .admin-menu a { min-width: max-content; min-height: 42px; padding: 10px 16px; font-size: 14px; border-radius: 12px; }
          .admin-bottom { margin-top: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding-top: 0; border-top: 0; }
          .admin-public, .admin-logout, .theme-toggle { min-height: 42px; padding: 10px 12px; font-size: 13px; border-radius: 12px; }
          .admin-content { padding: 20px 16px 40px; }
          .admin-header { padding: 20px; border-radius: 20px; display: grid; gap: 16px; margin-bottom: 24px; }
          .admin-header h1 { font-size: 26px; }
          .admin-actions, .admin-actions a, .admin-actions button { width: 100%; }
        }
      `}</style>
    </main>
  );
}
