import "./HeroMarketplace.css";
import Link from "next/link";

export function HeroMarketplace() {
  return (
    <div className="market-container">
      <div className="hero-wrap">
        <img
          src="/hero-home.jpg"
          alt="Caminhões à Venda"
          className="hero-img"
          fetchPriority="high"
          loading="eager"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-sub">
            Anúncios revisados, contato direto pelo WhatsApp,<br className="hero-br" />
            sem intermediários.
          </p>
          <div className="hero-actions">
            <Link href="/anuncios" className="hero-btn-primary">Ver caminhões</Link>
            <Link href="/anunciar" className="hero-btn-secondary">Anunciar grátis</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
