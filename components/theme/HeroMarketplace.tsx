import Link from "next/link";
import { SearchMarketplace } from "./SearchMarketplace";

export function HeroMarketplace() {
  return (
    <section className="market-container hero-clean" aria-label="Caminhões à Venda">

      {/* Foto de fundo */}
      <img
        src="/hero-home.jpg?v=1"
        alt=""
        className="hero-image-real"
        aria-hidden="true"
      />

      {/* Overlay escuro para legibilidade */}
      <div className="hero-overlay" />

      {/* Conteúdo sobre a foto */}
      <div className="hero-content">
        <span className="hero-eyebrow">🚛 Marketplace de caminhões</span>
        <h1 className="hero-title">
          Compre e venda caminhões<br />
          <em>com contato direto.</em>
        </h1>
        <p className="hero-sub">
          Anúncios reais, fotos verdadeiras e negociação direto pelo WhatsApp.
        </p>

        {/* Busca rápida */}
        <div className="hero-search-wrap">
          <SearchMarketplace compact />
        </div>

        {/* CTAs secundários */}
        <div className="hero-actions">
          <Link href="/anuncios" className="hero-btn-ghost">Ver todos os anúncios</Link>
          <Link href="/cadastro" className="hero-btn-ghost">Anunciar meu caminhão</Link>
        </div>
      </div>

      <style>{`
        .hero-clean {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius);
          background: #07111f;
          box-shadow: var(--shadow2);
        }
        .hero-image-real {
          display: block;
          width: 100%;
          height: 480px;
          object-fit: cover;
          object-position: center center;
          background: #07111f;
          transition: transform 8s ease;
        }
        .hero-clean:hover .hero-image-real { transform: scale(1.03); }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(7,17,31,.22) 0%,
            rgba(7,17,31,.62) 55%,
            rgba(7,17,31,.88) 100%
          );
        }
        .hero-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(20px, 3vw, 40px);
          gap: 0;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 28px;
          padding: 0 12px;
          border-radius: 999px;
          background: rgba(24,119,242,.22);
          border: 1px solid rgba(96,165,250,.32);
          color: #93c5fd;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .05em;
          text-transform: uppercase;
          width: fit-content;
          margin-bottom: 14px;
        }
        .hero-title {
          margin: 0 0 10px;
          font-size: clamp(30px, 4.2vw, 58px);
          line-height: 1.04;
          letter-spacing: -.05em;
          color: #fff;
          max-width: 780px;
        }
        .hero-title em {
          font-style: normal;
          color: #60a5fa;
        }
        .hero-sub {
          margin: 0 0 20px;
          color: rgba(255,255,255,.72);
          font-size: clamp(14px, 1.4vw, 17px);
          font-weight: 700;
          max-width: 560px;
          line-height: 1.5;
        }
        .hero-search-wrap {
          max-width: 740px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.14);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 14px;
        }
        .hero-search-wrap .market-search-compact {
          background: transparent;
        }
        .hero-search-wrap .market-field input,
        .hero-search-wrap .market-field select {
          background: rgba(255,255,255,.12);
          border-color: rgba(255,255,255,.18);
          color: #fff;
        }
        .hero-search-wrap .market-field label { color: rgba(255,255,255,.6); }
        .hero-search-wrap .market-field input::placeholder { color: rgba(255,255,255,.45); }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hero-btn-ghost {
          min-height: 38px;
          padding: 0 16px;
          border-radius: 999px;
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.22);
          color: rgba(255,255,255,.9);
          font-size: 13px;
          font-weight: 950;
          display: inline-flex;
          align-items: center;
          transition: background .18s, border-color .18s;
        }
        .hero-btn-ghost:hover {
          background: rgba(255,255,255,.18);
          border-color: rgba(255,255,255,.38);
        }
        @media (max-width: 760px) {
          .hero-image-real { height: 420px; }
        }
        @media (max-width: 560px) {
          .hero-image-real { height: 520px; }
          .hero-content { padding: 18px 16px; }
          .hero-actions { display: grid; grid-template-columns: 1fr 1fr; }
          .hero-btn-ghost { justify-content: center; font-size: 12px; padding: 0 10px; }
        }
      `}</style>
    </section>
  );
}
