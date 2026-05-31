import Link from "next/link";

export function HeroMarketplace() {
  return (
    <section className="market-container market-hero compact-hero">
      <div className="market-hero-copy">
        <span>Anúncios verificados</span>
        <h1>Caminhões à venda com fotos e WhatsApp direto</h1>
        <p>Consulte anúncios reais e negocie direto com o anunciante.</p>

        <div className="market-hero-actions">
          <Link href="/anuncios">Ver caminhões</Link>
          <Link href="/anunciar">Anunciar caminhão</Link>
        </div>
      </div>

      <div className="market-hero-visual clean-hero-card" aria-label="Resumo do marketplace">
        <div className="hero-summary-card">
          <strong>Estoque organizado</strong>
          <span>Fotos centralizadas</span>
          <span>Ficha do caminhão</span>
          <span>Contato pelo WhatsApp</span>
          <Link href="/anuncios">Abrir estoque</Link>
        </div>
      </div>
    </section>
  );
}
