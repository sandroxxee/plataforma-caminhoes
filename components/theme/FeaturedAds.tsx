import Link from "next/link";
import { TruckCard, type TruckCardData } from "./TruckCard";

export function FeaturedAds({ trucks }: { trucks: TruckCardData[] }) {
  return (
    <section className="market-container market-section">
      <div className="market-section-head">
        <div>
          <span>Anúncios recentes</span>
          <h2>Estoque disponível</h2>
        </div>
        <Link href="/anuncios">Ver todos →</Link>
      </div>

      {trucks.length > 0 ? (
        <div className="market-grid">
          {trucks.map((truck) => (
            <TruckCard key={truck.id} truck={truck} />
          ))}
        </div>
      ) : (
        <div className="market-empty featured-empty">
          <div className="featured-empty-icon">🚛</div>
          <strong>Nenhum caminhão disponível agora</strong>
          <p>Novos anúncios aparecem aqui assim que aprovados.</p>
          <Link href="/cadastro" className="featured-empty-cta">Anunciar meu caminhão</Link>
        </div>
      )}

      <style>{`
        .featured-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 56px 24px;
          text-align: center;
          color: var(--muted);
        }
        .featured-empty-icon {
          font-size: 40px;
          line-height: 1;
          margin-bottom: 4px;
        }
        .featured-empty strong {
          font-size: 18px;
          color: var(--text);
          letter-spacing: -.02em;
        }
        .featured-empty p {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          max-width: 36ch;
        }
        .featured-empty-cta {
          margin-top: 8px;
          min-height: 44px;
          padding: 0 20px;
          border-radius: 999px;
          background: var(--blue);
          color: #fff;
          font-weight: 950;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </section>
  );
}
