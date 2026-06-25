import type { ReactNode } from "react";
import { PanelSubnav } from "@/components/PanelSubnav";
import { PanelHeaderWrapper } from "@/components/PanelHeaderWrapper";
import { SiteFooter } from "@/components/SiteFooter";

type Props = {
  children: ReactNode;
  userName?: string;
  role?: "anunciante" | "admin";
  title?: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
};

export function PanelLayout({ children, role = "anunciante" }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
      <PanelHeaderWrapper isLoggedIn={true} />
      <PanelSubnav role={role} />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
