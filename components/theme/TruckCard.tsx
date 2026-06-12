import Link from "next/link";
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
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function normalizeCity(city: string | null) {
  const value = (city || "").trim();
  if (!value) return "Cidade";

  const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (normalized === "xanxere") return "Xanxerê";
  if (normalized === "florianopolis") return "Florianópolis";
  return value;
}

export function getLocation(truck: TruckCardData) {
  const city = normalizeCity(truck.cidade);
  return truck.estado ? `${city} - ${truck.estado}` : city;
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
    .replace(/\s{2,}/g, " ")
    .trim() || title;
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

export function TruckCard({ truck }: { truck: TruckCardData }) {
  const title = getTitle(truck);
  const cardTitle = getCardTitle(truck);
  const image = getTruckImage(truck);
  const year = truck.ano_modelo || truck.ano_fabricacao || "Ano não informado";
  const type = truck.carroceria || truck.tracao || "Configuração não informada";
  const truckUrl = getTruckUrl(truck);

  return (
    <article className="truck-card truck-card-hover-detail">
      <style>{`
        .truck-card-hover-detail {
          position: relative;
          cursor: pointer;
        }

        /* Melhoria 1: foto ocupa 100% sem espaço vazio (cover) + escala suave no hover */
        .truck-card-hover-detail .truck-card-photo img {
          object-fit: cover;
          object-position: center center;
          transition: transform .32s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Melhoria 3: escala suave na foto ao hover */
        .truck-card-hover-detail:hover .truck-card-photo img {
          transform: scale(1.05);
        }

        /* Placeholder quando sem foto */
        .truck-card-no-photo {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--muted);
          font-size: 13px;
          font-weight: 800;
        }

        .truck-card-hover-detail .truck-card-actions {
          position: absolute;
          inset: 0;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0;
          padding: 16px;
          background: linear-gradient(180deg, rgba(15, 23, 42, .08), rgba(15, 23, 42, .56));
          opacity: 0;
          pointer-events: none;
          transition: opacity .18s ease;
        }

        .truck-card-hover-detail:hover .truck-card-actions,
        .truck-card-hover-detail:focus-within .truck-card-actions {
          opacity: 1;
          pointer-events: auto;
        }

        .truck-card-hover-detail .truck-card-detail {
          min-height: 46px;
          padding: 0 18px;
          border-radius: 999px;
          border: 0;
          background: var(--blue);
          color: #fff;
          box-shadow: 0 12px 24px rgba(15, 23, 42, .24);
          font-size: 14px;
          transform: translateY(6px);
          transition: transform .18s ease;
        }

        .truck-card-hover-detail:hover .truck-card-detail,
        .truck-card-hover-detail:focus-within .truck-card-detail {
          transform: translateY(0);
        }

        /* Melhoria 4: feedback de toque no celular */
        @media (hover: none) {
          .truck-card-hover-detail:active {
            transform: scale(0.98);
            transition: transform .12s ease;
          }
        }

        @media (hover: none), (max-width: 760px) {
          .truck-card-hover-detail .truck-card-actions {
            position: static;
            display: grid;
            grid-template-columns: 1fr;
            opacity: 1;
            pointer-events: auto;
            padding: 0;
            background: transparent;
            margin-top: auto;
          }

          .truck-card-hover-detail .truck-card-detail {
            width: 100%;
            min-height: 46px;
            border-radius: 12px;
            transform: none;
          }
        }
      `}</style>

      {/* Melhoria 2: lazy load + decoding async nas imagens */}
      <Link className="truck-card-photo" href={truckUrl} aria-label={`Ver detalhes de ${title}`}>
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            width={400}
            height={400}
          />
        ) : (
          <span className="truck-card-no-photo">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="2" y="7" width="20" height="13" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
            Sem foto
          </span>
        )}
      </Link>

      <div className="truck-card-body">
        <strong className="truck-card-price">{formatMoney(truck.preco)}</strong>
        <Link className="truck-card-title" href={truckUrl}>{cardTitle}</Link>
        <p className="truck-card-meta">{year} • {type} • {getLocation(truck)}</p>

        <div className="truck-card-actions">
          <Link className="truck-card-detail" href={truckUrl}>Ver detalhes</Link>
        </div>
      </div>
    </article>
  );
}
