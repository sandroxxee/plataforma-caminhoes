"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Camera, MessageCircle } from "lucide-react";
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
      {/* Foto */}
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

        {/* Overlay: preço + localização */}
        <div className="tc-overlay">
          <span className="tc-price">{formatMoney(truck.preco)}</span>
          {location && (
            <span className="tc-loc">
              <MapPin size={10} strokeWidth={2} aria-hidden="true" />
              {location}
            </span>
          )}
        </div>

        {/* Badge contador de fotos */}
        {photoCount > 0 && (
          <span className="tc-photo-badge" aria-label={`${photoCount} fotos`}>
            <Camera size={11} strokeWidth={2.5} aria-hidden="true" />
            {photoCount}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="tc-body">
        <p className="tc-name">{cardTitle}</p>
        {meta && <p className="tc-meta">{meta}</p>}

        <div className="tc-actions">
          <Link className="tc-btn" href={truckUrl}>Ver detalhes</Link>
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="tc-wa-btn"
              aria-label="Contato WhatsApp"
            >
              <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
              <span className="tc-wa-label">WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
