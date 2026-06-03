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
  const whatsappLink = getWhatsappLink(truck);
  const truckUrl = getTruckUrl(truck);

  return (
    <article className="truck-card">
      <Link className="truck-card-photo" href={truckUrl} aria-label={`Ver detalhes de ${title}`}>
        {image ? <img src={image} alt={title} /> : <span>Sem foto</span>}
      </Link>

      <div className="truck-card-body">
        <strong className="truck-card-price">{formatMoney(truck.preco)}</strong>
        <Link className="truck-card-title" href={truckUrl}>{cardTitle}</Link>
        <p className="truck-card-meta">{year} • {type} • {getLocation(truck)}</p>

        <div className="truck-card-actions">
          <Link className="truck-card-detail" href={truckUrl}>Ver detalhes</Link>
          {whatsappLink ? (
            <a className="truck-card-whatsapp" href={whatsappLink} target="_blank" rel="noreferrer" data-whatsapp-click data-truck-id={truck.id}>WhatsApp</a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
