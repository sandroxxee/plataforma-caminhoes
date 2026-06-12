import Link from "next/link";
import "./HeroMarketplace.css";

export function HeroMarketplace() {
  return (
    <div className="hero-wrap">
      <img src="/hero-home.jpg?v=2" alt="" className="hero-img" aria-hidden="true" />
      <div className="hero-overlay" />

      <div className="hero-body">
        <p className="hero-eyebrow">&#x1F69B; Marketplace de caminh&otilde;es</p>
        <h1 className="hero-h1">
          Compre e venda caminh&otilde;es<br />
          <em>com contato direto.</em>
        </h1>
        <p className="hero-desc">
          An&uacute;ncios reais, fotos verdadeiras e negocia&ccedil;&atilde;o direto pelo WhatsApp.
        </p>

        <form className="hero-form" action="/anuncios" method="get">
          <input
            name="busca"
            type="search"
            placeholder="Modelo, marca, cidade ou ano..."
            className="hero-input"
            aria-label="Buscar caminh&otilde;es"
          />
          <button type="submit" className="hero-submit">Buscar</button>
        </form>

        <div className="hero-links">
          <Link href="/anuncios" className="hero-link">Ver todos os an&uacute;ncios</Link>
          <Link href="/cadastro" className="hero-link">Anunciar meu caminh&atilde;o</Link>
        </div>
      </div>
    </div>
  );
}
