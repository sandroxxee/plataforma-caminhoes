import type { ReactNode } from "react";
import { PanelSubnav } from "@/components/PanelSubnav";

type Props = {
  title?: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
  userName?: string;
  role?: "anunciante" | "admin";
};

export function PanelLayout({ children, userName, role = "anunciante", actions }: Props) {
  const initial = (userName || "A").charAt(0).toUpperCase();
  const isAdmin = role === "admin";

  return (
    <div className="pl-root">
      <PanelSubnav role={role} />

      {/* Hero header */}
      <div className={`pl-hero ${isAdmin ? "pl-hero-admin" : ""}`}>
        <div className="pl-hero-inner">
          <div className="pl-avatar">{initial}</div>
          <div className="pl-hero-info">
            <span className="pl-role-badge">{isAdmin ? "⚡ Admin" : "🚛 Anunciante"}</span>
            <h1 className="pl-welcome">Olá, {userName || "Anunciante"}</h1>
          </div>
          {actions && <div className="pl-hero-actions">{actions}</div>}
        </div>
      </div>

      <div className="pl-body">
        {children}
      </div>

      <style>{`
        .pl-root { min-height: 100vh; background: var(--bg); color: var(--text); padding-bottom: 40px; }

        /* Hero */
        .pl-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2a1a 100%);
          border-bottom: 1px solid rgba(255,255,255,.07);
          padding: 20px 0 24px;
        }
        .pl-hero-admin {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0c0a1e 100%);
        }
        .pl-hero-inner {
          width: min(1280px, calc(100vw - 32px));
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .pl-avatar {
          width: 48px; height: 48px; border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #052e16; font-size: 20px; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 0 0 3px rgba(34,197,94,.25);
        }
        .pl-hero-admin .pl-avatar {
          background: linear-gradient(135deg, #818cf8, #6366f1);
          color: #1e1b4b; box-shadow: 0 0 0 3px rgba(129,140,248,.25);
        }
        .pl-hero-info { flex: 1; }
        .pl-role-badge {
          display: inline-flex; align-items: center;
          height: 20px; padding: 0 8px; border-radius: 999px;
          background: rgba(34,197,94,.15); border: 1px solid rgba(34,197,94,.3);
          color: #86efac; font-size: 10px; font-weight: 900;
          letter-spacing: .06em; text-transform: uppercase; margin-bottom: 4px;
        }
        .pl-hero-admin .pl-role-badge {
          background: rgba(129,140,248,.15); border-color: rgba(129,140,248,.3); color: #c7d2fe;
        }
        .pl-welcome {
          margin: 0; color: #fff;
          font-size: clamp(18px, 3vw, 26px);
          font-weight: 900; letter-spacing: -.04em; line-height: 1.1;
        }
        .pl-hero-actions { margin-left: auto; }

        /* Body */
        .pl-body {
          width: min(1280px, calc(100vw - 32px));
          margin: 0 auto;
          padding-top: 24px;
        }

        @media (max-width: 560px) {
          .pl-hero { padding: 16px 0 20px; }
          .pl-avatar { width: 42px; height: 42px; font-size: 17px; }
          .pl-welcome { font-size: 18px; }
        }
      `}</style>
    </div>
  );
}
