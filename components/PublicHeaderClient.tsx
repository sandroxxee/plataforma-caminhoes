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
      <style>{`
        .ph-root {
          position: sticky; top: 0; z-index: 100;
          height: 64px; width: 100%;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s ease;
        }
        body.public-theme-dark .ph-root {
          background: rgba(13,17,23,0.8);
          border-bottom-color: rgba(255,255,255,0.05);
        }
        .ph-container {
          width: 100%; max-width: 1400px;
          padding: 0 20px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px;
        }
        .ph-logo {
          display: flex; flex-direction: column; line-height: 1;
          text-decoration: none; flex-shrink: 0;
        }
        .ph-logo-top {
          font-weight: 900; font-size: 18px; color: var(--text);
          letter-spacing: -0.04em; text-transform: uppercase; font-style: italic;
        }
        .ph-logo-sub {
          font-weight: 900; font-size: 10px; color: var(--blue);
          letter-spacing: 0.25em; text-transform: uppercase; margin-left: 2px;
        }
        .ph-search-wrap {
          flex: 1; max-width: 440px; position: relative;
        }
        .ph-search-wrap input {
          width: 100%; height: 38px; border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(0,0,0,0.03);
          padding: 0 16px 0 40px;
          font-size: 14px; font-weight: 600;
          color: var(--text); outline: none;
          transition: all 0.2s ease;
        }
        body.public-theme-dark .ph-search-wrap input {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.08);
        }
        .ph-search-wrap input:focus {
          background: var(--surface);
          border-color: var(--blue);
          box-shadow: 0 0 0 4px rgba(24,119,242,0.08);
        }
        .ph-search-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          color: var(--muted); pointer-events: none;
        }
        .ph-nav { display: flex; align-items: center; gap: 4px; }
        .ph-nav-link {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; border-radius: 10px;
          text-decoration: none; font-weight: 700;
          font-size: 14px; color: var(--muted);
          white-space: nowrap; transition: all 0.2s;
        }
        .ph-nav-link:hover { color: var(--text); background: rgba(0,0,0,0.04); }
        body.public-theme-dark .ph-nav-link:hover { background: rgba(255,255,255,0.05); }
        .ph-nav-link.active { color: var(--blue); background: rgba(24,119,242,0.08); }

        .ph-actions { display: flex; align-items: center; gap: 12px; }
        .ph-cta {
          height: 38px; padding: 0 18px; border-radius: 12px;
          background: var(--blue); color: #fff;
          font-size: 12px; font-weight: 900; text-transform: uppercase;
          letter-spacing: 0.05em; text-decoration: none;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(24,119,242,0.25);
          transition: all 0.2s;
        }
        .ph-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(24,119,242,0.35); filter: brightness(1.05); }
        .ph-cta:active { transform: scale(0.96); }

        .ph-hamburger {
          display: none; width: 40px; height: 40px; border-radius: 10px;
          border: 0; background: rgba(0,0,0,0.04); cursor: pointer;
          align-items: center; justify-content: center; color: var(--text);
        }
        body.public-theme-dark .ph-hamburger { background: rgba(255,255,255,0.05); }

        .ph-mobile-menu {
          position: fixed; inset: 0; top: 64px; z-index: 90;
          background: var(--surface); padding: 20px;
          display: flex; flex-direction: column; gap: 8px;
          transform: translateY(-10px); opacity: 0; pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ph-mobile-menu.open { transform: translateY(0); opacity: 1; pointer-events: auto; }
        .ph-mobile-link {
          display: flex; align-items: center; gap: 16px;
          padding: 16px; border-radius: 16px;
          background: rgba(0,0,0,0.02); color: var(--text);
          font-weight: 800; font-size: 16px; text-decoration: none;
        }
        body.public-theme-dark .ph-mobile-link { background: rgba(255,255,255,0.03); }
        .ph-mobile-link.active { background: rgba(24,119,242,0.08); color: var(--blue); }

        @media (max-width: 1200px) {
          .ph-nav { display: none; }
          .ph-hamburger { display: flex; }
        }
        @media (max-width: 800px) {
          .ph-search-wrap { display: none; }
        }
        @media (max-width: 500px) {
          .ph-cta { display: none; }
        }
      `}</style>

      <header className="ph-root">
        <div className="ph-container">
          <Link href="/" className="ph-logo">
            <span className="ph-logo-top">Caminhões</span>
            <span className="ph-logo-sub">à Venda</span>
          </Link>

          <div className="ph-search-wrap">
            <Search size={16} className="ph-search-icon" />
            <input
              type="search"
              placeholder="Buscar marca, modelo ou cidade..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.currentTarget as HTMLInputElement).value.trim();
                  if (val) window.location.href = `/anuncios?q=${encodeURIComponent(val)}`;
                }
              }}
            />
          </div>

          <nav className="ph-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`ph-nav-link ${active ? "active" : ""}`}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ph-actions">
            <ThemeTogglePublic />
            <Link href="/anunciar" className="ph-cta">Anunciar grátis</Link>
            <button className="ph-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`ph-mobile-menu ${menuOpen ? "open" : ""}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`ph-mobile-link ${active ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={20} strokeWidth={2.5} />
              {item.label}
            </Link>
          );
        })}
        <div style={{ marginTop: "auto", paddingBottom: "40px" }}>
          <Link href="/anunciar" className="ph-cta" style={{ height: "56px", fontSize: "16px" }} onClick={() => setMenuOpen(false)}>
            Anunciar grátis agora
          </Link>
        </div>
      </div>
    </>
  );
}
