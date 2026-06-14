"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = { role?: "anunciante" | "admin" };

function isActive(pathname: string, href: string) {
  if (href === "/painel/anuncios" || href === "/admin/anuncios") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const anuncianteLinks = [
  { href: "/painel",              label: "Painel" },
  { href: "/painel/anuncios",     label: "Meus anúncios" },
  { href: "/painel/anuncios/novo",label: "+ Novo" },
];

const adminLinks = [
  { href: "/admin",                    label: "Dashboard" },
  { href: "/admin/pendentes",          label: "Pendentes" },
  { href: "/admin/anuncios",           label: "Anúncios" },
  { href: "/admin/usuarios",           label: "Usuários" },
  { href: "/admin/aparencia",          label: "Aparência" },
  { href: "/admin/divulgacao",         label: "Divulgação" },
  { href: "/admin/ia-anuncios",        label: "IA" },
  { href: "/admin/lista-transmissao",  label: "Lista" },
];

export function PanelSubnav({ role = "anunciante" }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const links    = role === "admin" ? adminLinks : anuncianteLinks;
  const isAdmin  = role === "admin";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className={`psnav-wrap${isAdmin ? " psnav-admin" : ""}`}>
      <div className="psnav-inner">
        <nav className="psnav" aria-label="Navegação do painel">
          {links.map((link) => (
            <Link key={link.href} href={link.href}
              className={`psnav-link${isActive(pathname, link.href) ? " active" : ""}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <button type="button" onClick={handleLogout} className="psnav-logout">Sair</button>
      </div>

      <style>{`
        .psnav-wrap {
          background: #0a0f1a;
          border-bottom: 1px solid rgba(255,255,255,.08);
          position: sticky; top: 0; z-index: 50;
        }
        .psnav-inner {
          width: min(1280px, calc(100vw - 32px));
          margin: 0 auto; min-height: 46px;
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
          display: inline-flex; align-items: center;
          min-height: 44px; padding: 0 12px;
          border-radius: 8px; font-size: 13px; font-weight: 800;
          white-space: nowrap; color: rgba(255,255,255,.5);
          text-decoration: none; flex-shrink: 0;
          transition: background .14s, color .14s;
        }
        .psnav-link:hover  { background: rgba(255,255,255,.07); color: #fff; }
        .psnav-link.active { background: rgba(34,197,94,.15);   color: #86efac; }
        .psnav-admin .psnav-link.active { background: rgba(129,140,248,.15); color: #c7d2fe; }

        .psnav-logout {
          flex-shrink: 0; min-height: 36px; padding: 0 12px; border-radius: 8px;
          border: 1px solid rgba(239,68,68,.3); background: transparent;
          color: #f87171; font-size: 12px; font-weight: 800; cursor: pointer;
          transition: background .14s; white-space: nowrap;
        }
        .psnav-logout:hover { background: rgba(239,68,68,.12); }

        @media (max-width: 560px) {
          .psnav-inner { min-height: 52px; }
          .psnav-link { font-size: 12px; padding: 0 10px; min-height: 40px; }
          .psnav-logout { font-size: 11px; padding: 0 10px; }
        }
      `}</style>
    </div>
  );
}
