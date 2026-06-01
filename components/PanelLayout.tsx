import Link from "next/link";
import type { ReactNode } from "react";
import { sair } from "@/app/logout/actions";
import { PanelMenu } from "@/components/PanelMenu";

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
        .panel-page{min-height:100vh;display:grid;grid-template-columns:272px 1fr;background:#f3f6fb;color:#111827}.panel-sidebar{position:sticky;top:0;height:100vh;padding:22px;border-right:1px solid #d8dee9;background:#fff;display:flex;flex-direction:column;gap:18px;overflow-y:auto}.panel-brand{display:flex;align-items:center;gap:12px;padding:14px;border-radius:18px;background:#f8fafc;border:1px solid #d8dee9;color:#111827;text-decoration:none}.panel-brand-icon{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:#1f64b5;color:#fff;flex:0 0 auto;overflow:hidden}.panel-brand-icon svg{width:32px;height:32px;display:block}.truck-body,.truck-cabin{fill:#fff}.truck-line,.truck-road{fill:none;stroke:#dbeafe;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.truck-wheel{fill:#1f64b5;stroke:#fff;stroke-width:1.5}.panel-brand strong{display:block;font-size:15px;line-height:1.1;letter-spacing:-.02em;color:#111827}.panel-brand small{display:block;color:#64748b;font-size:12px;margin-top:4px;font-weight:800}.panel-menu{display:grid;gap:8px}.panel-menu-link,.panel-public,.panel-logout{width:100%;min-height:50px;padding:11px 12px;border-radius:14px;color:#334155;background:#fff;border:1px solid #d8dee9;text-decoration:none;font-weight:800;display:flex;align-items:center;gap:11px;text-align:left;cursor:pointer;font-family:inherit;transition:background .18s ease,border-color .18s ease,color .18s ease}.panel-menu-link:hover,.panel-public:hover{background:#eaf2ff;border-color:#9fc3ff;color:#164b8f}.panel-menu-link.active{background:#eaf2ff;border-color:#9fc3ff;color:#164b8f;box-shadow:inset 4px 0 0 #1f64b5}.panel-menu-icon{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:#eef2f7;color:#1f64b5;font-weight:950;flex:0 0 auto}.panel-menu-link.active .panel-menu-icon{background:#1f64b5;color:#fff}.panel-menu-link strong{display:block;font-size:14px;line-height:1.15}.panel-menu-link small{display:block;margin-top:3px;color:#64748b;font-size:12px;font-weight:800}.panel-menu-link.active small{color:#164b8f}.panel-bottom{margin-top:auto;display:grid;gap:10px}.panel-bottom form{margin:0}.panel-public{justify-content:center;text-align:center;min-height:46px;font-weight:900;background:#f8fafc;color:#111827}.panel-logout{justify-content:center;text-align:center;min-height:46px;color:#b42318;background:#fff5f5;border-color:#ffd1d1;font-weight:900}.panel-content{padding:28px 40px;min-width:0}.panel-header{min-height:auto;padding:22px 24px;border-radius:22px;background:#fff;border:1px solid #d8dee9;display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:22px}.panel-badge{display:inline-flex;padding:6px 10px;border-radius:999px;background:#eaf2ff;color:#164b8f;border:1px solid #b8d4ff;font-weight:900;font-size:12px;text-transform:uppercase}.panel-header h1{margin:10px 0 6px;font-size:clamp(26px,3vw,36px);line-height:1.06;letter-spacing:-.035em;color:#111827}.panel-header p{margin:0;color:#64748b;line-height:1.5;max-width:760px}.panel-body{min-width:0}@media(max-width:980px){.panel-page{display:block}.panel-sidebar{position:sticky;top:0;z-index:20;height:auto;padding:12px;border-right:0;border-bottom:1px solid #d8dee9;gap:10px}.panel-brand{padding:10px}.panel-brand-icon{width:40px;height:40px;border-radius:14px}.panel-brand-icon svg{width:29px;height:29px}.panel-menu{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.panel-menu-link{min-height:54px;justify-content:center;text-align:center;padding:9px}.panel-menu-icon,.panel-menu-link small{display:none}.panel-bottom{grid-template-columns:1fr 1fr;gap:8px;margin-top:0}.panel-public,.panel-logout{min-height:42px;padding:10px 12px;font-size:14px}.panel-content{padding:16px 12px 28px}.panel-header{padding:18px;border-radius:18px;display:grid;gap:14px;margin-bottom:16px}.panel-actions,.panel-actions a,.panel-actions button{width:100%}.panel-body{overflow-x:auto}}@media(max-width:520px){.panel-sidebar{padding:10px}.panel-brand strong{font-size:14px}.panel-brand small{display:none}.panel-menu{grid-template-columns:1fr}.panel-menu-link{justify-content:flex-start;text-align:left;min-height:46px}.panel-menu-icon{display:grid;width:32px;height:32px}.panel-header h1{font-size:25px}}
      `}</style>
    </main>
  );
}
