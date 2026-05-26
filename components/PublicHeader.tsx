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
          <Link href="/anuncios">Estoque</Link>
          <Link href="/como-funciona">Como funciona</Link>

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
          background: rgba(2,6,23,.84);
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
          gap: 10px;
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
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.10);
          white-space: nowrap;
        }

        .public-nav .public-announce {
          background: #22c55e;
          color: #052e16;
          border-color: transparent;
        }

        .public-nav .public-logout {
          background: rgba(239,68,68,.12);
          color: #fecaca;
          border-color: rgba(239,68,68,.22);
        }

        @media (max-width: 720px) {
          .public-header-inner {
            width: calc(100vw - 24px);
            min-height: auto;
            padding: 10px 0;
          }

          .public-brand img {
            width: 142px;
          }

          .public-nav {
            gap: 7px;
            overflow-x: auto;
            padding-bottom: 2px;
          }

          .public-nav a {
            min-height: 38px;
            padding: 0 10px;
            font-size: 12px;
          }

          .public-nav a:nth-child(2) {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
