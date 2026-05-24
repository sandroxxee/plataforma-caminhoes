import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>Caminhões em Oferta</strong>
          <p>Plataforma de anúncios de caminhões. Compra, venda e troca com contato direto pelo WhatsApp.</p>
        </div>

        <nav aria-label="Links do rodapé">
          <Link href="/anuncios">Estoque</Link>
          <Link href="/como-funciona">Como funciona</Link>
          <Link href="/anunciar">Anunciar</Link>
          <Link href="/login">Entrar</Link>
        </nav>

        <div className="security-note">
          <strong>Aviso de segurança</strong>
          <span>
            Confira documentos, procedência, estado do caminhão e dados do vendedor antes de fechar negócio.
            A negociação é feita diretamente entre comprador e anunciante.
          </span>
        </div>
      </div>

      <style>{`
        .site-footer {
          width: min(1240px, calc(100vw - 32px));
          margin: 36px auto 0;
          padding: 28px 0 42px;
          border-top: 1px solid rgba(255,255,255,.10);
          color: #94a3b8;
        }

        .footer-inner {
          display: grid;
          grid-template-columns: 1.1fr .8fr 1.2fr;
          gap: 22px;
          align-items: start;
        }

        .site-footer strong {
          color: white;
          display: block;
          margin-bottom: 8px;
          font-size: 16px;
        }

        .site-footer p,
        .security-note span {
          margin: 0;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.55;
        }

        .site-footer nav {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .site-footer nav a {
          color: #cbd5e1;
          text-decoration: none;
          font-weight: 900;
          padding: 8px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.08);
        }

        .security-note {
          padding: 16px;
          border-radius: 20px;
          background: rgba(34,197,94,.08);
          border: 1px solid rgba(34,197,94,.20);
        }

        .security-note strong {
          color: #86efac;
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
