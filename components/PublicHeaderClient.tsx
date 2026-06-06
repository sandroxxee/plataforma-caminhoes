"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Handshake, LayoutDashboard, LogIn, Megaphone, Menu, MessageCircle, Search, Truck, X } from "lucide-react";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);
  const showTopSearch = pathname !== "/anuncios";

  const navItems = [
    { href: "/anuncios", label: "Caminhões", icon: Truck },
    { href: "/implementos", label: "Implementos", icon: Truck },
    { href: "/parceiros", label: "Parceiros", icon: Handshake },
    { href: "/como-funciona", label: "Como funciona", icon: Search },
    isLoggedIn
      ? { href: "/painel", label: "Painel", icon: LayoutDashboard }
      : { href: "/login", label: "Entrar", icon: LogIn },
  ];

  const mobileQuickActions = [
    { href: "/anunciar", label: "Anunciar", icon: Megaphone, highlight: "primary" },
    { href: "https://wa.me/5549999362681", label: "WhatsApp", icon: MessageCircle, highlight: "whatsapp" },
  ];

  return (
    <header className="public-header">
      <div className="public-nav-shell">
        <Link href="/" className="public-brand" aria-label="Caminhões à Venda" onClick={closeMenu}>
          <span className="brand-mark"><Truck size={22} aria-hidden="true" /></span>
          <span className="brand-text">
            <Image src="/logo-horizontal-web.png" alt="Caminhões à Venda" width={230} height={84} priority />
          </span>
        </Link>

        {showTopSearch ? (
          <form className="search-top" action="/anuncios">
            <Search size={17} aria-hidden="true" />
            <input name="busca" type="search" placeholder="Buscar caminhões, implementos, marcas e cidades" />
          </form>
        ) : null}

        <nav className={`public-menu ${open ? "open" : ""}`} id="menu" aria-label="Menu principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={active ? "active" : ""} onClick={closeMenu}>
                <Icon size={15} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {open
            ? mobileQuickActions.map((item) => {
                const Icon = item.icon;
                const isWhatsapp = item.highlight === "whatsapp";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    style={{
                      minHeight: 56,
                      justifyContent: "center",
                      background: isWhatsapp ? "var(--wa)" : "var(--blue)",
                      color: isWhatsapp ? "#073b1d" : "#fff",
                      boxShadow: isWhatsapp ? "none" : "0 7px 16px rgba(24, 119, 242, .22)",
                    }}
                  >
                    <Icon size={17} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })
            : null}

          {open ? <ThemeTogglePublic /> : null}
        </nav>

        <ThemeTogglePublic />

        <button type="button" className="mobile-btn" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {open ? <button type="button" className="menu-backdrop" aria-label="Fechar menu" onClick={closeMenu} /> : null}
    </header>
  );
}
