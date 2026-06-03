"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, LogIn, Menu, MessageCircle, Search, Store, Truck, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/anuncios", label: "Caminhões", icon: Store },
  { href: "/anuncios?perfil=Implementos", label: "Implementos", icon: Truck },
  { href: "/sobre", label: "Sobre", icon: Info },
  { href: "/login", label: "Entrar", icon: LogIn },
];

function isActive(pathname: string, href: string) {
  const cleanHref = href.split("?")[0].split("#")[0];
  if (cleanHref === "/") return pathname === "/";
  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

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
            <Link href="/anunciar" aria-current={isActive(pathname, "/anunciar") ? "page" : undefined} className={isActive(pathname, "/anunciar") ? "active" : ""} onClick={closeMenu}>
              <MessageCircle size={15} aria-hidden="true" />
              <span>Anunciar</span>
            </Link>
          ) : null}
        </nav>

        <Link href="/anunciar" className="contact-button">
          <MessageCircle size={17} aria-hidden="true" />
          Anunciar
        </Link>

        <button type="button" className="mobile-btn" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {open ? <button type="button" className="menu-backdrop" aria-label="Fechar menu" onClick={closeMenu} /> : null}
    </header>
  );
}
