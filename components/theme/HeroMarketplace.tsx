import Link from "next/link";
import { SearchMarketplace } from "./SearchMarketplace";

export function HeroMarketplace() {
  return (
    <section className="market-container market-hero">
      <div className="market-hero-copy">
        <span>Anúncios verificados</span>
        <h1>Caminhões à venda com fotos, detalhes e contato rápido</h1>
        <p>Veja anúncios com informações claras, mais fotos, localização e negociação direta pelo WhatsApp.</p>
        <div className="market-hero-actions">
          <Link href="/anuncios">Ver caminhões</Link>
          <Link href="/anunciar">Anunciar</Link>
        </div>
      </div>

      <div className="market-hero-visual" aria-label="Visual marketplace de caminhões">
        <div className="hero-3d-card hero-3d-main">
          <div className="hero-3d-photo">
            <span className="hero-truck-shape" />
          </div>
          <div className="hero-3d-lines">
            <strong>Estoque atualizado</strong>
            <span />
            <span />
          </div>
        </div>

        <div className="hero-3d-card hero-3d-float hero-3d-float-a">
          <b>Fotos</b>
          <span>Centralizadas</span>
        </div>

        <div className="hero-3d-card hero-3d-float hero-3d-float-b">
          <b>WhatsApp</b>
          <span>Contato direto</span>
        </div>

        <div className="market-hero-panel">
          <strong>Buscar no estoque</strong>
          <p>Encontre por marca, modelo, cidade, ano ou carroceria.</p>
          <SearchMarketplace compact />
        </div>
      </div>
    </section>
  );
}
