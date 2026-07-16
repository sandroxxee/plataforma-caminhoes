"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { MapPin, MessageCircle, Eye, TrendingDown, Calendar, ShieldCheck, Truck } from "lucide-react";
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

function fmtViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k`;
  return String(n);
}

const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.856L.054 23.454a.5.5 0 0 0 .622.579l5.7-1.493A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.368l-.36-.214-3.73.978.996-3.642-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
  </svg>
);

export function TruckCard({ truck }: { truck: TruckCardData }) {
  const title      = getTitle(truck);
  const cardTitle  = getCardTitle(truck);
  const image      = getTruckImage(truck);
  const location   = getLocation(truck);
  const truckUrl   = getTruckUrl(truck);
  const waLink     = getWhatsappLink(truck);
  const views      = (truck as any).views as number | null | undefined;

  const destaque    = !!(truck as any).destaque;
  const abaixoFipe  = (truck as any).abaixo_fipe === true;
  const verificado  = !!(truck as any).verificado;

  const ano         = truck.ano_modelo || truck.ano_fabricacao || null;
  const tracao      = (truck as any).tracao as string | null | undefined;
  const cambio      = (truck as any).cambio as string | null | undefined;

  const metaParts = [
    tracao || null,
    cambio || null,
  ].filter(Boolean) as string[];

  const [preview, setPreview] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openPreview() {
    timerRef.current = setTimeout(() => setPreview(true), 400);
  }
  function closePreview() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPreview(false);
  }

  return (
    <article
      className={`tcp-card ${destaque ? 'is-featured' : ''}`}
      onMouseEnter={openPreview}
      onMouseLeave={closePreview}
    >
      <style>{`
        .tcp-card {
          position: relative;
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          color: inherit;
        }
        .tcp-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px rgba(15,23,42,0.12);
          border-color: rgba(37,99,235,0.15);
        }
        .tcp-card.is-featured {
          border-color: rgba(234,179,8,0.3);
          box-shadow: 0 0 0 2px rgba(234,179,8,0.1), 0 2px 12px rgba(0,0,0,0.04);
        }

        .tcp-photo {
          display: block;
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
          background: #f1f5f9;
          overflow: hidden;
        }
        .tcp-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .tcp-card:hover .tcp-photo img {
          transform: scale(1.05);
        }

        .tcp-badges {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 10;
        }
        .tcp-badge {
          height: 24px;
          padding: 0 10px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
        }
        .tcp-badge-destaque { background: rgba(234,179,8,0.95); color: #451a03; }
        .tcp-badge-novo { background: rgba(37,99,235,0.95); color: #fff; }

        .tcp-body {
          padding: 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .tcp-title {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 42px;
        }
        .tcp-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
        }
        .tcp-dot { width: 3px; height: 3px; border-radius: 50%; background: #cbd5e1; }

        .tcp-price-row {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        .tcp-price-box { display: flex; flex-direction: column; gap: 4px; }
        .tcp-price {
          font-size: 21px;
          font-weight: 900;
          color: #2563eb;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .tcp-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
        }

        .tcp-actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }
        .tcp-btn-main {
          flex: 1;
          height: 44px;
          border-radius: 14px;
          background: #0f172a;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .tcp-btn-main:hover { background: #1e293b; }
        .tcp-btn-wa {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #22c55e;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(34,197,94,0.2);
        }
        .tcp-btn-wa:hover { transform: scale(1.05); background: #16a34a; }

        .tcp-views {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 800;
          background: #f8fafc;
          padding: 4px 8px;
          border-radius: 8px;
        }

        /* ── Mobile compacto ≤ 640px ── */
        @media (max-width: 640px) {
          .tcp-card { border-radius: 14px; }
          .tcp-photo { aspect-ratio: 4/3; }
          .tcp-body { padding: 10px; gap: 7px; }
          .tcp-title {
            font-size: 13px;
            -webkit-line-clamp: 2;
            min-height: 0;
            font-weight: 900;
            letter-spacing: -0.02em;
          }
          .tcp-meta { font-size: 11px; gap: 4px; }
          .tcp-price { font-size: 15px; }
          .tcp-location { font-size: 10px; }
          .tcp-price-row { padding-top: 8px; }
          .tcp-actions { gap: 6px; margin-top: 2px; }
          .tcp-btn-main { height: 36px; font-size: 11.5px; border-radius: 10px; padding: 0 4px; }
          .tcp-btn-wa { width: 36px; height: 36px; border-radius: 10px; }
          .tcp-badge { height: 20px; font-size: 9px; padding: 0 7px; }
          .tcp-views { display: none; }
        }

        /* ── Telas muito pequenas ≤ 390px ── */
        @media (max-width: 390px) {
          .tcp-body { padding: 8px; gap: 6px; }
          .tcp-title { font-size: 12px; }
          .tcp-price { font-size: 14px; }
          .tcp-btn-main { height: 34px; font-size: 10.5px; padding: 0 2px; }
          .tcp-btn-wa { width: 34px; height: 34px; }
        }
      `}</style>

      <div className="tcp-badges">
        {destaque && <span className="tcp-badge tcp-badge-destaque">★ Destaque</span>}
        {verificado && <span className="tcp-badge" style={{ color: '#ea580c' }}><ShieldCheck size={12} strokeWidth={3} style={{ marginRight: '4px' }} /> Verificado</span>}
      </div>

      <Link href={truckUrl} className="tcp-photo">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
            <Truck size={48} strokeWidth={1} />
          </div>
        )}
      </Link>

      <div className="tcp-body">
        <div className="tcp-info">
          <h3 className="tcp-title">{cardTitle}</h3>
          <div className="tcp-meta">
            {ano && <span>{ano}</span>}
            {metaParts.length > 0 && <span className="tcp-dot" />}
            {metaParts.join(" · ")}
          </div>
        </div>

        <div className="tcp-price-row">
          <div className="tcp-price-box">
            <span className="tcp-price">{formatMoney(truck.preco)}</span>
            {location && (
              <span className="tcp-location">
                <MapPin size={12} strokeWidth={2.5} />
                {location}
              </span>
            )}
          </div>
          {views != null && views > 0 && (
            <div className="tcp-views">
              <Eye size={12} strokeWidth={2.5} /> {fmtViews(views)}
            </div>
          )}
        </div>

        {abaixoFipe && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginTop: '4px' }}>
            <TrendingDown size={12} strokeWidth={3} /> Abaixo Fipe
          </div>
        )}

        <div className="tcp-actions">
          <Link href={truckUrl} className="tcp-btn-main">Ver detalhes</Link>
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="tcp-btn-wa">
              <WaIcon />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
