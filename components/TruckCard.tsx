import Image from "next/image";
import Link from "next/link";
import { MapPin, Camera } from "lucide-react";
import type { TruckCardData, TruckImage } from "@/lib/truck-utils";
import { formatMoney, getCardTitle, getLocation, gerarSlugComId } from "@/lib/truck-utils";

type Props = {
  truck: TruckCardData & { truck_images?: TruckImage[] };
};

export function TruckCard({ truck }: Props) {
  const title = getCardTitle(truck);
  const location = getLocation(truck);
  const price = formatMoney(truck.preco);
  const images = truck.truck_images || [];
  const mainImage = images.find((i) => i.principal)?.image_url || images[0]?.image_url;
  const photoCount = images.length;

  const slug = gerarSlugComId({
    id: truck.id,
    marca: truck.marca,
    modelo: truck.modelo,
    ano_modelo: truck.ano_modelo,
    ano_fabricacao: truck.ano_fabricacao,
    cidade: truck.cidade,
    estado: truck.estado,
  });

  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const waText = encodeURIComponent(
    `Olá, tenho interesse no caminhão ${title}. Pode me passar mais informações?`
  );
  const waLink = phone ? `https://wa.me/${phone}?text=${waText}` : "";

  return (
    <article className="tc">
      <Link href={`/anuncios/${slug}`} className="tc-photo" aria-label={title}>
        {mainImage ? (
          <Image
            src={mainImage}
            alt={title}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className="tc-no-photo" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </span>
        )}

        {/* Overlay preço + cidade */}
        <span className="tc-overlay" aria-hidden="true">
          <span className="tc-price">{price}</span>
          {location && (
            <span className="tc-loc">
              <MapPin size={10} style={{ display: "inline", marginRight: 2 }} />
              {location}
            </span>
          )}
        </span>

        {/* Badge contador de fotos */}
        {photoCount > 0 && (
          <span className="tc-photo-badge" aria-label={`${photoCount} fotos`}>
            <Camera size={10} aria-hidden="true" />
            {photoCount}
          </span>
        )}
      </Link>

      <div className="tc-body">
        <h2 className="tc-name">{title}</h2>
        <p className="tc-meta">
          {[truck.ano_modelo || truck.ano_fabricacao, truck.carroceria || truck.tracao]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <Link href={`/anuncios/${slug}`} className="tc-btn">
          Ver detalhes
        </Link>
      </div>

      {/* Botão WhatsApp flutuante */}
      {waLink && (
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="tc-wa"
          aria-label="Contato pelo WhatsApp"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.563 4.14 1.546 5.877L.057 23.886l6.187-1.621A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.045-1.393l-.361-.215-3.735.979.995-3.638-.235-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
          </svg>
        </a>
      )}

      <style>{`
        .tc-photo { position: relative; display: block; aspect-ratio: 16/9; overflow: hidden; background: var(--soft); }
        .tc-photo-badge {
          position: absolute; bottom: 9px; left: 9px; z-index: 2;
          display: inline-flex; align-items: center; gap: 4px;
          height: 22px; padding: 0 8px; border-radius: 999px;
          background: rgba(0,0,0,.52); color: #fff;
          font-size: 11px; font-weight: 950; backdrop-filter: blur(4px);
          pointer-events: none;
        }
      `}</style>
    </article>
  );
}
