"use client";

import { usePathname } from "next/navigation";
import { 
  Clock, 
  FileText, 
  Megaphone, 
  Handshake, 
  Users, 
  Send, 
  Palette, 
  PlusCircle, 
  LayoutDashboard,
  Terminal
} from "lucide-react";

const menuItems = [
  { href: "/admin/pendentes", label: "Pendentes", icon: Clock },
  { href: "/admin/anuncios", label: "Todos anúncios", icon: FileText },
  { href: "/admin/divulgacao-massa", label: "Divulgação em Massa", icon: Megaphone },
  { href: "/admin/parceiros", label: "Parceiros / Revendas", icon: Handshake },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/lista-transmissao", label: "Lista de transmissão", icon: Send },
  { href: "/admin/aparencia", label: "Aparência do site", icon: Palette },
  { href: "/painel/anuncios/novo", label: "Criar anúncio", icon: PlusCircle },
  { href: "/painel/anuncios", label: "Painel anunciante", icon: LayoutDashboard },
  { href: "/admin/desenvolvedor", label: "Painel Dev", icon: Terminal },
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
        const Icon = item.icon;
        return (
          <a
            key={item.href}
            href={item.href}
            className={active ? "active" : ""}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={16} style={{ marginRight: "10px", flexShrink: 0 }} />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
