"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Truck, Wrench, Handshake, LayoutDashboard, LogIn,
  Search, X, Menu, Settings, Package,
} from "lucide-react";
import { ThemeTogglePublic } from "./ThemeTogglePublic";

function isActive(pathname: string, href: string) {
  const clean = href.split("?")[0].split("#")[0];
  if (clean === "/") return pathname === "/";
  return pathname === clean || pathname.startsWith(`${clean}/`);
}

type Props = { isLoggedIn: boolean };

export function PublicHeaderClient({ isLoggedIn }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "/anuncios",    label: "Caminhões",  icon: Truck },
    { href: "/carretas",    label: "Carretas",   icon: Truck },
    { href: "/implementos", label: "Implementos", icon: Wrench },
    { href: "/maquinas",    label: "Máquinas",   icon: Settings },
    { href: "/pecas",       label: "Peças",      icon: Package },
    { href: "/parceiros",   label: "Parceiros",  icon: Handshake },
    isLoggedIn
      ? { href: "/painel", label: "Painel", icon: LayoutDashboard }
      : { href: "/login",  label: "Entrar", icon: LogIn },
  ];

  return (
    <>
      <header className="sticky top-0 z-[100] h-16 w-full bg-white/80 backdrop-blur-md border-b border-slate-100/50 shadow-sm transition-all duration-300">
        <div className="max-w-[1400px] h-full mx-auto px-4 flex items-center justify-between gap-6">

          {/* Logo Premium */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="Caminhões à Venda">
            <div className="flex flex-col leading-none">
              <span className="text-slate-900 font-black text-lg tracking-tighter uppercase italic">Caminhões</span>
              <span className="text-blue-600 font-black text-[10px] tracking-[0.2em] uppercase ml-0.5">à Venda</span>
            </div>
          </Link>

          {/* Barra de Busca Premium (Apple Style) */}
          <div className="hidden lg:flex flex-1 max-w-md relative group">
            <input
              type="search"
              placeholder="Buscar marca, modelo ou cidade..."
              className="w-full h-10 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.currentTarget as HTMLInputElement).value.trim();
                  if (val) window.location.href = `/anuncios?q=${encodeURIComponent(val)}`;
                }
              }}
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Menu principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200
                    ${active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Ações e Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeTogglePublic />
            </div>

            <Link
              href="/anunciar"
              className="hidden md:flex h-10 px-5 items-center justify-center bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Anunciar grátis
            </Link>

            <button
              className="xl:hidden w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile Premium (Overlay) */}
      <div className={`
        fixed inset-0 z-[90] bg-white transition-all duration-300 xl:hidden
        ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
      `}>
        <div className="pt-20 px-4 pb-8 h-full flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all
                  ${active ? "bg-blue-50 text-blue-600" : "text-slate-900 active:bg-slate-50"}
                `}
                onClick={() => setMenuOpen(false)}
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${active ? "bg-white shadow-sm" : "bg-slate-50"}`}>
                   <Icon size={24} strokeWidth={2.5} />
                </div>
                {item.label}
              </Link>
            );
          })}

          <div className="mt-auto pt-8 flex flex-col gap-4">
             <Link
              href="/anunciar"
              className="h-14 flex items-center justify-center bg-blue-600 text-white rounded-2xl text-base font-black uppercase tracking-widest shadow-xl shadow-blue-500/30"
              onClick={() => setMenuOpen(false)}
            >
              Anunciar grátis
            </Link>
            <div className="flex justify-center">
              <ThemeTogglePublic />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
