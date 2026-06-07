import Link from "next/link";

export function HeroMarketplace() {
  return (
    <section className="market-container hero-glass" aria-label="Caminhões à Venda">
      <div className="hero-image-stage">
        <img
          src="/hero-caminhoes-a-venda.svg?v=6"
          alt="Caminhões à Venda"
          className="hero-glass-img"
        />
      </div>

      <nav className="hero-glass-menu" aria-label="Menu rápido">
        <Link href="/anuncios">Caminhões</Link>
        <Link href="/implementos">Implementos</Link>
        <Link href="/parceiros">Parceiros</Link>
        <Link href="/como-funciona">Como funciona</Link>
        <Link className="hero-glass-cta" href="/anuncios">Ver anúncios</Link>
      </nav>

      <style>{`
        .hero-glass {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius);
          border: 1px solid var(--line);
          background: var(--surface);
          box-shadow: var(--shadow);
        }

        .hero-image-stage {
          width: 100%;
          min-height: 330px;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(135deg, rgba(24,119,242,.08), rgba(255,255,255,.02)),
            var(--soft);
        }

        .hero-glass-img {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 330px;
          aspect-ratio: 16 / 8;
          object-fit: cover;
          object-position: center center;
        }

        .hero-glass-menu {
          position: absolute;
          left: 50%;
          bottom: 18px;
          z-index: 2;
          transform: translateX(-50%);
          width: min(980px, calc(100% - 32px));
          min-height: 62px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px;
          border-radius: 999px;
          background: rgba(255, 255, 255, .08);
          border: 1px solid rgba(255, 255, 255, .34);
          box-shadow: 0 18px 44px rgba(15, 23, 42, .14), inset 0 1px 0 rgba(255, 255, 255, .38);
          backdrop-filter: blur(18px) saturate(145%);
          -webkit-backdrop-filter: blur(18px) saturate(145%);
        }

        .hero-glass-menu a {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 15px;
          position: relative;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, .16);
          border: 1px solid rgba(255, 255, 255, .42);
          color: #0f172a;
          font-size: 13px;
          font-weight: 950;
          white-space: nowrap;
          text-shadow: 0 1px 0 rgba(255, 255, 255, .55);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, .42), 0 8px 18px rgba(15, 23, 42, .08);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
        }

        .hero-glass-menu a:before {
          content: "";
          position: absolute;
          inset: 1px 1px auto 1px;
          height: 48%;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(255,255,255,.44), rgba(255,255,255,0));
          pointer-events: none;
        }

        .hero-glass-menu a:hover {
          background: rgba(255, 255, 255, .28);
          transform: translateY(-1px);
        }

        .hero-glass-menu .hero-glass-cta {
          background: rgba(24, 119, 242, .72);
          border-color: rgba(147, 197, 253, .70);
          color: #fff;
          text-shadow: none;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, .32), 0 10px 22px rgba(24, 119, 242, .22);
        }

        .hero-glass-menu .hero-glass-cta:hover {
          background: rgba(24, 119, 242, .86);
        }

        @media (max-width: 760px) {
          .hero-image-stage,
          .hero-glass-img {
            min-height: 300px;
          }

          .hero-glass-img {
            aspect-ratio: 16 / 9;
          }

          .hero-glass-menu {
            bottom: 10px;
            width: calc(100% - 20px);
            justify-content: flex-start;
            overflow-x: auto;
            scrollbar-width: none;
            border-radius: 22px;
          }

          .hero-glass-menu::-webkit-scrollbar {
            display: none;
          }

          .hero-glass-menu a {
            flex: 0 0 auto;
          }
        }

        @media (max-width: 560px) {
          .hero-image-stage,
          .hero-glass-img {
            min-height: 260px;
          }

          .hero-glass-img {
            aspect-ratio: 16 / 10;
          }

          .hero-glass-menu a {
            min-height: 38px;
            padding: 0 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </section>
  );
}
