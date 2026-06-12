"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Handshake, LayoutDashboard, LogIn, Search, Truck } from "lucide-react";
import { ThemeTogglePublic } from "./ThemeTogglePublic";

function isActive(pathname: string, href: string) {
  const cleanHref = href.split("?")[0].split("#")[0];
  if (cleanHref === "/") return pathname === "/";
  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}

type PublicHeaderClientProps = {
  isLoggedIn: boolean;
};

export function PublicHeaderClient({ isLoggedIn }: PublicHeaderClientProps) {
  const pathname = usePathname();
  const showTopSearch = pathname !== "/anuncios";

  const navItems = [
    { href: "/anuncios", label: "Caminhões", icon: Truck },
    { href: "/implementos", label: "Implementos", icon: Truck },
    { href: "/parceiros", label: "Parceiros", icon: Handshake },
    isLoggedIn
      ? { href: "/painel", label: "Painel", icon: LayoutDashboard }
      : { href: "/login", label: "Entrar", icon: LogIn },
  ];

  return (
    <>
      <header className="public-header">
        <div className="public-nav-shell">
          <Link href="/" className="public-brand" aria-label="Caminhões à Venda">
            <span className="brand-mark"><Truck size={22} aria-hidden="true" /></span>
            <span className="brand-text">
              <Image src="/logo-horizontal-web.png" alt="Caminhões à Venda" width={230} height={84} priority />
            </span>
          </Link>

          {showTopSearch ? (
            <form className="search-top" action="/anuncios">
              <Search size={17} aria-hidden="true" />
              <input name="busca" type="search" placeholder="Buscar caminhões, implementos, marcas..." />
            </form>
          ) : null}

          <nav className="public-menu" id="menu" aria-label="Menu principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={active ? "active" : ""}>
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
        .public-header {
          background: rgba(255, 255, 255, .94);
          backdrop-filter: blur(16px) saturate(140%);
          -webkit-backdrop-filter: blur(16px) saturate(140%);
          border-bottom: 1px solid rgba(217, 221, 227, .86);
          box-shadow: 0 1px 0 rgba(15, 23, 42, .04), 0 10px 26px rgba(15, 23, 42, .06);
        }

        body.public-theme-dark .public-header {
          background: rgba(16, 25, 43, .92);
          border-bottom-color: rgba(148, 163, 184, .18);
          box-shadow: 0 1px 0 rgba(148, 163, 184, .10), 0 12px 30px rgba(0, 0, 0, .24);
        }

        .public-nav-shell {
          min-height: 76px;
          gap: 12px;
        }

        .public-brand {
          min-width: 178px;
        }

        .brand-mark {
          width: 48px;
          height: 48px;
          box-shadow: 0 10px 22px rgba(24, 119, 242, .24);
        }

        .brand-text img {
          width: 150px;
          height: 36px;
          object-fit: contain;
        }

        .search-top {
          max-width: 520px;
          height: 48px;
          background: #f3f4f6;
          border: 1px solid rgba(217, 221, 227, .72);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, .72);
        }

        body.public-theme-dark .search-top {
          background: rgba(255, 255, 255, .06);
          border-color: rgba(148, 163, 184, .20);
        }

        .search-top input::placeholder {
          color: var(--muted);
        }

        .public-menu {
          gap: 6px;
        }

        .public-menu a {
          min-height: 42px;
          padding: 0 13px;
          border-radius: 999px;
          border: 1px solid transparent;
          color: #30343b;
          background: transparent;
          transition: background .16s ease, border-color .16s ease, color .16s ease, transform .16s ease;
        }

        body.public-theme-dark .public-menu a {
          color: #dbe5f3;
        }

        .public-menu a:hover,
        .public-menu a.active {
          background: rgba(24, 119, 242, .10);
          border-color: rgba(24, 119, 242, .18);
          color: var(--blue);
          transform: translateY(-1px);
        }

        .public-theme-toggle {
          min-height: 44px;
          border-radius: 14px;
          background: var(--soft);
        }

        @media (max-width: 1120px) {
          .public-nav-shell {
            flex-wrap: wrap;
            padding: 10px 0;
          }

          .search-top {
            order: 3;
            width: 100%;
            max-width: none;
            flex-basis: 100%;
          }

          .public-menu {
            margin-left: auto;
            overflow-x: auto;
            scrollbar-width: none;
          }

          .public-menu::-webkit-scrollbar {
            display: none;
          }
        }

        @media (min-width: 681px) and (max-width: 980px) {
          .public-nav-shell > .public-theme-toggle {
            display: inline-flex !important;
          }

          .public-menu {
            position: static !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            width: 100%;
            max-height: none !important;
            overflow-x: auto;
            overflow-y: hidden !important;
            order: 4;
            margin-left: 0;
            padding: 2px 0 0 !important;
            background: transparent !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .public-menu a {
            flex: 0 0 auto;
            min-height: 42px;
            justify-content: center;
          }
        }

        @media (max-width: 680px) {
          .public-brand {
            min-width: auto;
          }

          .brand-text img {
            width: 118px;
            height: 30px;
          }

          .brand-mark {
            width: 42px;
            height: 42px;
          }

          .public-menu {
            width: 100%;
            order: 4;
            justify-content: flex-start;
            padding-bottom: 2px;
          }

          .public-menu a {
            min-height: 38px;
            padding: 0 11px;
            font-size: 12px;
            flex: 0 0 auto;
          }
        }
      `}</style>
    </>
  );
}
