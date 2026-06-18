import type { ReactNode } from "react";
import { PanelSubnav } from "@/components/PanelSubnav";

type Props = {
  children: ReactNode;
  userName?: string;
  role?: "anunciante" | "admin";
  title?: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
};

export function PanelLayout({ children, userName, role = "anunciante", title, actions }: Props) {
  const displayName = userName || title || "Painel";
  const initial = displayName.charAt(0).toUpperCase();
  const isAdmin = role === "admin";

  return (
    <div className="pl-root">
      <PanelSubnav role={role} />

      {/* Hero banner */}
      <div className={`pl-hero${isAdmin ? " pl-hero-admin" : ""}`}>
        <div className="pl-hero-inner">
          <div className="pl-avatar">{initial}</div>
          <div className="pl-hero-info">
            <span className="pl-role-badge">{isAdmin ? "⚡ Admin" : "🚛 Anunciante"}</span>
            <h1 className="pl-welcome">Olá, {displayName}</h1>
          </div>
          {actions && <div className="pl-hero-actions">{actions}</div>}
        </div>
      </div>

      <div className="pl-body">{children}</div>

      <style>{`
        .pl-root {
          min-height: 100vh;
          background: #080d18;
          color: var(--text);
          padding-bottom: 80px;
        }

        /* Hero */
        .pl-hero {
          background: linear-gradient(135deg, #0d1829 0%, #0a2016 60%, #0d1829 100%);
          border-bottom: 1px solid rgba(34,197,94,.1);
          padding: 22px 0 26px;
          position: relative; overflow: hidden;
        }
        .pl-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(34,197,94,.06), transparent);
          pointer-events: none;
        }
        .pl-hero-admin {
          background: linear-gradient(135deg, #0d1234 0%, #130d2e 60%, #0d1234 100%);
          border-bottom-color: rgba(129,140,248,.1);
        }
        .pl-hero-admin::before {
          background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(129,140,248,.06), transparent);
        }

        .pl-hero-inner {
          width: min(1280px, calc(100vw - 32px));
          margin: 0 auto;
          display: flex; align-items: center; gap: 14px;
          position: relative; z-index: 1;
        }

        /* Avatar */
        .pl-avatar {
          width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #052e16; font-size: 20px; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 3px rgba(34,197,94,.2), 0 4px 16px rgba(34,197,94,.2);
        }
        .pl-hero-admin .pl-avatar {
          background: linear-gradient(135deg, #818cf8, #6366f1);
          color: #1e1b4b;
          box-shadow: 0 0 0 3px rgba(129,140,248,.2), 0 4px 16px rgba(129,140,248,.2);
        }

        .pl-hero-info { flex: 1; min-width: 0; }
        .pl-role-badge {
          display: inline-flex; align-items: center;
          height: 20px; padding: 0 9px; border-radius: 999px;
          background: rgba(34,197,94,.12); border: 1px solid rgba(34,197,94,.25);
          color: #86efac; font-size: 10px; font-weight: 900;
          letter-spacing: .06em; text-transform: uppercase; margin-bottom: 5px;
        }
        .pl-hero-admin .pl-role-badge {
          background: rgba(129,140,248,.12);
          border-color: rgba(129,140,248,.25);
          color: #c7d2fe;
        }
        .pl-welcome {
          margin: 0; color: #fff;
          font-size: clamp(18px, 2.5vw, 26px);
          font-weight: 900; letter-spacing: -.04em; line-height: 1.1;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pl-hero-actions { margin-left: auto; flex-shrink: 0; }

        /* Body */
        .pl-body {
          width: min(1280px, calc(100vw - 32px));
          margin: 0 auto;
          padding-top: 28px;
        }

        .pl-action-btn {
          display: inline-flex; align-items: center; justify-content: center;
          height: 38px; padding: 0 16px; border-radius: 12px;
          background: #22c55e; color: #052e16;
          font-weight: 900; font-size: 13px;
          text-decoration: none; white-space: nowrap;
        }

        @media (max-width: 560px) {
          .pl-hero { padding: 16px 0 20px; }
          .pl-avatar { width: 42px; height: 42px; font-size: 17px; }
          .pl-welcome { font-size: 17px; }
          .pl-body { padding-top: 18px; }
        }
      `}</style>
    </div>
  );
}
