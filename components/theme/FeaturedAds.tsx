import Link from "next/link";
import { TruckCard, type TruckCardData } from "./TruckCard";

export function FeaturedAds({ trucks }: { trucks: TruckCardData[] }) {
  return (
    <section className="market-container market-section">
      <div className="market-section-head">
        <div>
          <span>Destaques</span>
          <h2>Anúncios recentes</h2>
        </div>
        <Link href="/anuncios">Ver todos</Link>
      </div>

      <div className="market-grid">
        {trucks.length > 0 ? (
          trucks.map((truck) => <TruckCard key={truck.id} truck={truck} />)
        ) : (
          <div className="market-empty">Nenhum anúncio aprovado disponível no momento.</div>
        )}
      </div>
    </section>
  );
}
