import Link from "next/link";

export function HeroMarketplace() {
  return (
    <div className="hero-wrap">
      <img src="/hero-home.jpg?v=2" alt="" className="hero-img" aria-hidden="true" />
      <div className="hero-overlay" />

      <div className="hero-body">
        <p className="hero-eyebrow">🚛 Marketplace de caminhões</p>
        <h1 className="hero-h1">
          Compre e venda caminhões<br />
          <em>com contato direto.</em>
        </h1>
        <p className="hero-desc">
          Anúncios reais, fotos verdadeiras e negociação direto pelo WhatsApp.
        </p>

        <form className="hero-form" action="/anuncios" method="get">
          <input
            name="busca"
            type="search"
            placeholder="Modelo, marca, cidade ou ano…"
            className="hero-input"
            aria-label="Buscar caminhões"
          />
          <button type="submit" className="hero-submit">Buscar</button>
        </form>

        <div className="hero-links">
          <Link href="/anuncios" className="hero-link">Ver todos os anúncios</Link>
          <Link href="/cadastro" className="hero-link">Anunciar meu caminhão</Link>
        </div>
      </div>

      <style>{`
        .hero-wrap {
          position: relative;
          width: 100%;
          border-radius: var(--radius);
          overflow: hidden;
          background: #07111f;
          box-shadow: var(--shadow2);
          min-height: 460px;
        }
        .hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 8s ease;
        }
        .hero-wrap:hover .hero-img { transform: scale(1.04); }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(7,17,31,.1) 0%,
            rgba(7,17,31,.55) 45%,
            rgba(7,17,31,.92) 100%
          );
        }
        .hero-body {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          min-height: 460px;
          padding: clamp(22px, 3vw, 44px);
          gap: 0;
        }
        .hero-eyebrow {
          margin: 0 0 14px;
          display: inline-flex;
          align-items: center;
          width: fit-content;
          height: 28px;
          padding: 0 12px;
          border-radius: 999px;
          background: rgba(24,119,242,.22);
          border: 1px solid rgba(96,165,250,.3);
          color: #93c5fd;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .05em;
          text-transform: uppercase;
        }
        .hero-h1 {
          margin: 0 0 10px;
          font-size: clamp(28px, 4vw, 56px);
          line-height: 1.04;
          letter-spacing: -.05em;
          color: #fff;
          max-width: 760px;
        }
        .hero-h1 em {
          font-style: normal;
          color: #60a5fa;
        }
        .hero-desc {
          margin: 0 0 20px;
          color: rgba(255,255,255,.72);
          font-size: clamp(14px, 1.4vw, 16px);
          font-weight: 700;
          max-width: 520px;
          line-height: 1.5;
        }
        .hero-form {
          display: flex;
          max-width: 540px;
          margin-bottom: 14px;
          border-radius: 14px;
          overflow: hidden;
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.18);
          backdrop-filter: blur(10px);
        }
        .hero-input {
          flex: 1;
          min-width: 0;
          height: 50px;
          background: transparent;
          border: 0;
          outline: 0;
          color: #fff;
          padding: 0 16px;
          font-size: 15px;
          font-weight: 700;
        }
        .hero-input::placeholder { color: rgba(255,255,255,.42); }
        .hero-submit {
          flex-shrink: 0;
          height: 50px;
          padding: 0 22px;
          background: var(--blue);
          color: #fff;
          border: 0;
          font-weight: 950;
          font-size: 14px;
          cursor: pointer;
          transition: background .16s;
          white-space: nowrap;
        }
        .hero-submit:hover { background: var(--blue2); }
        .hero-links {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hero-link {
          display: inline-flex;
          align-items: center;
          height: 38px;
          padding: 0 16px;
          border-radius: 999px;
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.2);
          color: rgba(255,255,255,.9);
          font-size: 13px;
          font-weight: 950;
          transition: background .16s;
        }
        .hero-link:hover {
          background: rgba(255,255,255,.18);
        }
        @media (max-width: 560px) {
          .hero-wrap, .hero-body { min-height: 500px; }
          .hero-form { max-width: 100%; }
          .hero-links { display: grid; grid-template-columns: 1fr 1fr; }
          .hero-link { justify-content: center; font-size: 12px; }
          .hero-submit { padding: 0 14px; font-size: 13px; }
        }
      `}</style>
    </div>
  );
}
