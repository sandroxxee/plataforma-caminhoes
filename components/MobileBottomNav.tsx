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
    <>
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
      <style>{`
        .mobile-bottom-nav {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 100;
            background: var(--card, #111827);
            border-top: 1px solid var(--line, rgba(255,255,255,.10));
            padding: 0 0 env(safe-area-inset-bottom, 0px);
            height: calc(60px + env(safe-area-inset-bottom, 0px));
            align-items: stretch;
            justify-content: stretch;
          }
          .mobile-bottom-nav-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            color: var(--muted, #94a3b8);
            font-size: 10px;
            font-weight: 800;
            text-decoration: none;
            padding: 6px 4px;
            transition: color .15s;
            letter-spacing: .01em;
          }
          .mobile-bottom-nav-item.active {
            color: var(--blue, #3b82f6);
          }
          .mobile-bottom-nav-item.featured {
            color: #22c55e;
          }
          .mobile-bottom-nav-item.featured .mobile-bottom-nav-icon {
            background: #22c55e;
            color: #052e16;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2px;
            box-shadow: 0 4px 14px rgba(34,197,94,.35);
          }
          .mobile-bottom-nav-icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          /* Espaço para não ficar escondido pelo nav fixo */
          body {
            padding-bottom: calc(60px + env(safe-area-inset-bottom, 0px));
          }
        }
      `}</style>
    </>
  );
}
