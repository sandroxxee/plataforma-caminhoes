import "./HeroMarketplace.css";
import Link from "next/link";
import { HomeActiveCountBadge } from "@/components/HomeActiveCountBadge";

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
          <div className="hero-badge-row">
            <HomeActiveCountBadge />
          </div>
          <h1 className="hero-title">
            Compre e venda<br />
            caminhões com<br />
            <span className="hero-title-accent">segurança</span>
          </h1>
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
