"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Camera, Heart, Star, ShieldCheck, Clock, Eye, Calendar } from "lucide-react";
import type { TruckCardData, TruckImage } from "@/lib/truck-utils";
import { formatMoney, getCardTitle, getLocation, getTruckUrl } from "@/lib/truck-utils";

const ORANGE = "#f97316";

type Props = {
  truck: TruckCardData & {
    truck_images?: TruckImage[];
    verificado?: boolean;
    avaliacao?: number;
    num_avaliacoes?: number;
    tempo_resposta?: string;
    visualizacoes?: number;
    destaque?: boolean;
  };
};

export function TruckCard({ truck }: Props) {
  const [favorito, setFavorito] = useState(false);
  const [hovered, setHovered] = useState(false);

  const title = getCardTitle(truck);
  const location = getLocation(truck);
  const price = formatMoney(truck.preco);
  const images = truck.truck_images || [];
  const mainImage = images.find((i) => i.principal)?.image_url || images[0]?.image_url;
  const photoCount = images.length;
  const truckUrl = getTruckUrl(truck);

  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const waText = encodeURIComponent(
    `Ol\u00e1, tenho interesse no caminh\u00e3o ${title}. Pode me passar mais informa\u00e7\u00f5es?`
  );
  const waLink = phone ? `https://wa.me/${phone}?text=${waText}` : "";

  const avaliacao = truck.avaliacao ?? 0;
  const numAvaliacoes = truck.num_avaliacoes ?? 0;
  const verificado = truck.verificado ?? false;
  const tempoResposta = truck.tempo_resposta ?? null;
  const visualizacoes = truck.visualizacoes ?? null;
  const destaque = truck.destaque ?? false;

  const ano = truck.ano_modelo || truck.ano_fabricacao || null;
  const metaExtra = [truck.carroceria || truck.tracao].filter(Boolean).join(" · ");

  return (
    <article
      className={`tc ${destaque ? "tc--destaque" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Foto */}
      <Link href={truckUrl} className="tc-photo" aria-label={title}>
        {mainImage ? (
          <Image
            src={mainImage}
            alt={title}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            style={{
              objectFit: "cover",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform .4s ease",
            }}
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

        {/* Overlay gradiente */}
        <span className="tc-overlay" aria-hidden="true">
          <span className="tc-price">{price}</span>
          {location && (
            <span className="tc-loc">
              <MapPin size={10} style={{ display: "inline", marginRight: 2 }} />
              {location}
            </span>
          )}
        </span>

        {/* Ribbon destaque */}
        {destaque && (
          <span className="tc-ribbon" aria-label="An\u00FAncio em destaque">⭐ Destaque</span>
        )}

        {/* Contador de fotos */}
        {photoCount > 0 && (
          <span className="tc-photo-badge" aria-label={`${photoCount} fotos`}>
            <Camera size={10} aria-hidden="true" />
            {photoCount}
          </span>
        )}

        {/* Visualiza\u00e7\u00f5es */}
        {visualizacoes !== null && visualizacoes > 0 && (
          <span className="tc-views-badge" aria-label={`${visualizacoes} visualiza\u00e7\u00f5es`}>
            <Eye size={10} aria-hidden="true" />
            {visualizacoes}
          </span>
        )}
      </Link>

      {/* Bot\u00e3o favoritar */}
      <button
        className={`tc-fav ${favorito ? "tc-fav--ativo" : ""}`}
        aria-label={favorito ? "Remover dos favoritos" : "Salvar nos favoritos"}
        onClick={(e) => { e.preventDefault(); setFavorito((f) => !f); }}
      >
        <Heart size={16} fill={favorito ? "currentColor" : "none"} />
      </button>

      {/* Body */}
      <div className="tc-body">
        {/* Avalia\u00e7\u00f5es */}
        {numAvaliacoes > 0 && (
          <div className="tc-rating" aria-label={`Avalia\u00e7\u00e3o: ${avaliacao} de 5`}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={11}
                fill={s <= Math.round(avaliacao) ? "#f59e0b" : "none"}
                stroke={s <= Math.round(avaliacao) ? "#f59e0b" : "#9ca3af"}
              />
            ))}
            <span className="tc-rating-num">{avaliacao.toFixed(1)}</span>
            <span className="tc-rating-count">({numAvaliacoes})</span>
          </div>
        )}

        <h2 className="tc-name">{title}</h2>

        {/* Meta: Ano com \u00edcone Calendar laranja */}
        <p className="tc-meta">
          {ano && (
            <span className="tc-meta-item">
              <Calendar size={16} color={ORANGE} aria-hidden="true" />
              {ano}
            </span>
          )}
          {metaExtra && (
            <span className="tc-meta-item tc-meta-extra">{metaExtra}</span>
          )}
        </p>

        {/* Localiza\u00e7\u00e3o com \u00edcone MapPin laranja no body */}
        {location && (
          <p className="tc-location">
            <MapPin size={16} color={ORANGE} aria-hidden="true" />
            {location}
          </p>
        )}

        {/* Trust indicators */}
        <div className="tc-trust">
          {verificado && (
            <span className="tc-badge tc-badge--verificado">
              <ShieldCheck size={16} color={ORANGE} />
              Verificado
            </span>
          )}
          {tempoResposta && (
            <span className="tc-badge tc-badge--resposta">
              <Clock size={12} />
              {tempoResposta}
            </span>
          )}
        </div>

        {/* A\u00e7\u00f5es */}
        <div className="tc-actions">
          <Link href={truckUrl} className="tc-btn">Ver detalhes</Link>
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="tc-wa"
              aria-label="Contato pelo WhatsApp"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.563 4.14 1.546 5.877L.057 23.886l6.187-1.621A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.045-1.393l-.361-.215-3.735.979.995-3.638-.235-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
              Falar
            </a>
          )}
        </div>
      </div>

      <style>{`
        .tc {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: var(--card, #fff);
          box-shadow: 0 1px 4px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.06);
          transition: box-shadow .25s ease, transform .25s ease;
        }
        .tc:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,.14), 0 0 0 1px rgba(0,0,0,.08);
          transform: translateY(-2px);
        }
        .tc--destaque {
          box-shadow: 0 0 0 2px #ffc857, 0 4px 16px rgba(255,200,87,.25);
        }
        .tc--destaque:hover {
          box-shadow: 0 0 0 2px #ffc857, 0 10px 32px rgba(255,200,87,.35);
        }

        /* Foto */
        .tc-photo {
          position: relative;
          display: block;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: var(--soft, #f1f5f9);
        }
        .tc-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(0,0,0,.65) 0%, transparent 55%);
          display: flex; flex-direction: column;
          justify-content: flex-end; padding: 10px 10px 8px;
          pointer-events: none;
        }
        .tc-price {
          color: #fff; font-size: 15px; font-weight: 700;
          text-shadow: 0 1px 3px rgba(0,0,0,.4);
          line-height: 1.2;
        }
        .tc-loc {
          color: rgba(255,255,255,.85); font-size: 11px;
          display: flex; align-items: center; margin-top: 2px;
        }
        .tc-ribbon {
          position: absolute; top: 10px; left: 0; z-index: 3;
          background: #ffc857; color: #1a3a52;
          font-size: 10px; font-weight: 700;
          padding: 3px 10px 3px 8px;
          border-radius: 0 999px 999px 0;
          box-shadow: 0 2px 6px rgba(0,0,0,.2);
        }
        .tc-photo-badge {
          position: absolute; bottom: 9px; left: 9px; z-index: 2;
          display: inline-flex; align-items: center; gap: 4px;
          height: 22px; padding: 0 8px; border-radius: 999px;
          background: rgba(0,0,0,.52); color: #fff;
          font-size: 11px; font-weight: 600; backdrop-filter: blur(4px);
          pointer-events: none;
        }
        .tc-views-badge {
          position: absolute; bottom: 9px; right: 9px; z-index: 2;
          display: inline-flex; align-items: center; gap: 4px;
          height: 22px; padding: 0 8px; border-radius: 999px;
          background: rgba(0,0,0,.52); color: #fff;
          font-size: 11px; font-weight: 600; backdrop-filter: blur(4px);
          pointer-events: none;
        }

        /* Favoritar */
        .tc-fav {
          position: absolute; top: 10px; right: 10px; z-index: 4;
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.9); backdrop-filter: blur(6px);
          border: none; cursor: pointer;
          color: #9ca3af;
          box-shadow: 0 1px 4px rgba(0,0,0,.15);
          transition: color .2s, transform .2s;
        }
        .tc-fav:hover { transform: scale(1.15); }
        .tc-fav--ativo { color: #ef4444; }

        /* Body */
        .tc-body { padding: 10px 12px 12px; }

        /* Avalia\u00e7\u00f5es */
        .tc-rating {
          display: flex; align-items: center; gap: 2px;
          margin-bottom: 4px;
        }
        .tc-rating-num {
          font-size: 12px; font-weight: 700;
          color: #f59e0b; margin-left: 3px;
        }
        .tc-rating-count {
          font-size: 11px; color: var(--muted, #6b7280);
        }

        .tc-name {
          font-size: 14px; font-weight: 700;
          line-height: 1.3; margin: 0 0 3px;
          color: var(--fg, #111);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* Meta: ano + extra */
        .tc-meta {
          display: flex; align-items: center; flex-wrap: wrap;
          gap: 6px; margin: 0 0 5px;
          font-size: 12px; color: var(--muted, #6b7280);
        }
        .tc-meta-item {
          display: inline-flex; align-items: center; gap: 4px;
        }
        .tc-meta-extra::before { content: "\u00b7"; margin-right: 2px; }

        /* Localiza\u00e7\u00e3o no body */
        .tc-location {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; color: var(--muted, #6b7280);
          margin: 0 0 8px;
        }

        /* Trust badges */
        .tc-trust {
          display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px;
        }
        .tc-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 10px; font-weight: 600;
          padding: 2px 7px; border-radius: 999px;
        }
        .tc-badge--verificado {
          background: #fff7ed; color: #c2410c;
        }
        .tc-badge--resposta {
          background: #e0f2fe; color: #0369a1;
        }

        /* A\u00e7\u00f5es */
        .tc-actions {
          display: flex; gap: 7px;
        }
        .tc-btn {
          flex: 1;
          display: inline-flex; align-items: center; justify-content: center;
          height: 34px; border-radius: 8px;
          background: #1a3a52; color: #fff;
          font-size: 12px; font-weight: 600;
          text-decoration: none;
          transition: background .2s;
        }
        .tc-btn:hover { background: #0f2538; }
        .tc-wa {
          display: inline-flex; align-items: center; gap: 5px;
          height: 34px; padding: 0 12px; border-radius: 8px;
          background: #25d366; color: #fff;
          font-size: 12px; font-weight: 600;
          text-decoration: none;
          transition: background .2s;
        }
        .tc-wa:hover { background: #1ebe5d; }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .tc { background: var(--card, #1e293b); }
          .tc-fav { background: rgba(30,41,59,.9); color: #64748b; }
          .tc-badge--verificado { background: #431407; color: #fb923c; }
          .tc-badge--resposta { background: #0c4a6e; color: #7dd3fc; }
        }
      `}</style>
    </article>
  );
}
