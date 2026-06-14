"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Truck, Wrench, Handshake, LayoutDashboard, LogIn,
  Search, X, Menu, Map, ChevronDown, Settings, Package,
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
  const [maisOpen, setMaisOpen] = useState(false);
  const maisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (maisRef.current && !maisRef.current.contains(e.target as Node)) {
        setMaisOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navItems = [
    { href: "/anuncios",    label: "Caminhões",  icon: Truck },
    { href: "/implementos", label: "Implementos", icon: Wrench },
    { href: "/mapa",        label: "Mapa",        icon: Map },
    { href: "/parceiros",   label: "Parceiros",   icon: Handshake },
    isLoggedIn
      ? { href: "/painel", label: "Painel", icon: LayoutDashboard }
      : { href: "/login",  label: "Entrar", icon: LogIn },
  ];

  const maisItems = [
    { href: "/carretas",  label: "Carretas",  icon: Truck },
    { href: "/maquinas",  label: "Máquinas",  icon: Settings },
    { href: "/pecas",     label: "Peças",     icon: Package },
  ];

  const maisAtivo = maisItems.some((i) => isActive(pathname, i.href));

  return (
    <>
      <style>{`
        .ph-root {
          position: sticky; top: 0; z-index: 80;
          height: 64px;
          background: rgba(255,255,255,.82);
          backdrop-filter: blur(14px) saturate(180%);
          -webkit-backdrop-filter: blur(14px) saturate(180%);
          border-bottom: 1px solid var(--line);
          box-shadow: 0 1px 0 rgba(0,0,0,.04), 0 4px 20px rgba(0,0,0,.06);
          display: flex; align-items: center;
          padding: 0 20px; gap: 16px;
        }
        body.public-theme-dark .ph-root {
          background: rgba(15,23,42,.82);
          border-bottom-color: rgba(255,255,255,.07);
          box-shadow: 0 1px 0 rgba(0,0,0,.2), 0 4px 20px rgba(0,0,0,.3);
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
          flex: 1; max-width: 420px; position: relative;
        }
        .ph-search input {
          width: 100%; height: 44px; border-radius: 999px;
          border: 1.5px solid var(--line);
          background: var(--soft);
          padding: 0 44px 0 18px;
          font-size: 14px; font-weight: 600;
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
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          color: var(--muted); pointer-events: none;
        }
        .ph-nav {
          display: flex; align-items: center;
          gap: 2px; margin-left: auto;
        }
        .ph-nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 10px; border-radius: 8px;
          text-decoration: none; font-weight: 700;
          font-size: 13.5px; color: var(--muted);
          white-space: nowrap; position: relative;
          transition: color .15s;
        }
        .ph-nav-link:hover { color: var(--blue); }
        .ph-nav-link.active { color: var(--blue); font-weight: 800; }
        .ph-nav-link.active::after {
          content: '';
          position: absolute; bottom: -2px;
          left: 10px; right: 10px;
          height: 2px; border-radius: 2px;
          background: var(--blue);
        }

        /* Dropdown Mais */
        .ph-mais-wrap { position: relative; }
        .ph-mais-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 10px; border-radius: 8px;
          border: none; background: none; cursor: pointer;
          font-weight: 700; font-size: 13.5px; color: var(--muted);
          white-space: nowrap; transition: color .15s;
        }
        .ph-mais-btn:hover, .ph-mais-btn.active { color: var(--blue); }
        .ph-mais-btn.active::after {
          content: '';
          position: absolute; bottom: -2px;
          left: 10px; right: 10px;
          height: 2px; border-radius: 2px;
          background: var(--blue);
        }
        .ph-mais-btn { position: relative; }
        .ph-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: var(--surface); border: 1px solid var(--line);
          border-radius: 16px; box-shadow: 0 12px 40px rgba(0,0,0,.14);
          padding: 6px; min-width: 180px; z-index: 200;
          display: none; flex-direction: column; gap: 2px;
        }
        .ph-dropdown.open { display: flex; }
        .ph-dropdown a {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          color: var(--text); font-weight: 700; font-size: 14px;
          text-decoration: none; transition: background .12s, color .12s;
        }
        .ph-dropdown a:hover, .ph-dropdown a.active {
          background: var(--blueSoft); color: var(--blue);
        }

        .ph-toggle-btn {
          width: 38px; height: 38px; border-radius: 50%;
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
          position: fixed; left: 12px; right: 12px; top: 72px;
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
        .ph-menu-mobile .ph-divider {
          height: 1px; background: var(--line); margin: 4px 0;
        }
        .ph-backdrop {
          display: none; position: fixed; inset: 0;
          z-index: 90; background: rgba(0,0,0,.18);
        }
        .ph-backdrop.open { display: block; }
        @media (max-width: 900px) {
          .ph-nav { display: none; }
          .ph-hamburger { display: flex; }
          .ph-search { display: none; }
          .ph-logo-text { display: none; }
          .ph-logo-icon { width: 36px; height: 36px; border-radius: 11px; }
          .ph-root { padding: 0 14px; gap: 10px; height: 58px; }
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
            placeholder="Buscar caminhões, marca, modelo..."
            aria-label="Buscar"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val) window.location.href = `/anuncios?q=${encodeURIComponent(val)}`;
              }
            }}
          />
          <Search size={16} className="ph-search-icon" aria-hidden="true" />
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
                <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Dropdown Mais */}
          <div className="ph-mais-wrap" ref={maisRef}>
            <button
              className={`ph-mais-btn${maisAtivo ? " active" : ""}`}
              onClick={() => setMaisOpen((v) => !v)}
              aria-expanded={maisOpen}
              aria-haspopup="true"
            >
              Mais
              <ChevronDown size={14} strokeWidth={2.5} style={{ transition: "transform .2s", transform: maisOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>
            <div className={`ph-dropdown${maisOpen ? " open" : ""}`} role="menu">
              {maisItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={active ? "active" : ""}
                    onClick={() => setMaisOpen(false)}
                    role="menuitem"
                  >
                    <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <ThemeTogglePublic />
        </nav>

        <button
          className="ph-hamburger"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Menu Mobile — todos os itens */}
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
        <div className="ph-divider" />
        {maisItems.map((item) => {
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
