"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Handshake, LayoutDashboard, LogIn, Truck, Wrench, X, Menu } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const searchTarget = pathname.startsWith("/implementos") ? "/implementos" : "/anuncios";

  const navItems = [
    { href: "/anuncios",    label: "Caminhões",  icon: Truck },
    { href: "/implementos", label: "Implementos", icon: Wrench },
    { href: "/parceiros",   label: "Parceiros",   icon: Handshake },
    isLoggedIn
      ? { href: "/painel", label: "Painel",  icon: LayoutDashboard }
      : { href: "/login",  label: "Entrar",  icon: LogIn },
  ];

  return (
    <header className="public-header">
      <div className="public-nav-shell">

        {/* Logo */}
        <Link href="/" className="public-brand" aria-label="Caminhões à Venda">
          <span className="brand-mark">
            <Truck size={20} aria-hidden="true" />
          </span>
          <span className="brand-text">
            <Image
              src="/logo-horizontal-web.png"
              alt="Caminhões à Venda"
              width={230} height={84}
              priority
              style={{ width: 150, height: 36, objectFit: "contain" }}
            />
          </span>
        </Link>

        {/* Search — some no mobile via globals.css */}
        <div className="search-top">
          <SearchBar target={searchTarget} />
        </div>

        {/* Nav desktop — vira dropdown no mobile via globals.css */}
        <nav
          className={`public-menu${menuOpen ? " open" : ""}`}
          aria-label="Menu principal"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={active ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={15} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Backdrop menu mobile */}
        {menuOpen && (
          <div
            className="menu-backdrop open"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <ThemeTogglePublic />

        {/* Botão hamburguer mobile */}
        <button
          className="mobile-btn"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>
    </header>
  );
}
