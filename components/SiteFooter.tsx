import Link from "next/link";

export function SiteFooter() {
  const linkStyle = {
    display: "block",
    marginTop: 6,
    color: "var(--muted)",
    fontSize: 14,
    fontWeight: 750,
    overflowWrap: "anywhere",
  } as const;

  const sectionStyle = {
    minWidth: 0,
  } as const;

  return (
    <footer className="site-footer">
      <div
        className="footer-inner"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
          gap: 20,
          alignItems: "start",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <section style={sectionStyle}>
          <strong>Caminhões à Venda</strong>
          <p>
            Plataforma para comprar e anunciar caminhões, carretas e implementos
            com mais clareza, praticidade e contato direto pelo WhatsApp.
          </p>
          <p style={{ marginTop: 10 }}>
            O Caminhões à Venda divulga anúncios e presta apoio na análise de
            informações. A negociação, vistoria, pagamento, documentação,
            financiamento e transferência são responsabilidade do comprador e do
            proprietário/vendedor do veículo.
          </p>
        </section>

        <section style={sectionStyle}>
          <strong>Comprar</strong>
          <Link style={linkStyle} href="/anuncios">Ver anúncios</Link>
          <Link style={linkStyle} href="/anuncios?perfil=Caminhao">Caminhões</Link>
          <Link style={linkStyle} href="/anuncios?perfil=Implementos">Implementos</Link>
        </section>

        <section style={sectionStyle}>
          <strong>Anunciar</strong>
          <Link style={linkStyle} href="/anunciar">Anunciar caminhão</Link>
          <Link style={linkStyle} href="/como-funciona">Como funciona</Link>
          <Link style={linkStyle} href="/cadastro">Criar conta</Link>
        </section>

        <section style={sectionStyle}>
          <strong>Atendimento</strong>
          <a style={linkStyle} href="https://wa.me/5549999362681" target="_blank" rel="noreferrer">
            WhatsApp: 49 99936-2681
          </a>
          <Link style={linkStyle} href="/sobre">Segurança e confiança</Link>
        </section>
      </div>

      <p style={{ marginTop: 24, fontSize: 13, overflowWrap: "anywhere" }}>
        © 2026 Caminhões à Venda. Todos os direitos reservados.
      </p>
    </footer>
  );
}
