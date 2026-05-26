import Image from "next/image";
import Link from "next/link";

const whatsappLink = "https://wa.me/5549999999999?text=Ol%C3%A1%2C%20vim%20pelo%20site%20Caminh%C3%B5es%20%C3%A0%20Venda.";

export function PublicHeader() {
  return (
    <header className="public-header">
      <div className="public-header-shell">
        <Link href="/" className="public-brand" aria-label="Caminhões à Venda">
          <span className="public-brand-logo">
            <Image src="/logo-horizontal.png" alt="Caminhões à Venda" width={190} height={55} priority />
          </span>
          <span className="public-brand-text">
            <strong>Caminhões à Venda</strong>
            <small>Classificados do transporte</small>
          </span>
        </Link>

        <nav className="public-nav" aria-label="Menu principal">
          <Link href="/anuncios">Estoque</Link>
          <Link href="/anunciar">Anunciar</Link>
          <Link href="/#sobre">Sobre</Link>
          <Link href="/#contato">Contato</Link>
        </nav>

        <div className="public-actions">
          <Link href="/anuncios" className="public-fav">♡ Favoritos</Link>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="public-whatsapp">
            Fale no WhatsApp
          </a>
        </div>
      </div>

      <style>{`
        .public-header {
          position: sticky;
          top: 14px;
          z-index: 80;
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 0 0 14px;
        }

        .public-header-shell {
          min-height: 76px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 22px;
          padding: 10px 18px;
          border-radius: 18px;
          background: linear-gradient(180deg, rgba(13,18,20,.90), rgba(7,12,13,.80));
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 18px 58px rgba(0,0,0,.34);
          backdrop-filter: blur(16px);
        }

        .public-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 250px;
          color: white;
          text-decoration: none;
        }

        .public-brand-logo {
          width: 72px;
          height: 72px;
          flex: 0 0 72px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(250,204,21,.42);
          box-shadow: 0 0 0 3px rgba(34,197,94,.10), 0 12px 34px rgba(0,0,0,.34);
        }

        .public-brand-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.12);
        }

        .public-brand-text {
          display: grid;
          line-height: 1.04;
        }

        .public-brand-text strong {
          font-size: 18px;
          font-weight: 950;
          letter-spacing: .02em;
          text-transform: uppercase;
        }

        .public-brand-text small {
          margin-top: 5px;
          color: #22c55e;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .public-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: clamp(12px, 2.4vw, 42px);
          min-width: 0;
        }

        .public-nav a {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          color: rgba(248,250,252,.78);
          font-size: 13px;
          font-weight: 950;
          letter-spacing: .09em;
          text-transform: uppercase;
          white-space: nowrap;
          text-decoration: none;
          transition: color .18s ease;
        }

        .public-nav a::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -2px;
          width: 0;
          height: 2px;
          border-radius: 999px;
          background: #22c55e;
          transform: translateX(-50%);
          transition: width .2s ease;
          box-shadow: 0 0 16px rgba(34,197,94,.64);
        }

        .public-nav a:hover {
          color: #22c55e;
        }

        .public-nav a:hover::after {
          width: 24px;
        }

        .public-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          white-space: nowrap;
        }

        .public-fav {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(248,250,252,.88);
          font-weight: 850;
          font-size: 14px;
          text-decoration: none;
        }

        .public-whatsapp {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 19px;
          border-radius: 7px;
          background: rgba(34,197,94,.08);
          border: 1px solid rgba(34,197,94,.72);
          color: #f8fafc;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .06em;
          text-transform: uppercase;
          text-decoration: none;
          transition: .18s ease;
        }

        .public-whatsapp:hover {
          background: rgba(34,197,94,.18);
          transform: translateY(-1px);
        }

        @media (max-width: 1120px) {
          .public-header-shell {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .public-brand {
            min-width: 0;
          }

          .public-nav {
            justify-content: flex-start;
            overflow-x: auto;
            padding: 2px 0 8px;
          }

          .public-actions {
            justify-content: flex-start;
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .public-header {
            width: calc(100vw - 22px);
            top: 8px;
            padding-bottom: 8px;
          }

          .public-header-shell {
            padding: 10px;
            border-radius: 14px;
          }

          .public-brand-logo {
            width: 54px;
            height: 54px;
            flex-basis: 54px;
          }

          .public-brand-text strong {
            font-size: 15px;
          }

          .public-brand-text small {
            font-size: 11px;
          }

          .public-nav {
            gap: 18px;
          }

          .public-nav a {
            font-size: 12px;
            min-height: 34px;
          }

          .public-fav {
            display: none;
          }

          .public-whatsapp {
            width: 100%;
          }
        }
      `}</style>
    </header>
  );
}
