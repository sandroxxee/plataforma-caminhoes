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
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      {/* Usando Wrapper Client para evitar conflito de cookies/next-headers no build */}
      <PanelHeaderWrapper isLoggedIn={true} />

      {/* Navegação secundária específica do painel */}
      <PanelSubnav role={role} />

      {/* Hero do Painel */}
      <div className="bg-[var(--surface)] border-b border-[var(--line)] py-8 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[var(--blueSoft)] text-[var(--blue)] text-2xl font-black flex items-center justify-center border border-[var(--line)] shadow-sm">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--soft)] border border-[var(--line)] text-[var(--muted)] text-[10px] font-black uppercase tracking-widest">
                {isAdmin ? <Zap size={10} className="mr-1 text-amber-500 fill-amber-500" /> : <Truck size={10} className="mr-1 text-[var(--blue)]" />}
                {isAdmin ? "Administrador" : "Anunciante"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[var(--text)] tracking-tight leading-tight truncate">
              Olá, {displayName}
            </h1>
          </div>
          {actions && <div className="hidden md:block">{actions}</div>}
        </div>
      </div>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl text-[var(--text)]">
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
