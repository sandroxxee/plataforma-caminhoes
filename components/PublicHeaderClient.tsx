"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, LayoutDashboard, LogIn, Menu, MessageCircle, Search, Store, Truck, X } from "lucide-react";
import { useState } from "react";
import { ThemeTogglePublic } from "./ThemeTogglePublic";

const baseNavItems = [
  { href: "/anuncios", label: "Caminhões", icon: Store },
  { href: "/anuncios?perfil=Implementos", label: "Implementos", icon: Truck },
  { href: "/sobre", label: "Sobre", icon: Info },
];

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

  const accountItem = isLoggedIn
    ? { href: "/painel", label: "Meu painel", icon: LayoutDashboard }
    : { href: "/login", label: "Entrar", icon: LogIn };

  const mainButton = isLoggedIn
    ? { href: "/painel", label: "Meu painel", icon: LayoutDashboard }
    : { href: "/anunciar", label: "Anunciar", icon: MessageCircle };

  const navItems = [...baseNavItems, accountItem];
  const MainButtonIcon = mainButton.icon;

  return (
    <header className="public-header">
      <div className="public-nav-shell">
        <Link href="/" className="public-brand" aria-label="Caminhões à Venda" onClick={closeMenu}>
          <span className="brand-mark"><Truck size={22} aria-hidden="true" /></span>
          <span className="brand-text">
            <Image src="/logo-horizontal-web.png" alt="Caminhões à Venda" width={230} height={84} priority />
          </span>
        </Link>

        <form className="search-top" action="/anuncios">
          <Search size={17} aria-hidden="true" />
          <input name="busca" type="search" placeholder="Buscar caminhões, implementos, marcas e cidades" />
        </form>

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

          {open ? (
            <>
              <Link href={mainButton.href} aria-current={isActive(pathname, mainButton.href) ? "page" : undefined} className={isActive(pathname, mainButton.href) ? "active" : ""} onClick={closeMenu}>
                <MainButtonIcon size={15} aria-hidden="true" />
                <span>{mainButton.label}</span>
              </Link>
              <ThemeTogglePublic />
            </>
          ) : null}
        </nav>

        <ThemeTogglePublic />

        <Link href={mainButton.href} className="contact-button">
          <MainButtonIcon size={17} aria-hidden="true" />
          {mainButton.label}
        </Link>

        <button type="button" className="mobile-btn" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {open ? <button type="button" className="menu-backdrop" aria-label="Fechar menu" onClick={closeMenu} /> : null}
    </header>
  );
}
