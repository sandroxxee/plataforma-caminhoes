export function HeroMarketplace() {
  return (
    <section className="market-container hero-clean" aria-label="Caminhões à Venda">
      <div className="hero-image" aria-hidden="true" />

      <style>{`
        .hero-clean {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius);
          background: #07111f;
          box-shadow: var(--shadow);
        }

        .hero-image {
          width: 100%;
          min-height: 330px;
          background-image: url("/hero-caminhoes-a-venda.webp?v=3");
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          background-color: #07111f;
        }

        @media (max-width: 760px) {
          .hero-image {
            min-height: 300px;
          }
        }

        @media (max-width: 560px) {
          .hero-image {
            min-height: 260px;
          }
        }
      `}</style>
    </section>
  );
}
