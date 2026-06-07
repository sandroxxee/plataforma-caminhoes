export function HeroMarketplace() {
  return (
    <section className="market-container market-hero compact-hero hero-single">
      <div className="market-hero-copy">
        <span>Caminhões e implementos</span>
        <h1>Anúncios de caminhões com contato direto.</h1>
        <p>Veja anúncios aprovados, compare opções e fale com o anunciante pelo WhatsApp.</p>
      </div>

      <style>{`
        .hero-single {
          grid-template-columns: 1fr;
        }

        .hero-single .market-hero-copy {
          min-height: 210px;
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

        @media (max-width: 560px) {
          .hero-single .market-hero-copy {
            min-height: auto;
            padding: 14px;
          }

          .hero-single .market-hero-copy span {
            font-size: 10px;
            padding: 6px 9px;
          }

          .hero-single .market-hero-copy h1 {
            max-width: 320px;
            margin: 10px 0 6px;
            font-size: 25px;
            line-height: 1.04;
            letter-spacing: -.04em;
          }

          .hero-single .market-hero-copy p {
            max-width: 320px;
            font-size: 13px;
            line-height: 1.38;
          }
        }
      `}</style>
    </section>
  );
}
