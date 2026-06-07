export function HeroMarketplace() {
  return (
    <section className="market-container hero-image-only" aria-label="Caminhões à Venda">
      <img
        src="/hero-caminhoes-a-venda.svg?v=4"
        alt="Caminhões à Venda"
        className="hero-image-only-img"
      />

      <style>{`
        .hero-image-only {
          overflow: hidden;
          border-radius: var(--radius);
          border: 1px solid var(--line);
          background: var(--surface);
          box-shadow: var(--shadow);
        }

        .hero-image-only-img {
          display: block;
          width: 100%;
          height: auto;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          object-position: center center;
        }

        @media (max-width: 560px) {
          .hero-image-only-img {
            aspect-ratio: 16 / 10;
          }
        }
      `}</style>
    </section>
  );
}
