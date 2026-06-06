"use client";

import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/admin/pendentes", label: "Pendentes" },
  { href: "/admin/anuncios", label: "Todos anúncios" },
  { href: "/admin/lista-transmissao", label: "Lista de transmissão" },
  { href: "/admin/aparencia", label: "Aparência do site" },
  { href: "/painel/anuncios/novo", label: "Criar anúncio" },
  { href: "/painel/anuncios", label: "Painel anunciante" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminMenu() {
  const pathname = usePathname();

  return (
    <nav className="admin-menu" aria-label="Menu administrativo">
      {menuItems.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <a
            key={item.href}
            href={item.href}
            className={active ? "active" : ""}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
