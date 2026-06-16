"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Truck, Wrench, Handshake, LayoutDashboard, LogIn,
  Search, X, Menu, Map, Settings, Package,
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
      <style>{`
        .ph-root {
          position: sticky; top: 0; z-index: 80;
          height: 70px;
          background: rgba(255,255,255,.90);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(148,163,184,.16);
          box-shadow: 0 18px 42px rgba(15,23,42,.08);
          display: flex; align-items: center;
          padding: 0 20px; gap: 18px;
        }
        body.public-theme-dark .ph-root {
          background: rgba(15,23,42,.92);
          border-bottom-color: rgba(255,255,255,.12);
          box-shadow: 0 18px 42px rgba(0,0,0,.24);
        }
        .ph-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; flex-shrink: 0;
        }
        .ph-logo-icon {
          width: 40px; height: 40px; border-radius: 14px;
          background: linear-gradient(135deg, #1877f2 0%, #0ea5e9 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 10px rgba(24,119,242,.35);
          flex-shrink: 0;
        }
        .ph-logo-text {
          font-weight: 800; font-size: 15px;
          color: var(--text); line-height: 1.2;
        }
        .ph-logo-text span { color: #1877f2; }
        .ph-search {
          flex: 1; max-width: 340px; position: relative;
        }
        .ph-search input {
          width: 100%; height: 40px; border-radius: 999px;
          border: 1.5px solid var(--line);
          background: var(--soft);
          padding: 0 40px 0 16px;
          font-size: 13px; font-weight: 600;
          color: var(--text); outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .ph-search input:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(24,119,242,.12);
          background: var(--surface);
        }
        .ph-search input::placeholder { color: var(--muted); }
        .ph-search-icon {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          color: var(--muted); pointer-events: none;
        }
        .ph-nav {
          display: flex; align-items: center;
          gap: 8px; margin-left: auto;
        }
        .ph-nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 12px; border-radius: 14px;
          text-decoration: none; font-weight: 700;
          font-size: 13px; color: var(--muted);
          white-space: nowrap; position: relative;
          transition: background .18s, color .18s;
        }
        .ph-nav-link:hover { background: rgba(59,130,246,.12); color: var(--blue); }
        .ph-nav-link.active {
          color: var(--blue); font-weight: 800;
          background: rgba(59,130,246,.12);
        }
        .ph-nav-link.active::after {
          content: '';
          position: absolute; bottom: -2px;
          left: 10px; right: 10px;
          height: 2px; border-radius: 2px;
          background: var(--blue);
        }
        .ph-toggle-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid var(--line);
          background: var(--soft); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--text); flex-shrink: 0;
          transition: background .2s, color .2s;
          touch-action: manipulation;
        }
        .ph-toggle-btn:hover { background: var(--blueSoft); color: var(--blue); }
        .ph-hamburger {
          display: none;
          width: 38px; height: 38px; border-radius: 50%;
          border: 0; background: var(--soft); cursor: pointer;
          align-items: center; justify-content: center;
          color: var(--text); flex-shrink: 0;
        }
        .ph-menu-mobile {
          display: none;
          position: fixed; left: 12px; right: 12px; top: 68px;
          background: var(--surface); border: 1px solid var(--line);
          border-radius: 20px; box-shadow: 0 16px 48px rgba(0,0,0,.14);
          flex-direction: column; padding: 8px; z-index: 100;
        }
        .ph-menu-mobile.open { display: flex; }
        .ph-menu-mobile a {
          display: flex; align-items: center; gap: 10px;
          min-height: 50px; padding: 0 14px; border-radius: 12px;
          color: var(--text); font-weight: 700; font-size: 15px;
          text-decoration: none; transition: background .14s, color .14s;
        }
        .ph-menu-mobile a:hover, .ph-menu-mobile a.active {
          background: var(--blueSoft); color: var(--blue);
        }
        .ph-backdrop {
          display: none; position: fixed; inset: 0;
          z-index: 90; background: rgba(0,0,0,.18);
        }
        .ph-backdrop.open { display: block; }
        .public-cta {
          display: inline-flex;
          align-items: center; justify-content: center;
          min-height: 42px; padding: 0 18px;
          border-radius: 14px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          color: #fff; font-weight: 900;
          text-decoration: none;
          transition: transform .18s, box-shadow .18s, opacity .18s;
        }
        .public-cta:hover { transform: translateY(-1px); box-shadow: 0 18px 44px rgba(37,99,235,.24); }
        @media (max-width: 1100px) {
          .ph-search { display: none; }
        }
        @media (max-width: 900px) {
          .ph-nav { display: none; }
          .ph-hamburger { display: flex; }
          .ph-search { display: none; }
          .ph-logo-text { display: none; }
          .ph-logo-icon { width: 36px; height: 36px; border-radius: 11px; }
          .ph-root { padding: 0 14px; gap: 10px; height: 58px; }
          .public-cta { display: none; }
        }
      `}</style>

      <header className="ph-root">
        <Link href="/" className="ph-logo" aria-label="Caminhões à Venda">
          <div className="ph-logo-icon">
            <Truck size={20} color="white" strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="ph-logo-text">
            Caminhões<br /><span>à Venda</span>
          </div>
        </Link>

        <div className="ph-search">
          <input
            type="search"
            placeholder="Buscar marca, modelo..."
            aria-label="Buscar"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val) window.location.href = `/anuncios?q=${encodeURIComponent(val)}`;
              }
            }}
          />
          <Search size={15} className="ph-search-icon" aria-hidden="true" />
        </div>

        <nav className="ph-nav" aria-label="Menu principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`ph-nav-link${active ? " active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <ThemeTogglePublic />
        </nav>

        <Link href="/anunciar" className="public-cta">Anunciar grátis</Link>

        <button
          className="ph-hamburger"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <nav className={`ph-menu-mobile${menuOpen ? " open" : ""}`} aria-label="Menu mobile">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {menuOpen && (
        <div
          className="ph-backdrop open"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
