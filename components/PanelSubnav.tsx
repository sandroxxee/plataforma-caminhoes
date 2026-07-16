"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FileText, Plus, ClipboardList, Users, Palette, Megaphone, Radio, LogOut, Heart, User } from "lucide-react";

type Props = { role?: "anunciante" | "admin" };

function isActive(pathname: string, href: string) {
  if (href === "/painel/anuncios" || href === "/admin/anuncios") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const anuncianteLinks = [
  { href: "/painel/anuncios",      label: "Meus anúncios", icon: FileText },
  { href: "/painel/anuncios/novo", label: "Novo anúncio",   icon: Plus },
  { href: "/painel/favoritos",     label: "Favoritos",     icon: Heart },
  { href: "/conta",                label: "Minha conta",   icon: User },
];

const adminLinks = [
  { href: "/admin/pendentes",         label: "Pendentes",  icon: ClipboardList },
  { href: "/admin/anuncios",          label: "Anúncios",   icon: FileText },
  { href: "/admin/usuarios",          label: "Usuários",   icon: Users },
  { href: "/admin/aparencia",         label: "Aparência",  icon: Palette },
  { href: "/admin/divulgacao",        label: "Divulgação", icon: Megaphone },
  { href: "/admin/lista-transmissao", label: "Lista",      icon: Radio },
];

export function PanelSubnav({ role = "anunciante" }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const links    = role === "admin" ? adminLinks : anuncianteLinks;
  const isAdmin  = role === "admin";
  const accentBg = "var(--blueSoft)";
  const accentTxt = "var(--blue)";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="psnav-wrap">
      <div className="psnav-inner">
        <nav className="psnav" aria-label="Navegação do painel">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`psnav-link${active ? " active" : ""}`}
                style={active ? { background: accentBg, color: accentTxt } : undefined}
              >
                <Icon size={14} strokeWidth={active ? 2.8 : 2} aria-hidden="true" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <button type="button" onClick={handleLogout} className="psnav-logout">
          <LogOut size={13} strokeWidth={2} aria-hidden="true" />
          <span>Sair</span>
        </button>
      </div>

      <style>{`
        .psnav-wrap {
          background: var(--surface);
          border-bottom: 1px solid var(--line);
          position: sticky; top: 0; z-index: 50;
        }
        .psnav-inner {
          width: min(1600px, calc(100vw - 32px));
          margin: 0 auto; min-height: 44px;
          display: flex; align-items: stretch;
          justify-content: space-between; gap: 8px;
        }
        .psnav {
          display: flex; align-items: stretch; gap: 0;
          overflow-x: auto; -webkit-overflow-scrolling: touch;
          scrollbar-width: none; flex: 1; min-width: 0;
        }
        .psnav::-webkit-scrollbar { display: none; }
        .psnav-link {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0 14px;
          border-bottom: 2.5px solid transparent;
          font-size: 13px; font-weight: 800;
          white-space: nowrap; color: var(--muted);
          text-decoration: none; flex-shrink: 0;
          transition: color .14s, border-color .14s;
          position: relative;
        }
        .psnav-link:hover { color: var(--text); }
        .psnav-link.active {
          color: var(--blue);
          border-bottom-color: var(--blue);
          font-weight: 900;
        }
        .psnav-logout {
          flex-shrink: 0; align-self: center;
          display: inline-flex; align-items: center; gap: 5px;
          height: 30px; padding: 0 10px; border-radius: 8px;
          border: 1px solid var(--line); background: transparent;
          color: var(--muted); font-size: 11.5px; font-weight: 800;
          cursor: pointer; transition: background .14s, color .14s; white-space: nowrap;
          margin: 0 0 0 4px;
        }
        .psnav-logout:hover { background: rgba(239,68,68,.08); color: #ef4444; border-color: rgba(239,68,68,.3); }
        @media (max-width: 640px) {
          .psnav-link { padding: 0 10px; font-size: 12px; gap: 5px; }
        }
        @media (max-width: 460px) {
          .psnav-link span { display: none; }
          .psnav-link { padding: 0 12px; }
          .psnav-logout span { display: none; }
          .psnav-logout { padding: 0 10px; }
        }
      `}</style>
    </div>
  );
}
