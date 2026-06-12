"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function isActive(pathname: string, href: string) {
  if (href === "/painel/anuncios") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PanelSubnav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="psnav-wrap">
      <div className="psnav-inner">
        <nav className="psnav" aria-label="Navegação do painel">
          <Link href="/painel/anuncios" className={`psnav-link${isActive(pathname, "/painel/anuncios") ? " active" : ""}`}>
            Meus anúncios
          </Link>
          <Link href="/painel/anuncios/novo" className={`psnav-link${isActive(pathname, "/painel/anuncios/novo") ? " active" : ""}`}>
            + Novo anúncio
          </Link>
        </nav>

        <button type="button" onClick={handleLogout} className="psnav-logout">Sair</button>
      </div>

      <style>{`
        .psnav-wrap { border-bottom: 1px solid var(--line); background: var(--surface); }
        .psnav-inner {
          width: min(1280px, calc(100vw - 32px));
          margin: 0 auto; height: 44px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .psnav { display: flex; align-items: center; gap: 2px; }
        .psnav-link {
          display: inline-flex; align-items: center; height: 36px; padding: 0 14px;
          border-radius: 8px; font-size: 13px; font-weight: 800;
          color: var(--muted); text-decoration: none;
          transition: background .14s, color .14s;
        }
        .psnav-link:hover { background: var(--blueSoft); color: var(--blue); }
        .psnav-link.active { background: var(--blueSoft); color: var(--blue); font-weight: 900; }
        .psnav-logout {
          height: 30px; padding: 0 12px; border-radius: 8px;
          border: 1px solid rgba(239,68,68,.3); background: rgba(239,68,68,.07);
          color: #f87171; font-size: 12px; font-weight: 800; cursor: pointer;
          transition: background .14s;
        }
        .psnav-logout:hover { background: rgba(239,68,68,.15); }
      `}</style>
    </div>
  );
}
