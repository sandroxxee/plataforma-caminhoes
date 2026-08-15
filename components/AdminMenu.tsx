"use client";

import { usePathname } from "next/navigation";
import { 
  Clock, 
  FileText, 
  Megaphone, 
  Handshake, 
  Users, 
  Palette, 
  Terminal,
  Award,
  CreditCard,
  BarChart3,
  Bell,
  Bot,
  ShieldCheck,
  MessageCircle
} from "lucide-react";

const menuItems = [
  { href: "/admin/pendentes", label: "Pendentes", icon: Clock },
  { href: "/admin/anuncios", label: "Todos anúncios", icon: FileText },
  { href: "/admin/seguranca", label: "Segurança & Auditoria", icon: ShieldCheck },
  { href: "/admin/revendas", label: "Revendas & Lojas", icon: Handshake },
  { href: "/admin/planos", label: "Planos", icon: Award },
  { href: "/admin/assinaturas", label: "Assinaturas", icon: CreditCard },
  { href: "/admin/metricas", label: "Métricas & Relatórios", icon: BarChart3 },
  { href: "/admin/notificacoes", label: "Notificações Push", icon: Bell },
  { href: "/admin/atendimento", label: "Central de Atendimento", icon: MessageCircle },
  { href: "/admin/assistente", label: "Assistente IA (Gemini)", icon: Bot },
  { href: "/admin/divulgacao-massa", label: "Divulgação em Massa", icon: Megaphone },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/aparencia", label: "Aparência do site", icon: Palette },
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
