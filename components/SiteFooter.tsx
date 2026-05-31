import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>Caminhões à Venda</strong>
          <p>Fotos, detalhes e WhatsApp direto.</p>
          <em>Toda realidade um dia foi sonhada.</em>
        </div>

        <nav aria-label="Links do rodapé">
          <Link href="/anuncios">Caminhões</Link>
          <Link href="/anuncios?perfil=Implementos">Implementos</Link>
          <Link href="/anunciar">Anunciar</Link>
          <Link href="/sobre">Sobre</Link>
        </nav>
      </div>
    </footer>
  );
}
