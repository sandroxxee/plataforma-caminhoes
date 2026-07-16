"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, User, Plus } from "lucide-react";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type Props = { isLoggedIn?: boolean };

export function MobileBottomNav({ isLoggedIn = false }: Props) {
  const pathname = usePathname();

  // Verifica se alguma das rotas de categoria/busca está ativa para pintar o botão de Buscar de azul
  const isSearchActive =
    isActive(pathname, "/caminhoes") ||
    isActive(pathname, "/carretas") ||
    isActive(pathname, "/implementos") ||
    isActive(pathname, "/maquinas") ||
    isActive(pathname, "/pecas");

  return (
    <>
      <nav className="mbn" aria-label="Navegação rápida">

        {/* Início */}
        <Link
          href="/"
          className={`mbn-item${isActive(pathname, "/") && pathname === "/" ? " active" : ""}`}
          aria-label="Início"
        >
          <Home size={20} strokeWidth={1.8} aria-hidden="true" />
          <span>Início</span>
        </Link>

        {/* Buscar */}
        <Link
          href="/caminhoes"
          className={`mbn-item${isSearchActive ? " active" : ""}`}
          aria-label="Buscar"
        >
          <Search size={20} strokeWidth={1.8} aria-hidden="true" />
          <span>Buscar</span>
        </Link>

        {/* Anunciar — destaque central */}
        <Link
          href={isLoggedIn ? "/painel/anuncios/novo" : "/login?next=/painel/anuncios/novo"}
          className={`mbn-item mbn-cta${isActive(pathname, "/painel/anuncios/novo") || isActive(pathname, "/anunciar") ? " active" : ""}`}
          aria-label="Anunciar"
        >
          <span className="mbn-cta-inner">
            <Plus size={16} strokeWidth={2.8} aria-hidden="true" style={{ marginRight: 2 }} />
            <span>Anunciar</span>
          </span>
        </Link>

        {/* Favoritos */}
        <Link
          href="/painel/favoritos"
          className={`mbn-item${isActive(pathname, "/painel/favoritos") ? " active" : ""}`}
          aria-label="Favoritos"
        >
          <Heart size={20} strokeWidth={1.8} aria-hidden="true" />
          <span>Favoritos</span>
        </Link>

        {/* Minha Conta / Entrar */}
        <Link
          href={isLoggedIn ? "/painel" : "/login"}
          className={`mbn-item${(isActive(pathname, "/painel") && !isActive(pathname, "/painel/favoritos")) || isActive(pathname, "/login") ? " active" : ""}`}
          aria-label={isLoggedIn ? "Painel" : "Entrar"}
        >
          <User size={20} strokeWidth={1.8} aria-hidden="true" />
          <span>{isLoggedIn ? "Painel" : "Entrar"}</span>
        </Link>

      </nav>

      <style>{`
        .mbn { display: none; }

        @media (max-width: 768px) {
          .mbn {
            display: grid;
            grid-template-columns: 1fr 1fr auto 1fr 1fr;
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
            padding: 0 4px;
          }
          .mbn-cta-inner {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 3px;
            background: #22c55e;
            color: #052e16;
            font-size: 11px;
            font-weight: 900;
            padding: 0 10px;
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
