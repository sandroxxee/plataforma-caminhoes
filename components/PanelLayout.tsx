import type { ReactNode } from "react";
import { PanelSubnav } from "@/components/PanelSubnav";
import { Truck, Zap } from "lucide-react";

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
            <span className="pl-role-badge">
              {isAdmin ? <Zap size={10} style={{ marginRight: 4 }} /> : <Truck size={10} style={{ marginRight: 4 }} />}
              {isAdmin ? "Admin" : "Anunciante"}
            </span>
            <h1 className="pl-welcome">Olá, {displayName}</h1>
          </div>
          {actions && <div className="pl-hero-actions">{actions}</div>}
        </div>
      </div>

      <div className="pl-body">{children}</div>

      <style>{`
        .pl-root {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          padding-bottom: 80px;
          font-family: var(--font-manrope), sans-serif;
        }

        /* Hero */
        .pl-hero {
          background: #ffffff;
          border-bottom: 1px solid rgba(148,163,184,0.12);
          padding: 32px 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }

        .pl-hero-inner {
          width: min(1280px, calc(100vw - 32px));
          margin: 0 auto;
          display: flex; align-items: center; gap: 18px;
          position: relative; z-index: 1;
        }

        /* Avatar */
        .pl-avatar {
          width: 56px; height: 56px; border-radius: 50%; flex-shrink: 0;
          background: var(--blueSoft);
          color: var(--blue); font-size: 24px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #fff;
          box-shadow: 0 4px 12px rgba(24,119,242,0.12);
        }

        .pl-hero-info { flex: 1; min-width: 0; }
        .pl-role-badge {
          display: inline-flex; align-items: center;
          height: 22px; padding: 0 10px; border-radius: 999px;
          background: #f1f5f9; border: 1px solid rgba(148,163,184,0.15);
          color: #64748b; font-size: 10px; font-weight: 800;
          letter-spacing: .08em; text-transform: uppercase; margin-bottom: 6px;
        }
        .pl-welcome {
          margin: 0; color: #0f172a;
          font-size: clamp(20px, 3vw, 32px);
          font-weight: 800; letter-spacing: -.03em; line-height: 1.1;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pl-hero-actions { margin-left: auto; flex-shrink: 0; }

        /* Body */
        .pl-body {
          width: min(1280px, calc(100vw - 32px));
          margin: 0 auto;
          padding-top: 32px;
        }

        @media (max-width: 560px) {
          .pl-hero { padding: 24px 0; }
          .pl-avatar { width: 48px; height: 48px; font-size: 20px; }
          .pl-welcome { font-size: 18px; }
          .pl-body { padding-top: 24px; }
        }
      `}</style>
    </div>
  );
}
