import Link from "next/link";

type HeroMarketplaceProps = {
  imageUrl?: string | null;
};

export function HeroMarketplace({ imageUrl }: HeroMarketplaceProps) {
  const heroBackground = imageUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(7, 17, 31, .08), rgba(7, 17, 31, .34)), url(${imageUrl})`,
      }
    : undefined;

  return (
    <section className="market-container hero-glass" aria-label="Caminhões à Venda">
      <div className="hero-image-stage" style={heroBackground} aria-hidden="true" />

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
          border: 1px solid rgba(255, 255, 255, .22);
          background: #07111f;
          box-shadow: var(--shadow);
        }

        .hero-image-stage {
          width: 100%;
          min-height: 330px;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(180deg, rgba(7, 17, 31, .10), rgba(7, 17, 31, .36)),
            radial-gradient(circle at 50% 78%, rgba(255, 255, 255, .10), transparent 38%),
            #07111f;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
        }

        .hero-image-stage::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgba(7, 17, 31, .34), rgba(7, 17, 31, .06) 42%, rgba(7, 17, 31, .30)),
            linear-gradient(180deg, rgba(7, 17, 31, .04), rgba(7, 17, 31, .30));
        }

        .hero-glass-menu {
          position: absolute;
          left: 50%;
          bottom: 18px;
          z-index: 2;
          transform: translateX(-50%);
          width: min(900px, calc(100% - 36px));
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, .12);
          border: 1px solid rgba(255, 255, 255, .38);
          box-shadow:
            0 18px 42px rgba(0, 0, 0, .22),
            inset 0 1px 0 rgba(255, 255, 255, .42);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
        }

        .hero-glass-menu a {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          position: relative;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, .18);
          border: 1px solid rgba(255, 255, 255, .42);
          color: #0f172a;
          font-size: 13px;
          font-weight: 900;
          white-space: nowrap;
          text-shadow: 0 1px 0 rgba(255, 255, 255, .48);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, .46),
            0 8px 18px rgba(0, 0, 0, .10);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
        }

        .hero-glass-menu a:before {
          content: "";
          position: absolute;
          inset: 1px 1px auto 1px;
          height: 45%;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(255, 255, 255, .46), rgba(255, 255, 255, 0));
          pointer-events: none;
        }

        .hero-glass-menu a:hover {
          background: rgba(255, 255, 255, .30);
          transform: translateY(-1px);
        }

        .hero-glass-menu .hero-glass-cta {
          background: rgba(24, 119, 242, .72);
          border-color: rgba(147, 197, 253, .72);
          color: #fff;
          text-shadow: none;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, .32),
            0 10px 22px rgba(24, 119, 242, .24);
        }

        .hero-glass-menu .hero-glass-cta:hover {
          background: rgba(24, 119, 242, .88);
        }

        @media (max-width: 760px) {
          .hero-image-stage {
            min-height: 300px;
            background-position: center center;
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
          .hero-image-stage {
            min-height: 260px;
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
