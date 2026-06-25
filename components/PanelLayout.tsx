import type { ReactNode } from "react";
import { PanelSubnav } from "@/components/PanelSubnav";
import { PanelHeaderWrapper } from "@/components/PanelHeaderWrapper";
import { SiteFooter } from "@/components/SiteFooter";
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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
      <PanelHeaderWrapper isLoggedIn={true} />
      <PanelSubnav role={role} />

      {/* Hero do Painel */}
      <div className="panel-hero">
        <div className="panel-hero-inner">
          <div className="panel-hero-avatar">{initial}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="panel-hero-badge">
              {isAdmin
                ? <><Zap size={10} style={{ color: "#f59e0b", fill: "#f59e0b" }} /> Administrador</>
                : <><Truck size={10} style={{ color: "var(--blue)" }} /> Anunciante</>
              }
            </div>
            <h1 className="panel-hero-title">Olá, {displayName}</h1>
          </div>
          {actions && <div style={{ flexShrink: 0 }}>{actions}</div>}
        </div>
      </div>

      <main style={{ flex: 1 }}>
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
