import Link from "next/link";
import Image from "next/image";
import { gerarSlugComId } from "@/lib/slug";

export type TruckImage = {
  image_url: string | null;
  principal: boolean | null;
  ordem: number | null;
};

export type TruckCardData = {
  id: string;
  titulo: string | null;
  marca: string | null;
  modelo: string | null;
  ano_modelo: number | null;
  ano_fabricacao: number | null;
  preco: number | null;
  cidade: string | null;
  estado: string | null;
  carroceria: string | null;
  tracao: string | null;
  whatsapp: string | null;
  truck_images?: TruckImage[];
};

export function formatMoney(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function normalizeCity(city: string | null) {
  const value = (city || "").trim();
  if (!value) return "";
  const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (normalized === "xanxere") return "Xanxerê";
  if (normalized === "florianopolis") return "Florianópolis";
  return value;
}

export function getLocation(truck: TruckCardData) {
  const city = normalizeCity(truck.cidade);
  if (city && truck.estado) return `${city} • ${truck.estado}`;
  if (truck.estado) return truck.estado;
  return city || "";
}

export function getTitle(truck: TruckCardData) {
  return truck.titulo || `${truck.marca || ""} ${truck.modelo || ""}`.trim() || "Caminhão anunciado";
}

export function getCardTitle(truck: TruckCardData) {
  const title = getTitle(truck);
  const ano = truck.ano_modelo || truck.ano_fabricacao;
  if (!ano) return title;
  return title
    .replace(new RegExp(`\\s*[-–—]?\\s*ano\\s*${ano}\\b`, "i"), "")
    .replace(new RegExp(`\\s*[-–—]\\s*${ano}\\b`, "i"), "")
    .replace(/\s{2,}/g, " ").trim() || title;
}

export function getTruckImage(truck: TruckCardData) {
  const images = [...(truck.truck_images || [])]
    .filter((img) => img.image_url)
    .sort((a, b) => {
      if (a.principal && !b.principal) return -1;
      if (!a.principal && b.principal) return 1;
      return (a.ordem || 0) - (b.ordem || 0);
    });
  return images[0]?.image_url || "";
}

export function getWhatsappLink(truck: TruckCardData) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(`Olá, tenho interesse no caminhão ${getTitle(truck)}.`);
  return phone ? `https://wa.me/${phone}?text=${text}` : "";
}

export function getTruckUrl(truck: TruckCardData) {
  return `/anuncios/${gerarSlugComId({
    id: truck.id,
    marca: truck.marca,
    modelo: truck.modelo,
    ano_modelo: truck.ano_modelo,
    ano_fabricacao: truck.ano_fabricacao,
    cidade: truck.cidade,
    estado: truck.estado,
  })}`;
}

function isSupabaseUrl(url: string) {
  return url.includes(".supabase.co/storage/v1/object/public/");
}

const WaIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.856L.054 23.454a.5.5 0 0 0 .622.579l5.7-1.493A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.368l-.36-.214-3.73.978.996-3.642-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
  </svg>
);

export function TruckCard({ truck }: { truck: TruckCardData }) {
  const title = getTitle(truck);
  const cardTitle = getCardTitle(truck);
  const image = getTruckImage(truck);
  const year = truck.ano_modelo || truck.ano_fabricacao || null;
  const type = truck.carroceria || truck.tracao || null;
  const location = getLocation(truck);
  const truckUrl = getTruckUrl(truck);
  const waLink = getWhatsappLink(truck);
  const meta = [year, type].filter(Boolean).join(" • ");

  return (
    <article className="tc">
      {/* FOTO */}
      <Link className="tc-photo" href={truckUrl} aria-label={`Ver detalhes de ${title}`}>
        {image ? (
          isSupabaseUrl(image) ? (
            <Image
              src={image}
              alt={title}
              width={480}
              height={270}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }}
            />
          ) : (
            <img src={image} alt={title} loading="lazy" decoding="async"
              style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }} />
          )
        ) : (
          <span className="tc-no-photo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="7" width="20" height="13" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </span>
        )}

        {/* Overlay: preço + local */}
        <div className="tc-overlay">
          <span className="tc-price">{formatMoney(truck.preco)}</span>
          {location && <span className="tc-loc">📍 {location}</span>}
        </div>

        {/* Botão WA flutuante */}
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="tc-wa"
            aria-label="WhatsApp"
            onClick={(e) => e.stopPropagation()}
          >
            <WaIcon />
          </a>
        )}
      </Link>

      {/* CORPO */}
      <div className="tc-body">
        <p className="tc-name">{cardTitle}</p>
        {meta && <p className="tc-meta">{meta}</p>}
        <Link className="tc-btn" href={truckUrl}>Ver detalhes</Link>
      </div>

      <style>{`
        .tc {
          background: var(--surface);
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          transition: box-shadow .2s, transform .2s;
        }
        .tc:hover { box-shadow: var(--shadow2); transform: translateY(-3px); }

        .tc-photo {
          display: block;
          position: relative;
          overflow: hidden;
          background: var(--soft);
          aspect-ratio: 16/9;
          flex-shrink: 0;
        }
        .tc-photo > img,
        .tc-photo > span.tc-no-photo { display: block; width: 100%; height: 100%; }
        .tc:hover .tc-photo img { transform: scale(1.04); transition: transform .4s ease; }

        .tc-no-photo {
          display: flex; align-items: center; justify-content: center;
          color: var(--muted); opacity: .4;
        }

        /* gradiente bottom na foto */
        .tc-overlay {
          position: absolute;
          inset: auto 0 0 0;
          padding: 32px 12px 10px;
          background: linear-gradient(to top, rgba(0,0,0,.72) 0%, transparent 100%);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 6px;
          pointer-events: none;
        }
        .tc-price {
          font-size: 17px;
          font-weight: 950;
          color: #fff;
          letter-spacing: -.03em;
          line-height: 1;
          text-shadow: 0 1px 4px rgba(0,0,0,.5);
        }
        .tc-loc {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,.82);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 50%;
        }

        /* botão WA na foto */
        .tc-wa {
          position: absolute;
          top: 9px;
          right: 9px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #25d366;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,.28);
          transition: transform .16s, box-shadow .16s;
          pointer-events: all;
        }
        .tc-wa:hover { transform: scale(1.12); box-shadow: 0 6px 18px rgba(37,211,102,.45); }

        /* corpo */
        .tc-body {
          padding: 12px 14px 14px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
        }
        .tc-name {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
          color: var(--text);
          line-height: 1.3;
          letter-spacing: -.02em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .tc-meta {
          margin: 0 0 8px;
          font-size: 11px;
          color: var(--muted);
          font-weight: 700;
        }
        .tc-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          border-radius: 10px;
          background: var(--blue);
          color: #fff;
          font-weight: 800;
          font-size: 13px;
          text-decoration: none;
          margin-top: auto;
          transition: background .14s;
        }
        .tc-btn:hover { background: var(--blue2); }

        @media (max-width: 560px) {
          .tc-price { font-size: 15px; }
          .tc-name { font-size: 13px; }
          .tc-body { padding: 10px 11px 12px; }
          .tc-btn { height: 34px; font-size: 12px; }
          .tc-loc { display: none; }
        }
      `}</style>
    </article>
  );
}
