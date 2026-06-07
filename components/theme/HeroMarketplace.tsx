import Link from "next/link";

export function HeroMarketplace() {
  return (
    <section className="market-container market-hero compact-hero hero-single hero-with-bottom-panel">
      <div className="market-hero-copy">
        <span>Caminhões e implementos</span>
        <h1>Caminhões à Venda</h1>
        <p>A plataforma de venda de pesados do Brasil.</p>
      </div>

      <div className="hero-bottom-panel" aria-label="Atalhos principais">
        <div className="hero-panel-search">
          <strong>Buscar caminhões, implementos, marcas...</strong>
          <small>Encontre anúncios aprovados com contato direto</small>
        </div>

        <nav className="hero-panel-links" aria-label="Menu rápido">
          <Link href="/anuncios">Caminhões</Link>
          <Link href="/implementos">Implementos</Link>
          <Link href="/parceiros">Parceiros</Link>
          <Link href="/como-funciona">Como funciona</Link>
        </nav>

        <Link className="hero-panel-cta" href="/anuncios">
          Ver anúncios
        </Link>
      </div>

      <style>{`
        .hero-with-bottom-panel {
          position: relative;
          grid-template-columns: 1fr;
          margin-bottom: 42px;
          overflow: visible;
        }

        .hero-with-bottom-panel .market-hero-copy {
          min-height: 300px;
          padding: 34px 34px 74px;
          position: relative;
          overflow: hidden;
        }

        .hero-with-bottom-panel .market-hero-copy:before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            linear-gradient(90deg, rgba(255,255,255,.96) 0%, rgba(255,255,255,.84) 42%, rgba(255,255,255,.42) 100%),
            radial-gradient(circle at 86% 30%, rgba(24,119,242,.16), transparent 34%),
            linear-gradient(135deg, rgba(24,119,242,.10), transparent 46%);
        }

        body.public-theme-dark .hero-with-bottom-panel .market-hero-copy:before {
          background:
            linear-gradient(90deg, rgba(17,28,49,.98) 0%, rgba(17,28,49,.86) 46%, rgba(17,28,49,.52) 100%),
            radial-gradient(circle at 86% 30%, rgba(96,165,250,.20), transparent 34%),
            linear-gradient(135deg, rgba(96,165,250,.12), transparent 46%);
        }

        .hero-with-bottom-panel .market-hero-copy > * {
          position: relative;
          z-index: 1;
        }

        .hero-with-bottom-panel .market-hero-copy h1 {
          max-width: 720px;
          margin: 12px 0 8px;
          font-size: clamp(38px, 4.8vw, 66px);
          line-height: .95;
          letter-spacing: -.06em;
          text-transform: uppercase;
        }

        .hero-with-bottom-panel .market-hero-copy p {
          max-width: 560px;
          font-size: clamp(16px, 1.6vw, 22px);
          font-weight: 850;
        }

        .hero-bottom-panel {
          width: min(1080px, calc(100% - 34px));
          min-height: 78px;
          position: absolute;
          left: 50%;
          bottom: -38px;
          z-index: 5;
          transform: translateX(-50%);
          display: grid;
          grid-template-columns: minmax(240px, 1.1fr) auto auto;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border-radius: 24px;
          background: rgba(255, 255, 255, .96);
          border: 1px solid rgba(217, 221, 227, .92);
          box-shadow: 0 18px 42px rgba(15, 23, 42, .16);
          backdrop-filter: blur(14px);
        }

        body.public-theme-dark .hero-bottom-panel {
          background: rgba(17, 28, 49, .94);
          border-color: rgba(148, 163, 184, .22);
          box-shadow: 0 18px 42px rgba(0, 0, 0, .35);
        }

        .hero-panel-search {
          min-height: 52px;
          display: grid;
          align-content: center;
          gap: 2px;
          padding: 0 14px;
          border-right: 1px solid var(--line);
        }

        .hero-panel-search strong {
          font-size: 15px;
          line-height: 1.1;
          letter-spacing: -.02em;
        }

        .hero-panel-search small {
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
        }

        .hero-panel-links {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .hero-panel-links::-webkit-scrollbar {
          display: none;
        }

        .hero-panel-links a {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
          border-radius: 14px;
          color: var(--muted);
          font-size: 13px;
          font-weight: 950;
          white-space: nowrap;
        }

        .hero-panel-links a:hover {
          background: var(--blueSoft);
          color: var(--blue);
        }

        .hero-panel-cta {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border-radius: 16px;
          background: var(--blue);
          color: #fff;
          font-size: 14px;
          font-weight: 950;
          white-space: nowrap;
          box-shadow: 0 10px 20px rgba(24, 119, 242, .24);
        }

        @media (max-width: 900px) {
          .hero-with-bottom-panel {
            margin-bottom: 74px;
          }

          .hero-with-bottom-panel .market-hero-copy {
            min-height: 260px;
            padding: 22px 18px 82px;
          }

          .hero-bottom-panel {
            width: calc(100% - 24px);
            bottom: -62px;
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 12px;
            border-radius: 20px;
          }

          .hero-panel-search {
            min-height: auto;
            padding: 0;
            border-right: 0;
          }

          .hero-panel-links {
            width: 100%;
          }

          .hero-panel-links a {
            background: var(--soft);
            border: 1px solid var(--line);
          }

          .hero-panel-cta {
            width: 100%;
          }
        }

        @media (max-width: 560px) {
          .hero-with-bottom-panel {
            margin-bottom: 86px;
          }

          .hero-with-bottom-panel .market-hero-copy {
            min-height: 240px;
            padding: 18px 14px 96px;
          }

          .hero-with-bottom-panel .market-hero-copy span {
            font-size: 10px;
            padding: 6px 9px;
          }

          .hero-with-bottom-panel .market-hero-copy h1 {
            max-width: 310px;
            margin: 10px 0 6px;
            font-size: 32px;
            line-height: 1;
            letter-spacing: -.045em;
          }

          .hero-with-bottom-panel .market-hero-copy p {
            max-width: 300px;
            font-size: 15px;
            line-height: 1.35;
          }

          .hero-bottom-panel {
            bottom: -72px;
          }
        }
      `}</style>
    </section>
  );
}
