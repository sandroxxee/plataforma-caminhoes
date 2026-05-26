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
          <span className="brand-logo">
            <Image src="/logo-horizontal.png" alt="Caminhões à Venda" width={220} height={70} priority />
          </span>
          <span className="brand-text">
            <strong>Caminhões à Venda</strong>
            <small>Caminhões reais para negociar</small>
          </span>
        </Link>

        <nav className="public-nav" aria-label="Menu principal">
          <Link href="/" className="nav-link"><span aria-hidden="true">⌂</span>Início</Link>
          <Link href="/anuncios" className="nav-link"><span aria-hidden="true">▦</span>Estoque</Link>
          <Link href="/como-funciona" className="nav-link"><span aria-hidden="true">?</span>Como funciona</Link>
          {isLogged && !isAdmin && <Link href="/painel" className="nav-link"><span aria-hidden="true">□</span>Painel</Link>}
          {isLogged && isAdmin && <Link href="/admin/pendentes" className="nav-link"><span aria-hidden="true">⚙</span>Admin</Link>}
          {!isLogged && <Link href="/login" className="nav-link"><span aria-hidden="true">↗</span>Entrar</Link>}
          {isLogged && <Link href="/logout" className="nav-link logout"><span aria-hidden="true">×</span>Sair</Link>}
        </nav>

        <Link href="/anunciar" className="header-cta">
          <span aria-hidden="true">＋</span> Anunciar
        </Link>
      </div>

      <style>{`
        .public-header {
          position: sticky;
          top: 0;
          z-index: 60;
          padding: 10px 0;
          background: rgba(9, 12, 18, .86);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255, 255, 255, .08);
        }

        .public-header-inner {
          width: min(1240px, calc(100vw - 32px));
          min-height: 72px;
          margin: 0 auto;
          padding: 10px 12px;
          display: grid;
          grid-template-columns: minmax(230px, auto) 1fr auto;
          align-items: center;
          gap: 14px;
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(255,255,255,.095), rgba(255,255,255,.045));
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 18px 50px rgba(0,0,0,.24);
        }

        .public-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
          color: white;
          text-decoration: none;
        }

        .brand-logo {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #f8fafc;
          border: 1px solid rgba(255,255,255,.24);
          box-shadow: inset 0 0 0 1px rgba(15,23,42,.08), 0 10px 24px rgba(0,0,0,.20);
          flex: 0 0 auto;
        }

        .brand-logo img {
          width: 122px;
          height: auto;
          object-fit: contain;
          display: block;
          transform: scale(.9);
        }

        .brand-text {
          display: grid;
          gap: 4px;
          min-width: 0;
        }

        .brand-text strong {
          font-size: 18px;
          line-height: 1;
          letter-spacing: -.035em;
          white-space: nowrap;
        }

        .brand-text small {
          color: #cbd5e1;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .06em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .public-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-width: 0;
        }

        .nav-link {
          min-height: 42px;
          padding: 0 11px;
          border-radius: 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: rgba(248,250,252,.86);
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          white-space: nowrap;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(255,255,255,.06);
        }

        .nav-link span,
        .header-cta span {
          width: 20px;
          height: 20px;
          border-radius: 7px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #e2e8f0;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.10);
          font-size: 12px;
          line-height: 1;
          flex: 0 0 auto;
        }

        .nav-link:hover {
          color: white;
          background: rgba(255,255,255,.08);
          border-color: rgba(255,255,255,.14);
        }

        .nav-link.logout {
          color: #fecaca;
        }

        .nav-link.logout span {
          color: #fecaca;
          background: rgba(239,68,68,.10);
          border-color: rgba(239,68,68,.20);
        }

        .header-cta {
          min-height: 44px;
          padding: 0 16px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #111827;
          background: #f8fafc;
          border: 1px solid rgba(255,255,255,.28);
          text-decoration: none;
          font-size: 14px;
          font-weight: 950;
          white-space: nowrap;
          box-shadow: 0 12px 28px rgba(0,0,0,.24);
        }

        .header-cta span {
          color: #111827;
          background: rgba(17,24,39,.07);
          border-color: rgba(17,24,39,.08);
        }

        @media (max-width: 1060px) {
          .public-header-inner {
            grid-template-columns: 1fr auto;
          }

          .public-nav {
            grid-column: 1 / -1;
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 2px;
            -webkit-overflow-scrolling: touch;
          }

          .public-nav::-webkit-scrollbar {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .public-header {
            padding: 8px 0;
          }

          .public-header-inner {
            width: calc(100vw - 24px);
            min-height: auto;
            padding: 10px;
            gap: 10px;
            border-radius: 17px;
          }

          .brand-logo {
            width: 43px;
            height: 43px;
            border-radius: 13px;
          }

          .brand-logo img {
            width: 108px;
          }

          .brand-text strong {
            font-size: 16px;
          }

          .brand-text small {
            font-size: 10px;
          }

          .header-cta {
            min-height: 40px;
            padding: 0 12px;
            font-size: 13px;
          }

          .nav-link {
            min-height: 38px;
            padding: 0 9px;
            font-size: 12px;
          }

          .nav-link span,
          .header-cta span {
            width: 18px;
            height: 18px;
            font-size: 11px;
          }
        }

        @media (max-width: 420px) {
          .brand-text small {
            display: none;
          }

          .brand-text strong {
            max-width: 142px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .header-cta {
            padding: 0 10px;
          }
        }
      `}</style>
    </header>
  );
}
