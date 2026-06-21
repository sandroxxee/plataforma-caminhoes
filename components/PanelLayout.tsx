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
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PanelHeaderWrapper isLoggedIn={true} />
      <PanelSubnav role={role} />

      {/* Hero banner */}
      <div className={`bg-white border-b border-slate-200 py-8 shadow-sm`}>
        <div className="container mx-auto px-4 max-w-7xl flex items-center gap-5">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex-shrink-0 bg-blue-50 text-blue-600 text-2xl font-black flex items-center justify-center border-2 border-white shadow-lg shadow-blue-600/10">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center h-6 px-3 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5">
              {isAdmin ? <Zap size={10} className="mr-1 text-amber-500 fill-amber-500" /> : <Truck size={10} className="mr-1 text-blue-500" />}
              {isAdmin ? "Admin" : "Anunciante"}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight truncate">
              Olá, {displayName}
            </h1>
          </div>
          {actions && <div className="hidden sm:block">{actions}</div>}
        </div>
      </div>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl text-slate-900">
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
