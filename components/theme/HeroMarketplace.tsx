export function HeroMarketplace() {
  return (
    <section className="market-container hero-clean" aria-label="Caminhões à Venda">
      <img
        src="/hero-home.jpg?v=1"
        alt="Caminhões à Venda"
        className="hero-image-real"
      />

      <style>{`
        .hero-clean {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius);
          background: #07111f;
          box-shadow: var(--shadow);
        }

        .hero-image-real {
          display: block;
          width: 100%;
          height: 330px;
          object-fit: cover;
          object-position: center center;
          background: #07111f;
        }

        @media (max-width: 760px) {
          .hero-image-real {
            height: 300px;
          }
        }

        @media (max-width: 560px) {
          .hero-image-real {
            height: 260px;
          }
        }
      `}</style>
    </section>
  );
}
