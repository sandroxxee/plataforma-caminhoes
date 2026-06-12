import type { ReactNode } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { PanelSubnav } from "@/components/PanelSubnav";

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PanelLayout({ title, subtitle, badge, actions, children }: Props) {
  return (
    <div className="pl-page">
      <PublicHeader />
      <PanelSubnav />

      <div className="pl-container">
        <header className="pl-header">
          <div>
            {badge && <span className="pl-badge">{badge}</span>}
            <h1 className="pl-title">{title}</h1>
            {subtitle && <p className="pl-sub">{subtitle}</p>}
          </div>
          {actions && <div className="pl-actions">{actions}</div>}
        </header>

        <div className="pl-body">{children}</div>
      </div>

      <style>{`
        .pl-page { min-height: 100vh; background: var(--bg); color: var(--text); }
        .pl-container { width: min(1280px, calc(100vw - 32px)); margin: 0 auto; padding: 24px 0 48px; }
        .pl-header {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
          flex-wrap: wrap; margin-bottom: 20px;
          padding: 22px 24px; border-radius: 20px;
          background: var(--surface); border: 1px solid var(--line);
          box-shadow: var(--shadow2);
        }
        .pl-badge {
          display: inline-flex; padding: 5px 10px; border-radius: 999px;
          background: var(--blueSoft); color: var(--blue);
          font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .06em;
          margin-bottom: 6px;
        }
        .pl-title {
          margin: 0 0 4px;
          font-size: clamp(22px, 3vw, 32px);
          letter-spacing: -.04em; line-height: 1.1;
        }
        .pl-sub { margin: 0; color: var(--muted); font-size: 14px; font-weight: 700; line-height: 1.5; }
        .pl-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .pl-body {}
        @media (max-width: 640px) {
          .pl-header { padding: 16px; border-radius: 16px; }
          .pl-title { font-size: 22px; }
        }
      `}</style>
    </div>
  );
}
