"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, Megaphone, MessageCircle, PanelTop, Truck } from "lucide-react";

function isActive(pathname: string, href: string) {
  if (href.startsWith("http")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/anuncios", label: "Caminhões", icon: Truck },
    { href: "/implementos", label: "Implementos", icon: Truck },
    { href: "/anunciar", label: "Anunciar", icon: Megaphone, featured: true },
    { href: "/login", label: "Entrar", icon: LogIn },
    { href: "https://wa.me/5549999362681", label: "WhatsApp", icon: MessageCircle, whatsapp: true },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Navegação rápida mobile">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-bottom-nav-item${active ? " active" : ""}${item.featured ? " featured" : ""}${item.whatsapp ? " whatsapp" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="mobile-bottom-nav-icon">
              <Icon size={item.featured ? 22 : 18} aria-hidden="true" />
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
