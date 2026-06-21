"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { MapPin, MessageCircle, Eye, TrendingDown, Calendar, ShieldCheck } from "lucide-react";
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

  const novo        = isNew((truck as any).created_at);
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
    timerRef.current = setTimeout(() => setPreview(true), 350);
  }
  function closePreview() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPreview(false);
  }

  return (
    <article
      className={`group relative bg-white border border-slate-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${destaque ? "ring-2 ring-amber-400/20 border-amber-100" : ""}`}
      onMouseEnter={openPreview}
      onMouseLeave={closePreview}
    >
      {/* ── Popover preview (Premium Apple Style) ── */}
      {preview && (
        <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[200] overflow-hidden animate-in fade-in zoom-in duration-200 pointer-events-auto hidden md:block">
          <div className="relative aspect-[16/10] bg-slate-50">
            {image ? (
              isSupabaseUrl(image) ? (
                <Image src={image} alt={title} fill className="object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={title} className="w-full h-full object-cover" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                   <rect x="2" y="7" width="20" height="13" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><circle cx="12" cy="13" r="3"/>
                </svg>
              </div>
            )}
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-slate-900 font-bold text-sm line-clamp-1 mb-1">{cardTitle}</p>
              <strong className="text-2xl font-black text-blue-600 tracking-tight leading-none">{formatMoney(truck.preco)}</strong>
            </div>

            <div className="flex flex-wrap gap-2">
               {abaixoFipe && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                  <TrendingDown size={10} strokeWidth={3} /> Abaixo Fipe
                </span>
              )}
              {verificado && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck size={10} strokeWidth={3} /> Verificado
                </span>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-50">
              {ano && (
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Calendar size={14} className="text-slate-400" /> Ano {ano}
                </p>
              )}
              {location && (
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <MapPin size={14} className="text-slate-400" /> {location}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <Link href={truckUrl} className="flex-1 h-11 flex items-center justify-center bg-blue-600 text-white rounded-xl text-xs font-bold transition-all hover:bg-blue-700 active:scale-95 shadow-sm shadow-blue-200">
                Ver detalhes
              </Link>
              {waLink && (
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="h-11 px-4 flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl transition-all hover:bg-emerald-100 active:scale-95">
                   <MessageCircle size={20} strokeWidth={2.5} />
                </a>
              )}
            </div>
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45" />
        </div>
      )}

      {/* ── Foto principal ── */}
      <Link className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-slate-50" href={truckUrl}>
        {image ? (
          isSupabaseUrl(image) ? (
            <Image
              src={image}
              alt={title}
              width={480}
              height={270}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="2" y="7" width="20" height="13" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><circle cx="12" cy="13" r="3"/>
            </svg>
          </div>
        )}

        {/* Badges Premium */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
          {destaque && (
            <span className="h-6 px-2.5 flex items-center bg-amber-400 text-amber-950 text-[10px] font-black rounded-lg shadow-sm">
              ★ DESTAQUE
            </span>
          )}
          {novo && (
            <span className="h-6 px-2.5 flex items-center bg-blue-600 text-white text-[10px] font-black rounded-lg shadow-sm">
              NOVO
            </span>
          )}
        </div>
      </Link>

      {/* ── Corpo do Card ── */}
      <div className="p-4 flex flex-col flex-1 gap-4">
        <div className="space-y-1.5">
          <p className="text-slate-900 font-bold text-[15px] leading-tight line-clamp-2 min-h-[40px]">
            {cardTitle}
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            {ano && <span>{ano}</span>}
            {metaParts.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <span>{metaParts.join(" · ")}</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-end justify-between gap-2 border-t border-slate-50 pt-3">
            <div className="flex flex-col">
              <strong className="text-xl font-black text-blue-600 tracking-tight leading-none">
                {formatMoney(truck.preco)}
              </strong>
              {location && (
                <span className="flex items-center gap-1 mt-1.5 text-[11px] font-bold text-slate-400">
                  <MapPin size={11} className="text-slate-300" strokeWidth={2.5} />
                  {location}
                </span>
              )}
            </div>
            {views != null && views > 0 && (
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 text-slate-400 text-[10px] font-black">
                <Eye size={12} strokeWidth={2.5} /> {fmtViews(views)}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              href={truckUrl}
              className="flex-1 h-11 flex items-center justify-center bg-slate-900 text-white rounded-xl text-xs font-bold transition-all hover:bg-slate-800 active:scale-95"
            >
              Ver detalhes
            </Link>
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center bg-emerald-500 text-white rounded-xl transition-all hover:bg-emerald-600 active:scale-95 shadow-sm shadow-emerald-200"
                aria-label="WhatsApp"
              >
                <WaIcon />
              </a>
            )}
          </div>
        </div>
      </div>

















































    </article>
  );
}
