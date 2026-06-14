"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, Wrench, LayoutDashboard, LogIn } from "lucide-react";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type Props = { isLoggedIn?: boolean };

export function MobileBottomNav({ isLoggedIn = false }: Props) {
  const pathname = usePathname();

  return (
    <>
      <nav className="mbn" aria-label="Navegação rápida">

        {/* Caminhões */}
        <Link
          href="/anuncios"
          className={`mbn-item${isActive(pathname, "/anuncios") && !isActive(pathname, "/implementos") ? " active" : ""}`}
          aria-label="Caminhões"
        >
          <Truck size={20} strokeWidth={1.8} aria-hidden="true" />
          <span>Caminhões</span>
        </Link>

        {/* Implementos */}
        <Link
          href="/implementos"
          className={`mbn-item${isActive(pathname, "/implementos") ? " active" : ""}`}
          aria-label="Implementos"
        >
          <Wrench size={20} strokeWidth={1.8} aria-hidden="true" />
          <span>Implementos</span>
        </Link>

        {/* Anunciar — destaque central */}
        <Link
          href="/anunciar"
          className={`mbn-item mbn-cta${isActive(pathname, "/anunciar") ? " active" : ""}`}
          aria-label="Anunciar"
        >
          <span className="mbn-cta-inner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Anunciar
          </span>
        </Link>

        {/* Entrar / Painel */}
        {isLoggedIn ? (
          <Link
            href="/painel"
            className={`mbn-item${isActive(pathname, "/painel") ? " active" : ""}`}
            aria-label="Painel"
          >
            <LayoutDashboard size={20} strokeWidth={1.8} aria-hidden="true" />
            <span>Painel</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className={`mbn-item${isActive(pathname, "/login") ? " active" : ""}`}
            aria-label="Entrar"
          >
            <LogIn size={20} strokeWidth={1.8} aria-hidden="true" />
            <span>Entrar</span>
          </Link>
        )}

      </nav>

      <style>{`
        .mbn { display: none; }

        @media (max-width: 768px) {
          .mbn {
            display: grid;
            grid-template-columns: 1fr 1fr auto 1fr;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            z-index: 200;
            background: var(--surface, #fff);
            border-top: 1px solid var(--line);
            padding-bottom: env(safe-area-inset-bottom, 0px);
            height: calc(62px + env(safe-area-inset-bottom, 0px));
            align-items: stretch;
            box-shadow: 0 -4px 24px rgba(0,0,0,.08);
          }
          body.public-theme-dark .mbn {
            background: #0f172a;
            border-top-color: rgba(255,255,255,.07);
            box-shadow: 0 -4px 24px rgba(0,0,0,.4);
          }

          /* Items normais */
          .mbn-item {
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            gap: 4px;
            color: var(--muted);
            font-size: 10px; font-weight: 800;
            text-decoration: none;
            padding: 6px 4px;
            letter-spacing: .01em;
            transition: color .15s;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          .mbn-item.active { color: var(--blue); }
          .mbn-item svg { flex-shrink: 0; }

          /* Botão Anunciar */
          .mbn-cta {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 6px;
          }
          .mbn-cta-inner {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: #22c55e;
            color: #052e16;
            font-size: 12px;
            font-weight: 900;
            padding: 0 14px;
            height: 38px;
            border-radius: 999px;
            white-space: nowrap;
            box-shadow: 0 4px 14px rgba(34,197,94,.35);
            transition: transform .15s, box-shadow .15s;
            letter-spacing: -.01em;
          }
          .mbn-cta:active .mbn-cta-inner {
            transform: scale(.95);
            box-shadow: 0 2px 8px rgba(34,197,94,.25);
          }
          .mbn-cta.active .mbn-cta-inner {
            background: #16a34a;
          }
          body.public-theme-dark .mbn-cta-inner {
            box-shadow: 0 4px 16px rgba(34,197,94,.25);
          }

          /* Espaço para o nav não cobrir conteúdo */
          body {
            padding-bottom: calc(62px + env(safe-area-inset-bottom, 0px));
          }
        }
      `}</style>
    </>
  );
}
