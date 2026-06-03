import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>Caminhões à Venda</strong>
          <p>
            Plataforma para comprar e anunciar caminhões, carretas e implementos com
            mais clareza, praticidade e contato direto pelo WhatsApp.
          </p>
          <em>
            O Caminhões à Venda divulga anúncios e presta apoio na análise de
            informações. A negociação, vistoria, pagamento, documentação,
            financiamento e transferência são responsabilidade do comprador e do
            proprietário/vendedor do veículo.
          </em>
        </div>

        <nav aria-label="Links do rodapé">
          <Link href="/anuncios">Ver anúncios</Link>
          <Link href="/anuncios?perfil=Caminhao">Caminhões</Link>
          <Link href="/anuncios?perfil=Implementos">Implementos</Link>
          <Link href="/anunciar">Anunciar</Link>
          <Link href="/como-funciona">Como funciona</Link>
          <Link href="/sobre">Segurança</Link>
          <a href="https://wa.me/5549999362681" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </nav>
      </div>
    </footer>
  );
}
