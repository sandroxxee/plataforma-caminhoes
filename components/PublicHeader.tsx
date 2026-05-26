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
        <Link href="/" className="public-brand" aria-label="Caminhões à Venda">
          <Image src="/logo-horizontal.png" alt="Caminhões à Venda" width={190} height={55} priority />
        </Link>

        <nav className="public-nav" aria-label="Menu principal">
          <Link href="/anuncios" className="active">Comprar</Link>

          <div className="nav-group">
            <Link href="/anunciar">Anunciar</Link>
            <div className="submenu">
              <Link href="/anunciar">Anunciar caminhão</Link>
              <Link href="/como-funciona">Como funciona</Link>
              <Link href="/login">Área do anunciante</Link>
            </div>
          </div>

          <div className="nav-group">
            <Link href="/anuncios">Estoque</Link>
            <div className="submenu">
              <Link href="/anuncios?tracao=6x4">Traçados 6x4</Link>
              <Link href="/anuncios?tracao=8x4">Pesados 8x4</Link>
              <Link href="/anuncios?marca=Scania">Scania</Link>
              <Link href="/anuncios?marca=Volvo">Volvo</Link>
            </div>
          </div>

          <Link href="/como-funciona">Sobre</Link>
          <Link href="/anunciar">Contato</Link>
        </nav>

        <div className="header-actions">
          {isLogged && !isAdmin && <Link href="/painel" className="account-link">Meu painel</Link>}
          {isLogged && isAdmin && <Link href="/admin/pendentes" className="account-link">Admin</Link>}
          {!isLogged && <Link href="/login" className="account-link">Entrar</Link>}
          {isLogged && <Link href="/logout" className="account-link muted">Sair</Link>}
          <Link href="/anunciar" className="whatsapp-link">Fale no WhatsApp</Link>
        </div>
      </div>

      <style>{`
        .public-header {
          position: sticky;
          top: 0;
          z-index: 60;
          padding: 14px 0 0;
          background: linear-gradient(180deg, rgba(2,6,23,.92), rgba(2,6,23,.66));
          backdrop-filter: blur(18px);
        }

        .public-header-inner {
          width: min(1240px, calc(100vw - 32px));
          min-height: 76px;
          margin: 0 auto;
          padding: 0 18px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 22px;
          border-radius: 18px;
          background: rgba(255,255,255,.055);
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 18px 58px rgba(0,0,0,.28);
        }

        .public-brand {
          display: inline-flex;
          align-items: center;
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
          justify-content: center;
          gap: 22px;
          min-width: 0;
        }

        .public-nav a,
        .account-link,
        .whatsapp-link {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,.82);
          text-decoration: none;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: .08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .public-nav > a,
        .nav-group > a {
          position: relative;
          padding: 0 2px;
          background: transparent;
          border: 0;
        }

        .public-nav > a:hover,
        .nav-group > a:hover,
        .public-nav .active {
          color: #22c55e;
        }

        .public-nav .active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -15px;
          height: 2px;
          border-radius: 999px;
          background: #22c55e;
        }

        .nav-group {
          position: relative;
        }

        .submenu {
          position: absolute;
          left: 50%;
          top: calc(100% + 18px);
          min-width: 230px;
          padding: 8px;
          border-radius: 16px;
          background: rgba(2,6,23,.97);
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 24px 70px rgba(0,0,0,.38);
          display: grid;
          gap: 4px;
          opacity: 0;
          visibility: hidden;
          transform: translate(-50%, -6px);
          transition: opacity .18s ease, transform .18s ease, visibility .18s ease;
        }

        .submenu a {
          min-height: 40px;
          justify-content: flex-start;
          padding: 0 12px;
          border-radius: 12px;
          color: #dbeafe;
          font-size: 12px;
          letter-spacing: .04em;
        }

        .submenu a:hover {
          background: rgba(34,197,94,.12);
          color: #bbf7d0;
        }

        .nav-group:hover .submenu,
        .nav-group:focus-within .submenu {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, 0);
        }

        .header-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          min-width: 0;
        }

        .account-link {
          min-height: 44px;
          padding: 0 12px;
          border-radius: 14px;
          background: transparent;
          letter-spacing: .02em;
          text-transform: none;
          font-size: 14px;
          color: #f8fafc;
        }

        .account-link.muted {
          color: #fecaca;
        }

        .whatsapp-link {
          min-height: 44px;
          padding: 0 20px;
          border-radius: 8px;
          color: white;
          border: 1px solid rgba(34,197,94,.70);
          background: rgba(34,197,94,.08);
          letter-spacing: .06em;
        }

        .whatsapp-link::before {
          content: "◉";
          color: #22c55e;
          margin-right: 9px;
          font-size: 14px;
        }

        @media (max-width: 980px) {
          .public-header {
            padding-top: 8px;
          }

          .public-header-inner {
            width: calc(100vw - 24px);
            min-height: auto;
            padding: 12px;
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .public-brand img {
            width: 158px;
          }

          .public-nav,
          .header-actions {
            width: 100%;
            justify-content: flex-start;
            overflow-x: auto;
            gap: 14px;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
          }

          .public-nav::-webkit-scrollbar,
          .header-actions::-webkit-scrollbar {
            display: none;
          }

          .submenu {
            display: none;
          }

          .public-nav .active::after {
            bottom: -6px;
          }
        }
      `}</style>
    </header>
  );
}
