import "./HeroMarketplace.css";

export function HeroMarketplace() {
  return (
    <div className="hero-wrap">
      <img
        src="/hero-home.jpg"
        alt="Caminhões à Venda"
        className="hero-img"
        fetchPriority="high"
        loading="eager"
      />
      <div className="hero-overlay" />
    </div>
  );
}
