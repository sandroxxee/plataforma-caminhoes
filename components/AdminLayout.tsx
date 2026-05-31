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
        <path className="spark" d="M36 8v5M33.5 10.5h5" />
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
        .admin-page{min-height:100vh;display:grid;grid-template-columns:280px 1fr;background:radial-gradient(circle at 82% -12%,rgba(234,179,8,.16),transparent 32%),radial-gradient(circle at 8% 4%,color-mix(in srgb,var(--site-green) 12%,transparent),transparent 27%),linear-gradient(180deg,var(--site-bg),var(--site-bg-2));color:var(--site-text)}.admin-sidebar{position:sticky;top:0;height:100vh;padding:22px;border-right:1px solid var(--site-line);background:color-mix(in srgb,var(--site-bg) 84%,transparent);backdrop-filter:blur(18px);display:flex;flex-direction:column;gap:18px;overflow-y:auto}.admin-brand{display:flex;align-items:center;gap:12px;padding:14px;border-radius:22px;background:radial-gradient(circle at 0 0,rgba(234,179,8,.20),transparent 44%),var(--site-surface);border:1px solid rgba(234,179,8,.26);color:var(--site-text);text-decoration:none;box-shadow:var(--site-shadow-soft)}.admin-brand-icon{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;background:radial-gradient(circle at 30% 22%,rgba(255,255,255,.36),transparent 24%),linear-gradient(135deg,#facc15,#ca8a04);box-shadow:0 14px 34px rgba(234,179,8,.18),inset 0 1px 0 rgba(255,255,255,.34);overflow:hidden;flex:0 0 auto}.admin-brand-icon svg{width:34px;height:34px;display:block}.shield{fill:rgba(66,32,6,.92)}.check,.spark{fill:none;stroke:rgba(255,251,235,.95);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.spark{stroke-width:2}.admin-brand strong{display:block;font-size:15px;line-height:1.1}.admin-brand small{display:block;color:var(--site-muted);font-size:12px;margin-top:4px;font-weight:800}.admin-menu{display:grid;gap:10px}.admin-menu a,.admin-public,.admin-logout{width:100%;min-height:54px;padding:12px 14px;border-radius:18px;color:var(--site-text);background:var(--site-surface);border:1px solid var(--site-line);text-decoration:none;font-weight:850;display:flex;align-items:center;justify-content:center;text-align:center;white-space:nowrap;font-family:inherit;cursor:pointer;transition:transform .18s ease,border-color .18s ease,background .18s ease}.admin-menu a:hover,.admin-menu a.active{transform:translateY(-1px);background:rgba(234,179,8,.13);border-color:rgba(234,179,8,.38);color:#fde68a}.admin-menu a.active{box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 14px 30px rgba(234,179,8,.10)}.admin-bottom{margin-top:auto;display:grid;gap:10px}.admin-bottom form{margin:0}.admin-public{background:var(--site-surface);font-weight:900}.admin-logout{color:#fecaca;background:rgba(239,68,68,.10);border-color:rgba(239,68,68,.25);font-weight:900}.admin-content{padding:34px 46px;min-width:0}.admin-header{min-height:124px;padding:28px;border-radius:30px;background:radial-gradient(circle at 0 0,rgba(234,179,8,.12),transparent 36%),var(--site-surface);border:1px solid var(--site-line);display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:24px;box-shadow:var(--site-shadow-soft)}.admin-badge{display:inline-flex;padding:7px 12px;border-radius:999px;background:rgba(234,179,8,.12);color:#fde68a;border:1px solid rgba(234,179,8,.24);font-weight:900;font-size:12px;text-transform:uppercase}.admin-header h1{margin:12px 0 6px;font-size:clamp(28px,4vw,42px);line-height:1.02;letter-spacing:-.045em}.admin-header p{margin:0;color:var(--site-muted);line-height:1.55;max-width:760px}.admin-body{min-width:0}@media(max-width:900px){.admin-page{display:block}.admin-sidebar{position:sticky;top:0;z-index:20;height:auto;padding:12px;border-right:0;border-bottom:1px solid var(--site-line);gap:12px;background:color-mix(in srgb,var(--site-bg) 96%,transparent)}.admin-brand{padding:12px}.admin-brand-icon{width:38px;height:38px}.admin-brand-icon svg{width:28px;height:28px}.admin-brand small{display:none}.admin-menu{display:flex;gap:8px;overflow-x:auto;padding-bottom:2px;-webkit-overflow-scrolling:touch}.admin-menu a{min-width:max-content;min-height:42px;padding:10px 13px;font-size:14px}.admin-bottom{margin-top:0;display:grid;grid-template-columns:1fr 1fr;gap:8px}.admin-public,.admin-logout{min-height:42px;padding:10px 12px;font-size:14px}.admin-content{padding:16px 12px 28px}.admin-header{min-height:auto;padding:18px;border-radius:22px;display:grid;gap:14px;margin-bottom:16px}.admin-header h1{font-size:26px}.admin-actions,.admin-actions a,.admin-actions button{width:100%}.admin-body section,.admin-body form,.admin-body article{max-width:100%}.admin-body table{min-width:760px}.admin-body{overflow-x:auto}}@media(max-width:520px){.admin-sidebar{padding:10px}.admin-brand{font-size:14px}.admin-menu a,.admin-public,.admin-logout{font-size:13px}.admin-header h1{font-size:23px}}
      `}</style>
    </main>
  );
}
