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
      <div className="public-header-shell">
        <div className="public-header-top">
          <span>Compra • Venda • Troca</span>
          <strong>Negociação direta de caminhões</strong>
        </div>

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
                <Link href="/anunciar" className="public-announce">Anunciar</Link>
              </>
            )}

            {isLogged && !isAdmin && (
              <>
                <Link href="/painel" className="public-announce">Meu painel</Link>
                <Link href="/logout">Sair</Link>
              </>
            )}

            {isLogged && isAdmin && (
              <>
                <Link href="/admin/pendentes" className="public-announce">Admin</Link>
                <Link href="/logout" className="public-logout">Sair</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <style>{`
        .public-header {
          position: sticky;
          top: 0;
          z-index: 60;
          background:
            linear-gradient(180deg, rgba(3,7,18,.96), rgba(3,7,18,.88));
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255,255,255,.10);
          box-shadow: 0 18px 45px rgba(0,0,0,.28);
        }

        .public-header-shell {
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto;
        }

        .public-header-top {
          min-height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 850;
          letter-spacing: .04em;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .public-header-top span {
          color: #facc15;
        }

        .public-header-top strong {
          color: #86efac;
          font-size: 11px;
        }

        .public-header-inner {
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
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
          filter: drop-shadow(0 10px 18px rgba(0,0,0,.35));
        }

        .public-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          min-width: 0;
        }

        .public-nav a {
          min-height: 40px;
          padding: 0 14px;
          border-radius: 999px;
          color: #f8fafc;
          text-decoration: none;
          font-weight: 900;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.04));
          border: 1px solid rgba(255,255,255,.12);
          white-space: nowrap;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
        }

        .public-nav a:hover {
          border-color: rgba(250,204,21,.38);
          background: linear-gradient(180deg, rgba(250,204,21,.14), rgba(255,255,255,.05));
        }

        .public-nav .public-announce {
          background: linear-gradient(135deg, #facc15, #f97316 52%, #ef4444);
          color: #1f1300;
          border-color: rgba(250,204,21,.50);
          box-shadow: 0 12px 28px rgba(249,115,22,.22), inset 0 1px 0 rgba(255,255,255,.25);
        }

        .public-nav .public-logout {
          background: rgba(239,68,68,.12);
          color: #fecaca;
          border-color: rgba(239,68,68,.22);
        }

        @media (max-width: 820px) {
          .public-header-shell {
            width: calc(100vw - 24px);
          }

          .public-header-top {
            display: none;
          }

          .public-header-inner {
            min-height: auto;
            padding: 10px 0;
            gap: 10px;
          }

          .public-brand img {
            width: 132px;
          }

          .public-nav {
            gap: 6px;
            overflow-x: auto;
            padding: 2px 0 4px;
            justify-content: flex-start;
            -webkit-overflow-scrolling: touch;
          }

          .public-nav::-webkit-scrollbar {
            display: none;
          }

          .public-nav a {
            min-height: 36px;
            padding: 0 10px;
            font-size: 12px;
          }

          .public-nav a:nth-child(2) {
            display: none;
          }
        }

        @media (max-width: 420px) {
          .public-brand img {
            width: 118px;
          }

          .public-nav a {
            padding: 0 9px;
          }
        }
      `}</style>
    </header>
  );
}
