"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, FileText, Plus, ClipboardList, Users, Palette, Megaphone, Bot, Radio, LogOut } from "lucide-react";

type Props = { role?: "anunciante" | "admin" };

function isActive(pathname: string, href: string) {
  if (href === "/painel/anuncios" || href === "/admin/anuncios") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const anuncianteLinks = [
  { href: "/painel",               label: "Painel",       icon: LayoutDashboard },
  { href: "/painel/anuncios",      label: "Meus anúncios", icon: FileText },
  { href: "/painel/anuncios/novo", label: "Novo",          icon: Plus },
];

const adminLinks = [
  { href: "/admin",                   label: "Dashboard", icon: LayoutDashboard },
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
  const accent   = isAdmin ? "#818cf8" : "#22c55e";
  const accentBg = isAdmin ? "rgba(129,140,248,.15)" : "rgba(34,197,94,.15)";
  const accentTxt= isAdmin ? "#c7d2fe" : "#86efac";

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
                <Icon size={13} strokeWidth={2} aria-hidden="true" />
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
          background: rgba(10,15,26,.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,.07);
          position: sticky; top: 0; z-index: 50;
        }
        .psnav-inner {
          width: min(1600px, calc(100vw - 32px));
          margin: 0 auto; min-height: 48px;
          display: flex; align-items: center;
          justify-content: space-between; gap: 8px;
        }
        .psnav {
          display: flex; align-items: center; gap: 2px;
          overflow-x: auto; -webkit-overflow-scrolling: touch;
          scrollbar-width: none; flex: 1; min-width: 0;
        }
        .psnav::-webkit-scrollbar { display: none; }
        .psnav-link {
          display: inline-flex; align-items: center; gap: 6px;
          min-height: 36px; padding: 0 11px;
          border-radius: 10px; font-size: 12.5px; font-weight: 800;
          white-space: nowrap; color: rgba(255,255,255,.45);
          text-decoration: none; flex-shrink: 0;
          transition: background .14s, color .14s;
        }
        .psnav-link:hover { background: rgba(255,255,255,.07); color: rgba(255,255,255,.9); }
        .psnav-logout {
          flex-shrink: 0;
          display: inline-flex; align-items: center; gap: 5px;
          min-height: 32px; padding: 0 12px; border-radius: 8px;
          border: 1px solid rgba(239,68,68,.3); background: transparent;
          color: #f87171; font-size: 12px; font-weight: 800;
          cursor: pointer; transition: background .14s; white-space: nowrap;
        }
        .psnav-logout:hover { background: rgba(239,68,68,.12); }
        @media (max-width: 560px) {
          .psnav-link span { display: none; }
          .psnav-link { padding: 0 10px; min-height: 40px; }
          .psnav-logout span { display: none; }
          .psnav-logout { padding: 0 10px; }
        }
      `}</style>
    </div>
  );
}
