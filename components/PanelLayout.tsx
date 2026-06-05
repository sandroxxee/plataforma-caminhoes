import Link from "next/link";
import type { ReactNode } from "react";
import { sair } from "@/app/logout/actions";
import { PanelMenu } from "@/components/PanelMenu";
import { ThemeToggle } from "@/components/ThemeToggle";

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
};

function PanelBrandIcon() {
  return (
    <span className="panel-brand-icon" aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img">
        <path className="truck-body" d="M7 18.5c0-2 1.6-3.5 3.5-3.5h18c1.9 0 3.5 1.5 3.5 3.5V30H7V18.5Z" />
        <path className="truck-cabin" d="M32 21h5.2c1.1 0 2.1.5 2.8 1.4l3 4V30H32v-9Z" />
        <path className="truck-line" d="M11 20h15M36 24h2.8l1.5 2" />
        <path className="truck-road" d="M5 34h38" />
        <circle className="truck-wheel" cx="15" cy="32" r="3.5" />
        <circle className="truck-wheel" cx="35" cy="32" r="3.5" />
      </svg>
    </span>
  );
}

export function PanelLayout({ title, subtitle, badge, actions, children }: Props) {
  return (
    <main className="panel-page">
      <aside className="panel-sidebar">
        <Link href="/painel" className="panel-brand" prefetch={false}>
          <PanelBrandIcon />
          <span>
            <strong>Caminhões à Venda</strong>
            <small>Painel do anunciante</small>
          </span>
        </Link>

        <PanelMenu />

        <div className="panel-bottom">
          <ThemeToggle />
          <a href="/anuncios" className="panel-public">Ver site público</a>
          <form action={sair}>
            <button type="submit" className="panel-logout">Sair da conta</button>
          </form>
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
        html,body{max-width:100%;overflow-x:hidden}.panel-page,.panel-page *{box-sizing:border-box}.panel-page{--panel-bg:#111315;--panel-side:#181b1e;--panel-card:#1f2327;--panel-soft:#2a2f34;--panel-line:#343a40;--panel-text:#e8eaed;--panel-title:#f4f4f5;--panel-muted:#a7afb7;--panel-muted2:#8f99a3;--panel-green:#22c55e;--panel-green-soft:#19251d;--panel-green-text:#d9ffe7;--panel-red-bg:#35191b;--panel-red:#fecaca;min-height:100vh;max-width:100vw;overflow-x:hidden;display:grid;grid-template-columns:272px minmax(0,1fr);background:var(--panel-bg);color:var(--panel-text)}html[data-theme="light"] .panel-page{--panel-bg:#f3f6fb;--panel-side:#ffffff;--panel-card:#ffffff;--panel-soft:#eef2f7;--panel-line:#d8dee9;--panel-text:#334155;--panel-title:#111827;--panel-muted:#64748b;--panel-muted2:#64748b;--panel-green:#16a34a;--panel-green-soft:#e7f8ef;--panel-green-text:#166534;--panel-red-bg:#fff5f5;--panel-red:#b42318}.panel-sidebar{position:sticky;top:0;height:100vh;padding:22px;border-right:1px solid var(--panel-line);background:var(--panel-side);display:flex;flex-direction:column;gap:18px;overflow-y:auto;overflow-x:hidden;min-width:0}.panel-brand{display:flex;align-items:center;gap:12px;padding:14px;border-radius:18px;background:var(--panel-card);border:1px solid var(--panel-line);color:var(--panel-text);text-decoration:none;min-width:0;max-width:100%;overflow:hidden}.panel-brand>span{min-width:0}.panel-brand-icon{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:var(--panel-green);color:#06140b;flex:0 0 auto;overflow:hidden}.panel-brand-icon svg{width:32px;height:32px;display:block}.truck-body,.truck-cabin{fill:#06140b}.truck-line,.truck-road{fill:none;stroke:#14532d;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.truck-wheel{fill:#06140b;stroke:var(--panel-green);stroke-width:1.5}.panel-brand strong{display:block;font-size:15px;line-height:1.1;letter-spacing:-.02em;color:var(--panel-title);overflow-wrap:anywhere}.panel-brand small{display:block;color:var(--panel-muted);font-size:12px;margin-top:4px;font-weight:800;overflow-wrap:anywhere}.panel-menu{display:grid;gap:8px;min-width:0}.panel-menu-link,.panel-public,.panel-logout,.theme-toggle{width:100%;max-width:100%;min-height:50px;padding:11px 12px;border-radius:14px;color:var(--panel-text);background:var(--panel-card);border:1px solid var(--panel-line);text-decoration:none;font-weight:800;display:flex;align-items:center;gap:11px;text-align:left;cursor:pointer;font-family:inherit;transition:background .18s ease,border-color .18s ease,color .18s ease;min-width:0;overflow:hidden}.panel-menu-link:hover,.panel-public:hover,.theme-toggle:hover{background:var(--panel-green-soft);border-color:var(--panel-green);color:var(--panel-green-text)}.panel-menu-link.active{background:var(--panel-green-soft);border-color:var(--panel-green);color:var(--panel-green-text);box-shadow:inset 4px 0 0 var(--panel-green)}.panel-menu-icon{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:var(--panel-soft);color:var(--panel-green);font-weight:950;flex:0 0 auto}.panel-menu-link.active .panel-menu-icon{background:var(--panel-green);color:#06140b}.panel-menu-link strong{display:block;font-size:14px;line-height:1.15;overflow-wrap:anywhere}.panel-menu-link small{display:block;margin-top:3px;color:var(--panel-muted2);font-size:12px;font-weight:800;overflow-wrap:anywhere}.panel-menu-link.active small{color:var(--panel-green-text)}.panel-bottom{margin-top:auto;display:grid;gap:10px;min-width:0}.panel-bottom form{margin:0;min-width:0}.panel-public,.theme-toggle{justify-content:center;text-align:center;min-height:46px;font-weight:900}.panel-logout{justify-content:center;text-align:center;min-height:46px;color:var(--panel-red);background:var(--panel-red-bg);border-color:#7f1d1d;font-weight:900}.panel-content{padding:28px 40px;min-width:0;max-width:100%;overflow-x:hidden}.panel-header{min-height:auto;padding:22px 24px;border-radius:22px;background:var(--panel-card);border:1px solid var(--panel-line);display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:22px;box-shadow:0 16px 34px rgba(0,0,0,.18);min-width:0;max-width:100%;overflow:hidden}html[data-theme="light"] .panel-header{box-shadow:0 8px 22px rgba(15,23,42,.05)}.panel-badge{display:inline-flex;padding:6px 10px;border-radius:999px;background:var(--panel-green-soft);color:var(--panel-green-text);border:1px solid var(--panel-green);font-weight:900;font-size:12px;text-transform:uppercase}.panel-header h1{margin:10px 0 6px;font-size:clamp(26px,3vw,36px);line-height:1.06;letter-spacing:-.035em;color:var(--panel-title);overflow-wrap:anywhere}.panel-header p{margin:0;color:var(--panel-muted);line-height:1.5;max-width:760px;overflow-wrap:anywhere}.panel-actions{min-width:0}.panel-body{min-width:0;max-width:100%;overflow-x:hidden}@media(max-width:980px){.panel-page{display:block;width:100%;max-width:100vw;overflow-x:hidden}.panel-sidebar{position:sticky;top:0;z-index:20;height:auto;width:100%;max-width:100vw;padding:12px;border-right:0;border-bottom:1px solid var(--panel-line);gap:10px}.panel-brand{padding:10px}.panel-brand-icon{width:40px;height:40px;border-radius:14px}.panel-brand-icon svg{width:29px;height:29px}.panel-menu{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%}.panel-menu-link{min-height:54px;justify-content:center;text-align:center;padding:9px}.panel-menu-icon,.panel-menu-link small{display:none}.panel-bottom{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;margin-top:0;width:100%}.panel-public,.panel-logout,.theme-toggle{min-height:42px;padding:10px 8px;font-size:13px}.panel-content{width:100%;max-width:100vw;padding:16px 12px 28px;overflow-x:hidden}.panel-header{padding:18px;border-radius:18px;display:grid;gap:14px;margin-bottom:16px}.panel-actions,.panel-actions a,.panel-actions button{width:100%;max-width:100%}.panel-body{overflow-x:hidden}}@media(max-width:520px){.panel-sidebar{padding:10px}.panel-brand strong{font-size:14px}.panel-brand small{display:none}.panel-menu{grid-template-columns:1fr}.panel-menu-link{justify-content:flex-start;text-align:left;min-height:46px}.panel-menu-icon{display:grid;width:32px;height:32px}.panel-header h1{font-size:25px}}
      `}</style>
    </main>
  );
}
