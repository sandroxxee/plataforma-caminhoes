import Link from "next/link";

export function HeroMarketplace() {
  return (
    <section className="market-container market-hero compact-hero hero-single">
      <div className="market-hero-copy">
        <span>Anúncios verificados</span>
        <h1>Encontre o caminhão certo para o seu trabalho</h1>
        <p>Consulte anúncios reais e negocie direto com o anunciante.</p>

        <div className="market-hero-actions">
          <Link href="/anuncios">Ver caminhões</Link>
          <Link href="/anunciar">Anunciar caminhão</Link>
        </div>
      </div>

      <style>{`
        .hero-single {
          grid-template-columns: 1fr;
        }

        .hero-single .market-hero-copy {
          min-height: 245px;
          padding: 28px;
        }

        .hero-single .market-hero-copy h1 {
          max-width: 720px;
          font-size: clamp(34px, 3.8vw, 54px);
          line-height: 1;
          letter-spacing: -.055em;
        }

        .hero-single .market-hero-copy p {
          max-width: 560px;
          font-size: 16px;
        }
      `}</style>
    </section>
  );
}
