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
    </main>
  );
}
