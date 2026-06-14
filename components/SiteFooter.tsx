import Link from "next/link";

export function SiteFooter() {
  const linkStyle = {
    display: "block",
    marginTop: 6,
    color: "var(--muted)",
    fontSize: 14,
    fontWeight: 750,
    maxWidth: "100%",
    overflowWrap: "anywhere" as const,
    wordBreak: "break-word" as const,
    textDecoration: "none",
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Sobre */}
        <section className="footer-section footer-about">
          <strong className="footer-brand">Caminhões à Venda</strong>
          <p>Plataforma para comprar e anunciar caminhões, carretas e implementos com contato direto pelo WhatsApp.</p>
          <p style={{ marginTop: 8, fontSize: 12 }}>
            A negociação, vistoria, pagamento e transferência são responsabilidade do comprador e do vendedor.
          </p>
        </section>

        {/* Categorias */}
        <section className="footer-section">
          <strong>Categorias</strong>
          <Link style={linkStyle} href="/anuncios">Caminhões à venda</Link>
          <Link style={linkStyle} href="/carretas">Carretas à venda</Link>
          <Link style={linkStyle} href="/implementos">Implementos à venda</Link>
          <Link style={linkStyle} href="/pecas">Peças para caminhão</Link>
          <Link style={linkStyle} href="/maquinas">Máquinas pesadas</Link>
        </section>

        {/* Marcas */}
        <section className="footer-section">
          <strong>Marcas</strong>
          <Link style={linkStyle} href="/anuncios?marca=Scania">Scania à venda</Link>
          <Link style={linkStyle} href="/anuncios?marca=Volvo">Volvo à venda</Link>
          <Link style={linkStyle} href="/anuncios?marca=Mercedes-Benz">Mercedes-Benz à venda</Link>
          <Link style={linkStyle} href="/anuncios?marca=Volkswagen">Volkswagen à venda</Link>
          <Link style={linkStyle} href="/anuncios?marca=Iveco">Iveco à venda</Link>
          <Link style={linkStyle} href="/anuncios?marca=MAN">MAN à venda</Link>
          <Link style={linkStyle} href="/anuncios?marca=DAF">DAF à venda</Link>
          <Link style={linkStyle} href="/anuncios?marca=Ford">Ford à venda</Link>
        </section>

        {/* Anunciar */}
        <section className="footer-section">
          <strong>Anunciar</strong>
          <Link style={linkStyle} href="/anunciar">Anunciar caminhão</Link>
          <Link style={linkStyle} href="/como-funciona">Como funciona</Link>
          <Link style={linkStyle} href="/cadastro">Criar conta grátis</Link>
          <Link style={linkStyle} href="/painel">Painel do anunciante</Link>
        </section>

        {/* Atendimento */}
        <section className="footer-section">
          <strong>Atendimento</strong>
          <a style={linkStyle} href="https://wa.me/5549999362681" target="_blank" rel="noreferrer">
            WhatsApp suporte
          </a>
          <Link style={linkStyle} href="/parceiros">Parceiros</Link>
          <Link style={linkStyle} href="/sobre">Segurança e confiança</Link>
          <Link style={linkStyle} href="/privacidade">Privacidade</Link>
          <Link style={linkStyle} href="/termos">Termos de uso</Link>
        </section>

      </div>

      <p className="footer-copy">
        © 2026 Caminhões à Venda. Todos os direitos reservados.
      </p>

      <style>{`
        .site-footer {
          background: var(--surface);
          border-top: 1px solid var(--line);
          padding: 48px 0 28px;
          overflow-x: hidden;
        }
        .footer-inner {
          width: min(1280px, calc(100vw - 32px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr repeat(4, 1fr);
          gap: 32px;
          align-items: start;
        }
        .footer-brand {
          display: block;
          font-size: 16px;
          font-weight: 950;
          letter-spacing: -.03em;
          margin-bottom: 10px;
          color: var(--text);
        }
        .footer-about p {
          margin: 0;
          font-size: 13px;
          color: var(--muted);
          font-weight: 700;
          line-height: 1.55;
        }
        .footer-section strong {
          display: block;
          font-size: 13px;
          font-weight: 950;
          color: var(--text);
          letter-spacing: .02em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .footer-section a:hover { color: var(--blue) !important; }
        .footer-copy {
          width: min(1280px, calc(100vw - 32px));
          margin: 32px auto 0;
          font-size: 12px;
          color: var(--muted);
          font-weight: 700;
          border-top: 1px solid var(--line);
          padding-top: 20px;
        }
        @media (max-width: 900px) {
          .footer-inner {
            grid-template-columns: repeat(2, 1fr);
          }
          .footer-about { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer-inner { grid-template-columns: 1fr 1fr; gap: 20px; }
          .site-footer { padding: 32px 0 80px; }
        }
      `}</style>
    </footer>
  );
}
