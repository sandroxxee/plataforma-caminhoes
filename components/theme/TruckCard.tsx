"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { MapPin, Camera, MessageCircle, Eye } from "lucide-react";
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

function isNew(created_at?: string | null) {
  if (!created_at) return false;
  const diff = Date.now() - new Date(created_at).getTime();
  return diff < 3 * 24 * 60 * 60 * 1000;
}

function fmtViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k`;
  return String(n);
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
  const views      = (truck as any).views as number | null | undefined;

  const novo     = isNew((truck as any).created_at);
  const destaque = !!(truck as any).destaque;

  const [preview, setPreview] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openPreview() {
    timerRef.current = setTimeout(() => setPreview(true), 320);
  }
  function closePreview() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPreview(false);
  }

  const specs = [
    year     && { label: "Ano",   value: String(year) },
    type     && { label: "Tipo",  value: type },
    location && { label: "Local", value: location },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article
      className={`tc${destaque ? " tc-featured" : ""}`}
      onMouseEnter={openPreview}
      onMouseLeave={closePreview}
      onFocus={openPreview}
      onBlur={closePreview}
    >
      {preview && (
        <div className="tc-preview" role="tooltip" aria-label={`Pr\u00e9-visualiza\u00e7\u00e3o: ${title}`}>
          <div className="tc-preview-photo">
            {image ? (
              isSupabaseUrl(image) ? (
                <Image src={image} alt={title} width={340} height={200}
                  style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }} />
              ) : (
                <img src={image} alt={title}
                  style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }} />
              )
            ) : (
              <div className="tc-preview-no-photo"><Camera size={28} strokeWidth={1.5} /></div>
            )}
            {photoCount > 1 && (
              <span className="tc-preview-count">
                <Camera size={12} strokeWidth={2.5} /> {photoCount} fotos
              </span>
            )}
          </div>
          <div className="tc-preview-body">
            <p className="tc-preview-title">{cardTitle}</p>
            <strong className="tc-preview-price">{formatMoney(truck.preco)}</strong>
            {specs.length > 0 && (
              <div className="tc-preview-specs">
                {specs.map((s) => (
                  <div key={s.label} className="tc-preview-spec">
                    <span>{s.label}</span>
                    <strong>{s.value}</strong>
                  </div>
                ))}
              </div>
            )}
            <div className="tc-preview-actions">
              <Link href={truckUrl} className="tc-preview-btn-detail" onClick={closePreview}>
                Ver detalhes
              </Link>
              {waLink && (
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="tc-preview-btn-wa" onClick={closePreview}>
                  <MessageCircle size={15} strokeWidth={2} />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
          <div className="tc-preview-arrow" aria-hidden="true" />
        </div>
      )}

      <Link className="tc-photo" href={truckUrl} aria-label={`Ver detalhes de ${title}`}>
        {image ? (
          isSupabaseUrl(image) ? (
            <Image src={image} alt={title} width={480} height={270}
              loading="lazy" decoding="async"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{ objectFit: "cover", width: "100%", height: "100%", display: "block" }} />
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

        <span className="tc-badges">
          {destaque && <span className="tc-badge tc-badge-destaque">&#9733; Destaque</span>}
          {novo     && <span className="tc-badge tc-badge-novo">Novo</span>}
        </span>
      </Link>

      {waLink && (
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="tc-wa" aria-label="WhatsApp">
          <WaIcon />
        </a>
      )}

      <div className="tc-body">
        <p className="tc-name">{cardTitle}</p>
        <div className="tc-meta-row">
          {meta && <p className="tc-meta">{meta}</p>}
          {views != null && views > 0 && (
            <span className="tc-views">
              <Eye size={11} strokeWidth={2.5} aria-hidden="true" />
              {fmtViews(views)}
            </span>
          )}
        </div>
        <Link className="tc-btn" href={truckUrl}>Ver detalhes</Link>
      </div>

      <style>{`
        .tc { isolation: isolate; position: relative; z-index: 0; }
        .tc:hover { z-index: 100; }
        .tc-featured { border-color: rgba(234,179,8,.45) !important; box-shadow: 0 0 0 1.5px rgba(234,179,8,.18), var(--shadow); }
        .tc-badges {
          position: absolute; top: 9px; left: 9px;
          display: flex; flex-direction: column; gap: 4px;
          pointer-events: none; z-index: 3;
        }
        .tc-badge {
          display: inline-flex; align-items: center;
          height: 22px; padding: 0 8px; border-radius: 999px;
          font-size: 10px; font-weight: 900;
          letter-spacing: .03em; line-height: 1;
          backdrop-filter: blur(4px);
        }
        .tc-badge-destaque { background: rgba(234,179,8,.92); color: #7c5c00; }
        .tc-badge-novo { background: rgba(34,197,94,.9); color: #fff; }

        /* views + meta */
        .tc-meta-row { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
        .tc-views {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 11px; font-weight: 800; color: var(--muted);
          white-space: nowrap; flex-shrink: 0;
        }

        /* Popover */
        .tc-preview {
          position: absolute; bottom: calc(100% + 12px);
          left: 50%; transform: translateX(-50%);
          width: 320px; background: var(--surface);
          border: 1px solid var(--line); border-radius: 18px;
          box-shadow: var(--shadow3); z-index: 200;
          overflow: visible; animation: tc-pop .18s ease;
          pointer-events: auto;
        }
        @keyframes tc-pop {
          from { opacity:0; transform:translateX(-50%) translateY(6px) scale(.97); }
          to   { opacity:1; transform:translateX(-50%) translateY(0)   scale(1); }
        }
        .tc-preview-photo {
          position: relative; width: 100%; height: 180px;
          background: var(--soft); overflow: hidden; border-radius: 18px 18px 0 0;
        }
        .tc-preview-no-photo {
          width:100%; height:100%;
          display:flex; align-items:center; justify-content:center;
          color:var(--muted); opacity:.4;
        }
        .tc-preview-count {
          position:absolute; bottom:8px; left:10px;
          display:inline-flex; align-items:center; gap:4px;
          height:22px; padding:0 9px; border-radius:999px;
          background:rgba(0,0,0,.55); color:#fff;
          font-size:11px; font-weight:800; backdrop-filter:blur(4px);
        }
        .tc-preview-body { padding: 14px 16px 16px; }
        .tc-preview-title {
          margin:0 0 4px; font-size:14px; font-weight:800; color:var(--text);
          line-height:1.3; letter-spacing:-.02em;
          display:-webkit-box; -webkit-line-clamp:2;
          -webkit-box-orient:vertical; overflow:hidden;
        }
        .tc-preview-price {
          display:block; font-size:22px; font-weight:950;
          color:var(--blue); letter-spacing:-.04em;
          line-height:1; margin-bottom:12px;
        }
        .tc-preview-specs { display:grid; gap:5px; margin-bottom:14px; }
        .tc-preview-spec {
          display:flex; justify-content:space-between; align-items:center; gap:8px;
          font-size:12px; padding:6px 10px;
          background:var(--soft); border-radius:8px;
        }
        .tc-preview-spec span   { color:var(--muted); font-weight:700; }
        .tc-preview-spec strong { font-weight:900; color:var(--text); }
        .tc-preview-actions { display:flex; gap:8px; }
        .tc-preview-btn-detail {
          flex:1; height:38px; border-radius:10px;
          background:var(--blue); color:#fff;
          display:flex; align-items:center; justify-content:center;
          font-size:13px; font-weight:800;
          text-decoration:none; transition:background .14s;
        }
        .tc-preview-btn-detail:hover { background:var(--blue2); }
        .tc-preview-btn-wa {
          display:inline-flex; align-items:center; gap:6px;
          height:38px; padding:0 13px; border-radius:10px;
          background:rgba(37,211,102,.12);
          border:1.5px solid rgba(37,211,102,.3);
          color:#16a34a; font-size:13px; font-weight:800;
          text-decoration:none; white-space:nowrap;
          transition:background .14s; flex-shrink:0;
        }
        .tc-preview-btn-wa:hover { background:rgba(37,211,102,.22); }
        body.public-theme-dark .tc-preview-btn-wa { color:#4ade80; }
        .tc-preview-arrow {
          position:absolute; bottom:-7px; left:50%;
          transform:translateX(-50%) rotate(45deg);
          width:14px; height:14px;
          background:var(--surface);
          border-right:1px solid var(--line);
          border-bottom:1px solid var(--line);
        }
        @media (max-width:900px) { .tc-preview { display:none; } }
      `}</style>
    </article>
  );
}
