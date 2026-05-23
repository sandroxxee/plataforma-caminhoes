import Link from "next/link";
import type { Truck } from "@/lib/trucks";

export function TruckCard({ truck }: { truck: Truck }) {
  const badgeClass = truck.badge === "Destaque" ? "yellow" : truck.badge === "Disponível" ? "green" : "red";
  return (
    <article className="card">
      <div className="card-img">
        <span className={`badge ${badgeClass}`}>{truck.badge}</span>
        <span>{truck.emoji}</span>
      </div>
      <div className="card-body">
        <h3>{truck.title}</h3>
        <div className="price">{truck.price}</div>
        <div className="meta">
          <span>{truck.year}</span><span>{truck.city}/{truck.state}</span><span>{truck.body}</span><span>{truck.traction}</span>
        </div>
        <p className="muted">{truck.description}</p>
        <div className="card-actions">
          <Link className="btn" href={`/anuncios/${truck.id}`}>Ver detalhes</Link>
          <a className="btn primary" href={`https://wa.me/5549999362681?text=${encodeURIComponent(`Olá, tenho interesse no caminhão ${truck.title}. Ainda está disponível?`)}`}>WhatsApp</a>
        </div>
      </div>
    </article>
  );
}
