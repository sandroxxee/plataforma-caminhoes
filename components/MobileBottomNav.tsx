"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogIn, Plus, Search, Truck } from "lucide-react";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type Props = { isLoggedIn?: boolean };

export function MobileBottomNav({ isLoggedIn = false }: Props) {
  const pathname = usePathname();

  const items = [
    { href: "/anuncios",    label: "Caminhões",  icon: Truck },
    { href: "/implementos", label: "Implementos", icon: Truck },
    { href: "/anunciar",    label: "Anunciar",    icon: Plus,           featured: true },
    { href: "/anuncios",    label: "Buscar",      icon: Search,         search: true },
    isLoggedIn
      ? { href: "/painel", label: "Painel",  icon: LayoutDashboard }
      : { href: "/login",  label: "Entrar",  icon: LogIn },
  ];

  return (
    <>
      <nav className="mbn" aria-label="Navegação rápida mobile">
        {items.map((item) => {
          const Icon = item.icon;
          const active = !item.search && isActive(pathname, item.href);
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`mbn-item${active ? " active" : ""}${item.featured ? " featured" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className={`mbn-icon${item.featured ? " mbn-icon-featured" : ""}`}>
                <Icon size={item.featured ? 22 : 18} strokeWidth={item.featured ? 2.5 : 2} aria-hidden="true" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        .mbn { display: none; }

        @media (max-width: 768px) {
          .mbn {
            display: flex;
            position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
            background: var(--surface, #fff);
            border-top: 1px solid var(--line);
            padding-bottom: env(safe-area-inset-bottom, 0px);
            height: calc(58px + env(safe-area-inset-bottom, 0px));
            align-items: stretch;
          }
          body.public-theme-dark .mbn { background: #111827; }

          .mbn-item {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 3px;
            color: var(--muted); font-size: 10px; font-weight: 800;
            text-decoration: none; padding: 6px 4px;
            letter-spacing: .01em; transition: color .15s;
            -webkit-tap-highlight-color: transparent;
          }
          .mbn-item.active { color: var(--blue); }
          .mbn-item.featured { color: #22c55e; }

          .mbn-icon { display: flex; align-items: center; justify-content: center; }
          .mbn-icon-featured {
            background: #22c55e; color: #052e16;
            border-radius: 50%; width: 40px; height: 40px;
            box-shadow: 0 4px 14px rgba(34,197,94,.35);
            margin-bottom: 1px;
          }

          body { padding-bottom: calc(58px + env(safe-area-inset-bottom, 0px)); }
        }
      `}</style>
    </>
  );
}
