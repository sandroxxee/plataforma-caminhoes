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
    { href: "/como-funciona", label: "Como funciona", icon: Search },
    isLoggedIn
      ? { href: "/painel", label: "Painel", icon: LayoutDashboard }
      : { href: "/login", label: "Entrar", icon: LogIn },
  ];

  return (
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
            <input name="busca" type="search" placeholder="Buscar caminhões, implementos, marcas e cidades" />
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
  );
}
