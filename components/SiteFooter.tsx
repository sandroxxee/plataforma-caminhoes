import Link from "next/link";

export function SiteFooter() {
  const linkStyle = {
    display: "block",
    marginTop: 6,
    color: "var(--muted)",
    fontSize: 14,
    fontWeight: 750,
  } as const;

  return (
    <footer className="site-footer">
      <div
        className="footer-inner"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 1.4fr) repeat(3, minmax(150px, .7fr))",
          gap: 24,
        }}
      >
        <section>
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

        <section>
          <strong>Comprar</strong>
          <Link style={linkStyle} href="/anuncios">Ver anúncios</Link>
          <Link style={linkStyle} href="/anuncios?perfil=Caminhao">Caminhões</Link>
          <Link style={linkStyle} href="/anuncios?perfil=Implementos">Implementos</Link>
        </section>

        <section>
          <strong>Anunciar</strong>
          <Link style={linkStyle} href="/anunciar">Anunciar caminhão</Link>
          <Link style={linkStyle} href="/como-funciona">Como funciona</Link>
          <Link style={linkStyle} href="/cadastro">Criar conta</Link>
        </section>

        <section>
          <strong>Atendimento</strong>
          <a style={linkStyle} href="https://wa.me/5549999362681" target="_blank" rel="noreferrer">
            WhatsApp: 49 99936-2681
          </a>
          <Link style={linkStyle} href="/sobre">Segurança e confiança</Link>
        </section>
      </div>

      <p style={{ marginTop: 24, fontSize: 13 }}>
        © 2026 Caminhões à Venda. Todos os direitos reservados.
      </p>
    </footer>
  );
}
