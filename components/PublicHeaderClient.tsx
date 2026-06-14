"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Handshake, LayoutDashboard, LogIn, Truck } from "lucide-react";
import { ThemeTogglePublic } from "./ThemeTogglePublic";
import { SearchBar } from "./SearchBar";

function isActive(pathname: string, href: string) {
  const clean = href.split("?")[0].split("#")[0];
  if (clean === "/") return pathname === "/";
  return pathname === clean || pathname.startsWith(`${clean}/`);
}

type Props = { isLoggedIn: boolean };

export function PublicHeaderClient({ isLoggedIn }: Props) {
  const pathname = usePathname();
  const searchTarget = pathname.startsWith("/implementos") ? "/implementos" : "/anuncios";

  const navItems = [
    { href: "/anuncios",    label: "Caminhões",  icon: Truck },
    { href: "/implementos", label: "Implementos", icon: Truck },
    { href: "/parceiros",   label: "Parceiros",   icon: Handshake },
    isLoggedIn
      ? { href: "/painel", label: "Painel",  icon: LayoutDashboard }
      : { href: "/login",  label: "Entrar",  icon: LogIn },
  ];

  return (
    <>
      <header className="public-header">
        <div className="public-nav-shell">
          <Link href="/" className="public-brand" aria-label="Caminhões à Venda">
            <span className="brand-mark">
              <Truck size={20} aria-hidden="true" />
            </span>
            <span className="brand-text">
              <Image src="/logo-horizontal-web.png" alt="Caminhões à Venda"
                width={230} height={84} priority
                style={{ width: 150, height: 36, objectFit: "contain" }}
              />
            </span>
          </Link>

          {/* SearchBar some em mobile — MobileBottomNav tem botão Buscar */}
          <div className="ph-search">
            <SearchBar target={searchTarget} />
          </div>

          <nav className="public-menu" aria-label="Menu principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link key={item.href} href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={active ? "active" : ""}>
                  <Icon size={15} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <ThemeTogglePublic />
        </div>
      </header>

      <style>{`
        /* === BASE === */
        .public-header {
          position: sticky; top: 0; z-index: 80;
          background: rgba(255,255,255,.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--line);
          box-shadow: 0 1px 0 rgba(15,23,42,.04), 0 8px 24px rgba(15,23,42,.05);
        }
        body.public-theme-dark .public-header {
          background: rgba(16,25,43,.95);
          border-bottom-color: rgba(148,163,184,.15);
        }

        .public-nav-shell {
          min-height: 64px;
          display: flex; align-items: center; gap: 10px;
        }

        .public-brand {
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0; text-decoration: none;
        }
        .brand-mark {
          width: 40px; height: 40px; border-radius: 12px;
          display: grid; place-items: center;
          background: var(--blue); color: #fff; flex-shrink: 0;
        }
        .brand-text img { display: block; }

        .ph-search {
          flex: 1; max-width: 460px;
        }
        .search-top {
          height: 44px; border-radius: 999px;
          background: var(--soft); border: 1.5px solid transparent;
          display: flex; align-items: center; gap: 8px; padding: 0 16px;
          color: var(--muted); transition: border-color .16s, background .16s;
        }
        .search-top:focus-within {
          background: #fff; border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(24,119,242,.10);
        }
        body.public-theme-dark .search-top:focus-within { background: var(--surface); }
        .search-top input {
          width: 100%; border: 0; outline: 0; background: transparent;
          color: var(--text); font-weight: 600; font-size: 14px;
        }

        .public-menu {
          display: flex; align-items: center; gap: 2px;
          overflow-x: auto; scrollbar-width: none;
        }
        .public-menu::-webkit-scrollbar { display: none; }
        .public-menu a {
          min-height: 40px; display: inline-flex; align-items: center;
          justify-content: center; gap: 6px; padding: 0 12px;
          border-radius: 10px; color: var(--muted);
          font-weight: 700; font-size: 14px; white-space: nowrap;
          text-decoration: none; flex-shrink: 0;
          transition: background .14s, color .14s;
        }
        body.public-theme-dark .public-menu a { color: #94a3b8; }
        .public-menu a:hover, .public-menu a.active {
          background: var(--blueSoft); color: var(--blue);
        }

        /* === TABLET (ate 900px): search desce, menu continua inline === */
        @media (max-width: 900px) {
          .public-nav-shell { flex-wrap: wrap; padding: 8px 0; min-height: auto; }
          .ph-search { order: 3; max-width: 100%; width: 100%; flex-basis: 100%; }
          .public-menu { margin-left: auto; }
        }

        /* === MOBILE (ate 680px): logo menor, menu scroll horizontal, search oculto === */
        @media (max-width: 680px) {
          .public-nav-shell { gap: 8px; }
          .brand-mark { width: 36px; height: 36px; border-radius: 10px; }
          .brand-text img { width: 120px !important; height: 30px !important; }
          .ph-search { display: none; }
          .public-menu { order: unset; margin-left: 0; flex: 1; justify-content: flex-end; }
          .public-menu a { min-height: 38px; padding: 0 10px; font-size: 13px; }
        }
      `}</style>
    </>
  );
}
