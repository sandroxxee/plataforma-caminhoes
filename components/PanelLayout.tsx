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
        .panel-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 292px 1fr;
          background:
            radial-gradient(circle at 4% 0%, rgba(34,197,94,.16), transparent 30%),
            linear-gradient(135deg,#020506 0%,#06110e 58%,#020506 100%);
          color: white;
        }

        .panel-sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          padding: 22px;
          border-right: 1px solid rgba(255,255,255,.10);
          background: rgba(2,6,8,.76);
          backdrop-filter: blur(18px);
          display: flex;
          flex-direction: column;
          gap: 18px;
          overflow-y: auto;
        }

        .panel-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 20px;
          background:
            radial-gradient(circle at 0 0, rgba(34,197,94,.20), transparent 44%),
            linear-gradient(180deg, rgba(16,23,26,.94), rgba(8,13,15,.94));
          border: 1px solid rgba(34,197,94,.20);
          color: white;
          text-decoration: none;
          box-shadow: 0 18px 44px rgba(0,0,0,.22);
        }

        .panel-brand-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 30% 22%, rgba(255,255,255,.34), transparent 24%),
            linear-gradient(135deg, #22c55e, #15803d);
          color: #052e16;
          box-shadow: 0 14px 34px rgba(34,197,94,.18), inset 0 1px 0 rgba(255,255,255,.32);
          flex: 0 0 auto;
          overflow: hidden;
        }

        .panel-brand-icon svg {
          width: 34px;
          height: 34px;
          display: block;
        }

        .truck-body,
        .truck-cabin {
          fill: rgba(5, 46, 22, .92);
        }

        .truck-line,
        .truck-road {
          fill: none;
          stroke: rgba(236, 253, 245, .92);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .truck-wheel {
          fill: #020506;
          stroke: rgba(236, 253, 245, .9);
          stroke-width: 1.5;
        }

        .panel-brand strong {
          display: block;
          font-size: 15px;
          line-height: 1.1;
          letter-spacing: -.02em;
        }

        .panel-brand small {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          margin-top: 4px;
          font-weight: 800;
        }

        .panel-menu {
          display: grid;
          gap: 10px;
        }

        .panel-menu-link,
        .panel-public,
        .panel-logout {
          width: 100%;
          min-height: 58px;
          padding: 11px 12px;
          border-radius: 17px;
          color: white;
          background: rgba(255,255,255,.055);
          border: 1px solid rgba(255,255,255,.10);
          text-decoration: none;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 11px;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: transform .18s ease, border-color .18s ease, background .18s ease;
        }

        .panel-menu-link:hover,
        .panel-public:hover {
          transform: translateY(-1px);
          background: rgba(34,197,94,.10);
          border-color: rgba(34,197,94,.28);
        }

        .panel-menu-link.active {
          background: linear-gradient(135deg, rgba(34,197,94,.22), rgba(34,197,94,.09));
          border-color: rgba(34,197,94,.48);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 14px 30px rgba(34,197,94,.10);
        }

        .panel-menu-link.active .panel-menu-icon {
          background: #22c55e;
          color: #052e16;
        }

        .panel-menu-icon {
          width: 38px;
          height: 38px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: rgba(34,197,94,.14);
          color: #86efac;
          font-weight: 950;
          flex: 0 0 auto;
        }

        .panel-menu-link strong {
          display: block;
          font-size: 14px;
          line-height: 1.15;
        }

        .panel-menu-link small {
          display: block;
          margin-top: 3px;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 800;
        }

        .panel-menu-link.active small {
          color: #bbf7d0;
        }

        .panel-bottom {
          margin-top: auto;
          display: grid;
          gap: 10px;
        }

        .panel-bottom form {
          margin: 0;
        }

        .panel-public {
          justify-content: center;
          text-align: center;
          min-height: 48px;
          font-weight: 900;
        }

        .panel-logout {
          justify-content: center;
          text-align: center;
          min-height: 48px;
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
          min-height: 128px;
          padding: 28px;
          border-radius: 28px;
          background:
            radial-gradient(circle at 0 0, rgba(34,197,94,.12), transparent 36%),
            linear-gradient(180deg, rgba(16,23,26,.94), rgba(8,13,15,.94));
          border: 1px solid rgba(255,255,255,.12);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 24px;
          box-shadow: 0 22px 54px rgba(0,0,0,.24);
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
          font-size: clamp(28px, 4vw, 40px);
          line-height: 1.02;
          letter-spacing: -.045em;
        }

        .panel-header p {
          margin: 0;
          color: #cbd5e1;
          line-height: 1.55;
          max-width: 760px;
        }

        .panel-body {
          min-width: 0;
        }

        @media (max-width: 980px) {
          .panel-page { display: block; }
          .panel-sidebar { position: sticky; top: 0; z-index: 20; height: auto; padding: 12px; border-right: 0; border-bottom: 1px solid rgba(255,255,255,.10); gap: 10px; background: rgba(2,6,8,.96); }
          .panel-brand { padding: 10px; }
          .panel-brand-icon { width: 40px; height: 40px; border-radius: 14px; }
          .panel-brand-icon svg { width: 29px; height: 29px; }
          .panel-menu { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
          .panel-menu-link { min-height: 56px; justify-content: center; text-align: center; padding: 9px; }
          .panel-menu-icon, .panel-menu-link small { display: none; }
          .panel-bottom { grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 0; }
          .panel-public, .panel-logout { min-height: 42px; padding: 10px 12px; font-size: 14px; }
          .panel-content { padding: 16px 12px 28px; }
          .panel-header { min-height: auto; padding: 18px; border-radius: 22px; display: grid; gap: 14px; margin-bottom: 16px; }
          .panel-actions, .panel-actions a, .panel-actions button { width: 100%; }
          .panel-body section, .panel-body form, .panel-body article { max-width: 100%; }
          .panel-body table { min-width: 720px; }
          .panel-body { overflow-x: auto; }
        }

        @media (max-width: 520px) {
          .panel-sidebar { padding: 10px; }
          .panel-brand strong { font-size: 14px; }
          .panel-brand small { display: none; }
          .panel-menu { grid-template-columns: 1fr; }
          .panel-menu-link { justify-content: flex-start; text-align: left; min-height: 46px; }
          .panel-menu-icon { display: grid; width: 32px; height: 32px; }
          .panel-header h1 { font-size: 25px; }
        }
      `}</style>
    </main>
  );
}
