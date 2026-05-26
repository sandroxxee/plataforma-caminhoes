import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>Caminhões à Venda</strong>
          <p>Classificados de caminhões usados para compra e venda com contato direto pelo WhatsApp.</p>
        </div>

        <nav aria-label="Links do rodapé">
          <Link href="/anuncios">Comprar</Link>
          <Link href="/anunciar">Vender</Link>
          <Link href="/anuncios">Anúncios</Link>
          <Link href="/login">Entrar</Link>
        </nav>

        <div className="security-note">
          <strong>Aviso</strong>
          <span>
            Confira documentos, procedência, estado do caminhão e dados do vendedor antes de fechar negócio.
          </span>
        </div>
      </div>

      <style>{`
        .site-footer {
          width: min(1180px, calc(100vw - 32px));
          margin: 36px auto 0;
          padding: 28px 0 42px;
          border-top: 1px solid #e2e6ec;
          color: #69717d;
        }

        .footer-inner {
          display: grid;
          grid-template-columns: 1.1fr .8fr 1.2fr;
          gap: 22px;
          align-items: start;
        }

        .site-footer strong {
          color: #20252c;
          display: block;
          margin-bottom: 8px;
          font-size: 16px;
        }

        .site-footer p,
        .security-note span {
          margin: 0;
          color: #69717d;
          font-size: 14px;
          line-height: 1.55;
        }

        .site-footer nav {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .site-footer nav a {
          color: #20252c;
          text-decoration: none;
          font-weight: 900;
          padding: 8px 10px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid #e2e6ec;
        }

        .security-note {
          padding: 16px;
          border-radius: 20px;
          background: #ffffff;
          border: 1px solid #e2e6ec;
        }

        @media (max-width: 800px) {
          .site-footer {
            width: calc(100vw - 24px);
          }

          .footer-inner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
