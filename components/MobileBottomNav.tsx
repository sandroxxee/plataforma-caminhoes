"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, Plus, Search, Truck } from "lucide-react";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/anuncios", label: "Caminhões", icon: Truck },
    { href: "/implementos", label: "Implementos", icon: Truck },
    { href: "/anunciar", label: "Anunciar", icon: Plus, featured: true },
    { href: "/anuncios", label: "Buscar", icon: Search },
    { href: "/login", label: "Entrar", icon: LogIn },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Navegação rápida mobile">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href) && item.label !== "Buscar";

        return (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            className={`mobile-bottom-nav-item${active ? " active" : ""}${item.featured ? " featured" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="mobile-bottom-nav-icon">
              <Icon size={item.featured ? 34 : 18} strokeWidth={item.featured ? 3 : 2} aria-hidden="true" />
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
