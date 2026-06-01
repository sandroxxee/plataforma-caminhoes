import Link from "next/link";
import type { ReactNode } from "react";
import { sair } from "@/app/logout/actions";
import { AdminMenu } from "@/components/AdminMenu";

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
        .admin-page{min-height:100vh;display:grid;grid-template-columns:272px 1fr;background:#111315;color:#e8eaed}.admin-sidebar{position:sticky;top:0;height:100vh;padding:22px;border-right:1px solid #343a40;background:#181b1e;display:flex;flex-direction:column;gap:18px;overflow-y:auto}.admin-brand{display:flex;align-items:center;gap:12px;padding:14px;border-radius:18px;background:#1f2327;border:1px solid #343a40;color:#e8eaed;text-decoration:none}.admin-brand-icon{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:#22c55e;flex:0 0 auto}.admin-brand-icon svg{width:30px;height:30px;display:block}.shield{fill:#06140b}.check{fill:none;stroke:#06140b;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.admin-brand strong{display:block;font-size:15px;line-height:1.1;color:#f4f4f5}.admin-brand small{display:block;color:#a7afb7;font-size:12px;margin-top:4px;font-weight:700}.admin-menu{display:grid;gap:8px}.admin-menu a,.admin-public,.admin-logout{width:100%;min-height:48px;padding:11px 14px;border-radius:14px;color:#cbd5df;background:#1f2327;border:1px solid #343a40;text-decoration:none;font-weight:800;display:flex;align-items:center;justify-content:center;text-align:center;white-space:nowrap;font-family:inherit;cursor:pointer;transition:background .18s ease,border-color .18s ease,color .18s ease}.admin-menu a:hover,.admin-menu a.active{background:#19251d;border-color:#22c55e;color:#d9ffe7}.admin-menu a.active{box-shadow:inset 4px 0 0 #22c55e}.admin-bottom{margin-top:auto;display:grid;gap:10px}.admin-bottom form{margin:0}.admin-public{font-weight:900;background:#202428;color:#e8eaed}.admin-logout{color:#fecaca;background:#35191b;border-color:#7f1d1d;font-weight:900}.admin-content{padding:28px 40px;min-width:0}.admin-header{min-height:auto;padding:22px 24px;border-radius:22px;background:#1f2327;border:1px solid #343a40;display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:22px;box-shadow:0 16px 34px rgba(0,0,0,.18)}.admin-badge{display:inline-flex;padding:6px 10px;border-radius:999px;background:#19251d;color:#a7f3c3;border:1px solid #22c55e;font-weight:900;font-size:12px;text-transform:uppercase}.admin-header h1{margin:10px 0 6px;font-size:clamp(26px,3vw,36px);line-height:1.06;letter-spacing:-.035em;color:#f4f4f5}.admin-header p{margin:0;color:#a7afb7;line-height:1.5;max-width:760px}.admin-body{min-width:0}@media(max-width:900px){.admin-page{display:block}.admin-sidebar{position:sticky;top:0;z-index:20;height:auto;padding:12px;border-right:0;border-bottom:1px solid #343a40;gap:12px}.admin-brand{padding:12px}.admin-brand-icon{width:38px;height:38px}.admin-brand-icon svg{width:26px;height:26px}.admin-brand small{display:none}.admin-menu{display:flex;gap:8px;overflow-x:auto;padding-bottom:2px;-webkit-overflow-scrolling:touch}.admin-menu a{min-width:max-content;min-height:42px;padding:10px 13px;font-size:14px}.admin-bottom{margin-top:0;display:grid;grid-template-columns:1fr 1fr;gap:8px}.admin-public,.admin-logout{min-height:42px;padding:10px 12px;font-size:14px}.admin-content{padding:16px 12px 28px}.admin-header{padding:18px;border-radius:18px;display:grid;gap:14px;margin-bottom:16px}.admin-header h1{font-size:25px}.admin-actions,.admin-actions a,.admin-actions button{width:100%}.admin-body{overflow-x:auto}}
      `}</style>
    </main>
  );
}
