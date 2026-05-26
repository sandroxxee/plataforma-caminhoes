"use client";

import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/painel", icon: "▣", label: "Resumo", helper: "Visão geral" },
  { href: "/painel/anuncios", icon: "▤", label: "Meus anúncios", helper: "Editar e acompanhar" },
  { href: "/painel/anuncios/novo", icon: "+", label: "Novo anúncio", helper: "Cadastrar caminhão" },
];

function isActive(pathname: string, href: string) {
  if (href === "/painel") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PanelMenu() {
  const pathname = usePathname();

  return (
    <nav className="panel-menu" aria-label="Menu do painel">
      {menuItems.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <a
            key={item.href}
            href={item.href}
            className={`panel-menu-link${active ? " active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="panel-menu-icon">{item.icon}</span>
            <span>
              <strong>{item.label}</strong>
              <small>{item.helper}</small>
            </span>
          </a>
        );
      })}
    </nav>
  );
}
