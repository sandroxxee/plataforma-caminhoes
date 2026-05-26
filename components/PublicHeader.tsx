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
            <Image src="/logo-horizontal.png" alt="Caminhões à Venda" width={190} height={55} priority />
          </span>
          <span className="brand-text">
            <strong>Caminhões à Venda</strong>
            <small>Compra • Venda • Troca</small>
          </span>
        </Link>

        <nav className="public-nav" aria-label="Menu principal">
          <Link href="/" className="nav-link"><span>⌂</span>Início</Link>
          <Link href="/anuncios" className="nav-link"><span>▦</span>Estoque</Link>
          <Link href="/anunciar" className="nav-link"><span>＋</span>Anunciar</Link>
          <Link href="/como-funciona" className="nav-link"><span>?</span>Como funciona</Link>

          {isLogged && !isAdmin && <Link href="/painel" className="nav-link"><span>□</span>Painel</Link>}
          {isLogged && isAdmin && <Link href="/admin/pendentes" className="nav-link"><span>⚙</span>Admin</Link>}
          {!isLogged && <Link href="/login" className="nav-link"><span>↗</span>Entrar</Link>}
          {isLogged && <Link href="/logout" className="nav-link logout"><span>×</span>Sair</Link>}
        </nav>

        <Link href="/anunciar" className="whatsapp-link">
          <span>●</span> WhatsApp
        </Link>
      </div>

      <style>{`
        .public-header {
          position: sticky;
          top: 0;
          z-index: 60;
          padding: 10px 0;
          background: rgba(2, 6, 23, .88);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255, 255, 255, .09);
        }

        .public-header-inner {
          width: min(1240px, calc(100vw - 32px));
          min-height: 72px;
          margin: 0 auto;
          padding: 10px 14px;
          display: grid;
          grid-template-columns: minmax(210px, auto) 1fr auto;
          align-items: center;
          gap: 16px;
          border-radius: 18px;
          background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.045));
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 16px 48px rgba(0,0,0,.26);
        }

        .public-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          color: white;
          text-decoration: none;
        }

        .brand-logo {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: rgba(34,197,94,.10);
          border: 1px solid rgba(34,197,94,.28);
          flex: 0 0 auto;
        }

        .brand-logo img {
          width: 118px;
          height: auto;
          object-fit: contain;
          display: block;
          transform: scale(.92);
        }

        .brand-text {
          display: grid;
          gap: 3px;
          min-width: 0;
        }

        .brand-text strong {
          font-size: 18px;
          line-height: 1;
          letter-spacing: -.035em;
          white-space: nowrap;
        }

        .brand-text small {
          color: #86efac;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .08em;
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
          color: rgba(255,255,255,.86);
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          white-space: nowrap;
          background: transparent;
          border: 1px solid transparent;
        }

        .nav-link span {
          width: 20px;
          height: 20px;
          border-radius: 7px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #22c55e;
          background: rgba(34,197,94,.10);
          border: 1px solid rgba(34,197,94,.18);
          font-size: 12px;
          line-height: 1;
          flex: 0 0 auto;
        }

        .nav-link:hover {
          color: white;
          background: rgba(255,255,255,.07);
          border-color: rgba(255,255,255,.10);
        }

        .nav-link.logout {
          color: #fecaca;
        }

        .nav-link.logout span {
          color: #fecaca;
          background: rgba(239,68,68,.10);
          border-color: rgba(239,68,68,.20);
        }

        .whatsapp-link {
          min-height: 44px;
          padding: 0 16px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #052e16;
          background: #22c55e;
          text-decoration: none;
          font-size: 14px;
          font-weight: 950;
          white-space: nowrap;
          box-shadow: 0 12px 28px rgba(34,197,94,.22);
        }

        .whatsapp-link span {
          color: #052e16;
          font-size: 12px;
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
            border-radius: 16px;
          }

          .brand-logo {
            width: 42px;
            height: 42px;
            border-radius: 12px;
          }

          .brand-logo img {
            width: 104px;
          }

          .brand-text strong {
            font-size: 16px;
          }

          .brand-text small {
            font-size: 10px;
          }

          .whatsapp-link {
            min-height: 40px;
            padding: 0 12px;
            font-size: 13px;
          }

          .nav-link {
            min-height: 38px;
            padding: 0 9px;
            font-size: 12px;
          }

          .nav-link span {
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
            max-width: 138px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .whatsapp-link {
            padding: 0 10px;
          }
        }
      `}</style>
    </header>
  );
}
