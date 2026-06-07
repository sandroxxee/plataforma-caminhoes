import Link from "next/link";

export function HeroMarketplace() {
  return (
    <section className="market-container hero-clean" aria-label="Caminhões à Venda">
      <img
        src="/hero-caminhoes-a-venda.svg?v=5"
        alt="Caminhões à Venda"
        className="hero-clean-img"
      />

      <nav className="hero-clean-menu" aria-label="Menu rápido">
        <Link href="/anuncios">Caminhões</Link>
        <Link href="/implementos">Implementos</Link>
        <Link href="/parceiros">Parceiros</Link>
        <Link href="/como-funciona">Como funciona</Link>
        <Link className="hero-clean-cta" href="/anuncios">Ver anúncios</Link>
      </nav>

      <style>{`
        .hero-clean {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius);
          border: 1px solid var(--line);
          background: var(--surface);
          box-shadow: var(--shadow);
        }

        .hero-clean-img {
          display: block;
          width: 100%;
          height: auto;
          aspect-ratio: 16 / 8;
          object-fit: cover;
          object-position: center center;
        }

        .hero-clean-menu {
          position: absolute;
          left: 50%;
          bottom: 18px;
          z-index: 2;
          transform: translateX(-50%);
          width: min(980px, calc(100% - 32px));
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px;
          border-radius: 999px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, .55);
          box-shadow: none;
          backdrop-filter: none;
        }

        .hero-clean-menu a {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, .18);
          border: 1px solid rgba(255, 255, 255, .45);
          color: #0f172a;
          font-size: 13px;
          font-weight: 950;
          white-space: nowrap;
          text-shadow: 0 1px 0 rgba(255, 255, 255, .45);
        }

        .hero-clean-menu a:hover {
          background: rgba(255, 255, 255, .36);
        }

        .hero-clean-menu .hero-clean-cta {
          background: rgba(24, 119, 242, .92);
          border-color: rgba(24, 119, 242, .92);
          color: #fff;
          text-shadow: none;
        }

        @media (max-width: 760px) {
          .hero-clean-img {
            aspect-ratio: 16 / 9;
          }

          .hero-clean-menu {
            bottom: 10px;
            width: calc(100% - 20px);
            justify-content: flex-start;
            overflow-x: auto;
            scrollbar-width: none;
            border-radius: 18px;
          }

          .hero-clean-menu::-webkit-scrollbar {
            display: none;
          }

          .hero-clean-menu a {
            flex: 0 0 auto;
          }
        }

        @media (max-width: 560px) {
          .hero-clean-img {
            aspect-ratio: 16 / 10;
          }

          .hero-clean-menu a {
            min-height: 38px;
            padding: 0 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </section>
  );
}
