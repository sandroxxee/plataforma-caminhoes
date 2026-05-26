import Image from "next/image";
import Link from "next/link";

const whatsappLink = "https://wa.me/5549999999999?text=Ol%C3%A1%2C%20vim%20pelo%20site%20Caminh%C3%B5es%20%C3%A0%20Venda.";

export function PublicHeader() {
  return (
    <header className="public-header">
      <div className="public-header-inner">
        <Link href="/" className="public-brand" aria-label="Caminhões à Venda">
          <Image src="/logo-horizontal.png" alt="Caminhões à Venda" width={190} height={55} priority />
        </Link>

        <nav className="public-nav" aria-label="Menu principal">
          <Link href="/anuncios">Comprar</Link>
          <Link href="/anunciar">Vender</Link>
          <Link href="/anuncios">Anúncios</Link>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="public-whatsapp">
            WhatsApp
          </a>
        </nav>
      </div>

      <style>{`
        .public-header {
          position: sticky;
          top: 0;
          z-index: 60;
          background: rgba(255,255,255,.96);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #e5e7eb;
        }

        .public-header-inner {
          width: min(1180px, calc(100vw - 32px));
          min-height: 74px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
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
        }

        .public-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .public-nav a {
          min-height: 40px;
          padding: 0 13px;
          border-radius: 999px;
          color: #20252c;
          text-decoration: none;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f4f5f7;
          border: 1px solid #e2e6ec;
          white-space: nowrap;
          font-size: 14px;
        }

        .public-nav .public-whatsapp {
          background: #1faa59;
          color: white;
          border-color: transparent;
        }

        @media (max-width: 720px) {
          .public-header-inner {
            width: calc(100vw - 22px);
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
            overflow-x: auto;
            padding-bottom: 2px;
          }

          .public-nav a {
            min-height: 36px;
            padding: 0 11px;
            font-size: 12px;
          }
        }
      `}</style>
    </header>
  );
}
