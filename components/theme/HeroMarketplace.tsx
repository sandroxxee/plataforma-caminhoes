import Link from "next/link";

export function HeroMarketplace() {
  return (
    <section className="market-container market-hero compact-hero">
      <div className="market-hero-copy">
        <span>Anúncios verificados</span>
        <h1>Caminhões à venda com fotos e WhatsApp direto</h1>
        <p>Consulte anúncios reais e negocie direto com o anunciante.</p>

        <div className="market-hero-actions">
          <Link href="/anuncios">Ver caminhões</Link>
          <Link href="/anunciar">Anunciar caminhão</Link>
        </div>
      </div>

      <div className="market-hero-visual clean-hero-card" aria-label="Resumo do marketplace">
        <div className="hero-summary-card">
          <strong>Estoque organizado</strong>
          <span>Fotos centralizadas</span>
          <span>Ficha do caminhão</span>
          <span>Contato pelo WhatsApp</span>
          <Link href="/anuncios">Abrir estoque</Link>
        </div>
      </div>

      <style>{`
        .compact-hero {
          grid-template-columns: minmax(0, 1.15fr) minmax(300px, .85fr);
          gap: 14px;
        }

        .compact-hero .market-hero-copy,
        .compact-hero .market-hero-visual {
          min-height: 285px;
        }

        .compact-hero .market-hero-copy {
          padding: 28px;
        }

        .compact-hero .market-hero-copy h1 {
          max-width: 620px;
          font-size: clamp(34px, 3.9vw, 54px);
          line-height: 1;
          letter-spacing: -.055em;
        }

        .compact-hero .market-hero-copy p {
          max-width: 560px;
          font-size: 16px;
        }

        .clean-hero-card {
          display: grid;
          place-items: center;
          align-content: center;
          background: linear-gradient(145deg, #eaf2ff, #ffffff 52%, #f5f6f7);
        }

        .hero-summary-card {
          width: min(360px, 100%);
          display: grid;
          gap: 10px;
          padding: 22px;
          border-radius: 22px;
          background: rgba(255,255,255,.92);
          border: 1px solid #d9dde3;
          box-shadow: 0 18px 40px rgba(15,23,42,.12);
        }

        .hero-summary-card strong {
          font-size: 22px;
          letter-spacing: -.03em;
        }

        .hero-summary-card span {
          min-height: 34px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          border-radius: 12px;
          background: #f5f6f7;
          color: #65676b;
          font-weight: 850;
        }

        .hero-summary-card a {
          min-height: 42px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1877f2;
          color: #fff;
          font-weight: 950;
        }

        @media (max-width: 980px) {
          .compact-hero { grid-template-columns: 1fr; }
          .compact-hero .market-hero-copy,
          .compact-hero .market-hero-visual { min-height: auto; }
        }
      `}</style>
    </section>
  );
}
