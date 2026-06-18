import Link from "next/link";
import { TruckCard, type TruckCardData } from "./TruckCard";

export function FeaturedAds({ trucks }: { trucks: TruckCardData[] }) {
  return (
    <section className="market-container market-section">
      <div className="market-section-head">
        <div>
          <span>An&uacute;ncios recentes</span>
          <h2>Estoque dispon&iacute;vel</h2>
        </div>
        <Link href="/anuncios">Ver todos &rarr;</Link>
      </div>

      {trucks.length > 0 ? (
        <div className="market-grid">
          {trucks.map((truck) => (
            <TruckCard key={truck.id} truck={truck} />
          ))}
        </div>
      ) : (
        <div className="market-empty">
          <div style={{ fontSize: 40, lineHeight: 1 }}>&#x1F69B;</div>
          <strong>Nenhum caminh&atilde;o dispon&iacute;vel agora</strong>
          <p>Novos an&uacute;ncios aparecem aqui assim que aprovados.</p>
          <Link href="/cadastro" style={{
            marginTop: 8, minHeight: 44, padding: "0 20px", borderRadius: 999,
            background: "var(--blue)", color: "#fff", fontWeight: 900,
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>Anunciar meu caminh&atilde;o</Link>
        </div>
      )}
    </section>
  );
}
