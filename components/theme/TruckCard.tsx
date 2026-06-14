"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Camera } from "lucide-react";
import {
  formatMoney,
  getCardTitle,
  getLocation,
  getTitle,
  getTruckImage,
  getTruckUrl,
  getWhatsappLink,
  type TruckCardData,
  type TruckImage,
} from "@/lib/truck-utils";

export type { TruckCardData, TruckImage };

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
  const title      = getTitle(truck);
  const cardTitle  = getCardTitle(truck);
  const image      = getTruckImage(truck);
  const year       = truck.ano_modelo || truck.ano_fabricacao || null;
  const type       = truck.carroceria || truck.tracao || null;
  const location   = getLocation(truck);
  const truckUrl   = getTruckUrl(truck);
  const waLink     = getWhatsappLink(truck);
  const meta       = [year, type].filter(Boolean).join(" \u2022 ");
  const photoCount = (truck.truck_images || []).length;

  return (
    <article className="tc">
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
            <img
              src={image} alt={title} loading="lazy" decoding="async"
              style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }}
            />
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

        <div className="tc-overlay">
          <span className="tc-price">{formatMoney(truck.preco)}</span>
          {location && (
            <span className="tc-loc">
              <MapPin size={10} strokeWidth={2} aria-hidden="true" />
              {location}
            </span>
          )}
        </div>

        {photoCount > 0 && (
          <span className="tc-photo-badge" aria-label={`${photoCount} fotos`}>
            <Camera size={11} strokeWidth={2.5} aria-hidden="true" />
            {photoCount}
          </span>
        )}
      </Link>

      {waLink && (
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="tc-wa" aria-label="WhatsApp">
          <WaIcon />
        </a>
      )}

      <div className="tc-body">
        <p className="tc-name">{cardTitle}</p>
        {meta && <p className="tc-meta">{meta}</p>}
        <Link className="tc-btn" href={truckUrl}>Ver detalhes</Link>
      </div>
    </article>
  );
}
