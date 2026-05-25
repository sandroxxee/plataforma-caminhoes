import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function PublicHeader() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    role = profile?.role || "anunciante";
  }

  const isLogged = Boolean(user);
  const isAdmin = role === "admin";

  return (
    <header className="public-header">
      <div className="public-header-inner">
        <Link href="/" className="public-brand" aria-label="Caminhões em Oferta">
          <Image src="/logo-horizontal.png" alt="Caminhões em Oferta" width={190} height={55} priority />
        </Link>

        <nav className="public-nav" aria-label="Menu principal">
          <Link href="/">Início</Link>

          <div className="menu-group">
            <Link href="/anuncios">Estoque</Link>
            <div className="submenu">
              <Link href="/anuncios?tracao=6x4">Traçados 6x4</Link>
              <Link href="/anuncios?tracao=8x4">Pesados 8x4</Link>
              <Link href="/anuncios?marca=Scania">Scania</Link>
              <Link href="/anuncios?marca=Volvo">Volvo</Link>
            </div>
          </div>

          <div className="menu-group">
            <Link href="/como-funciona">Como funciona</Link>
            <div className="submenu">
              <Link href="/como-funciona">Comprar caminhão</Link>
              <Link href="/anunciar">Anunciar caminhão</Link>
              <Link href="/anuncios">Consultar estoque</Link>
            </div>
          </div>

          {!isLogged && (
            <>
              <Link href="/login">Entrar</Link>
              <Link href="/anunciar" className="public-announce">＋ Anunciar</Link>
            </>
          )}

          {isLogged && !isAdmin && (
            <>
              <Link href="/painel" className="public-announce">Meu painel</Link>
              <Link href="/logout">Sair</Link>
            </>
          )}

          {isLogged && isAdmin && (
            <Link href="/logout" className="public-logout">Sair</Link>
          )}
        </nav>
      </div>

      <style>{`
        .public-header {
          position: sticky;
          top: 0;
          z-index: 60;
          background: rgba(2,6,23,.80);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .public-header-inner {
          width: min(1240px, calc(100vw - 32px));
          min-height: 76px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .public-brand {
          display: inline-flex;
          align-items: center;
          color: white;
          text-decoration: none;
          min-width: 0;
        }

        .public-brand img {
          width: 190px;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .public-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .public-nav a {
          min-height: 42px;
          padding: 0 14px;
          border-radius: 14px;
          color: white;
          text-decoration: none;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,.055);
          border: 1px solid rgba(255,255,255,.10);
          white-space: nowrap;
          transition: background .2s ease, border-color .2s ease, transform .2s ease;
        }

        .public-nav a:hover {
          background: rgba(255,255,255,.10);
          border-color: rgba(34,197,94,.28);
          transform: translateY(-1px);
        }

        .menu-group {
          position: relative;
          display: inline-flex;
        }

        .menu-group > a::after {
          content: "▾";
          margin-left: 7px;
          font-size: 11px;
          color: #86efac;
        }

        .submenu {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          min-width: 220px;
          padding: 8px;
          border-radius: 18px;
          background: rgba(2,6,23,.96);
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 24px 70px rgba(0,0,0,.36);
          display: grid;
          gap: 6px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-6px);
          transition: opacity .18s ease, transform .18s ease, visibility .18s ease;
        }

        .submenu a {
          min-height: 40px;
          justify-content: flex-start;
          background: transparent;
          border-color: transparent;
          color: #dbeafe;
          font-size: 14px;
        }

        .submenu a:hover {
          background: rgba(34,197,94,.12);
          border-color: rgba(34,197,94,.20);
          color: #bbf7d0;
          transform: none;
        }

        .menu-group:hover .submenu,
        .menu-group:focus-within .submenu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .public-nav .public-announce {
          background: #22c55e;
          color: #052e16;
          border-color: transparent;
          box-shadow: 0 10px 28px rgba(34,197,94,.18);
        }

        .public-nav .public-logout {
          background: rgba(239,68,68,.12);
          color: #fecaca;
          border-color: rgba(239,68,68,.22);
        }

        @media (max-width: 880px) {
          .public-header-inner {
            width: calc(100vw - 24px);
            min-height: auto;
            padding: 10px 0;
            align-items: flex-start;
            flex-direction: column;
          }

          .public-brand img {
            width: 150px;
          }

          .public-nav {
            width: 100%;
            gap: 7px;
            overflow-x: auto;
            padding-bottom: 2px;
            -webkit-overflow-scrolling: touch;
          }

          .public-nav a {
            min-height: 38px;
            padding: 0 10px;
            font-size: 12px;
          }

          .menu-group {
            position: static;
          }

          .submenu {
            display: none;
          }

          .menu-group > a::after {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
