"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TruckImage } from "./TruckCard";
import { formatImageUrl } from "@/lib/truck-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Image from "next/image";

const AUTOPLAY_INTERVAL = 3500;

type Props = {
  title: string;
  images: TruckImage[];
};

export function AdGallery({ title, images }: Props) {
  const validImages = [...images]
    .filter((img) => img.image_url)
    .map((img) => ({
      ...img,
      image_url: formatImageUrl(img.image_url),
    }))
    .sort((a, b) => {
      if (a.principal && !b.principal) return -1;
      if (!a.principal && b.principal) return 1;
      return (a.ordem || 0) - (b.ordem || 0);
    });

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [paused, setPaused]           = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasMultiple = validImages.length > 1;

  const goTo = useCallback((idx: number) => {
    setSelectedIdx(idx);
  }, []);

  // Autoplay
  useEffect(() => {
    if (!hasMultiple || paused) return;
    intervalRef.current = setInterval(() => {
      setSelectedIdx((i) => (i + 1) % validImages.length);
    }, AUTOPLAY_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hasMultiple, paused, validImages.length]);

  const pause  = () => setPaused(true);
  const resume = () => setPaused(false);

  const selected = validImages[selectedIdx]?.image_url || "";

  return (
    <div
      className="ad-gallery"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <div className="ad-gallery-main">
        {selected ? (
          <>
            <Image
              src={selected}
              alt={`${title} - foto ${selectedIdx + 1}`}
              fill
              priority
              style={{ objectFit: "contain" }}
              sizes="(max-width: 1200px) 100vw, 800px"
            />
            {hasMultiple && (
              <>
                <button
                  type="button"
                  className="ad-gallery-nav nav-prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    const prev = (selectedIdx - 1 + validImages.length) % validImages.length;
                    goTo(prev);
                    pause();
                  }}
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={20} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  className="ad-gallery-nav nav-next"
                  onClick={(e) => {
                    e.stopPropagation();
                    const next = (selectedIdx + 1) % validImages.length;
                    goTo(next);
                    pause();
                  }}
                  aria-label="Próxima foto"
                >
                  <ChevronRight size={20} strokeWidth={2.5} />
                </button>
              </>
            )}
          </>
        ) : (
          <span className="ad-gallery-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="2" y="7" width="20" height="13" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
            Sem foto
          </span>
        )}

        {/* Indicadores de ponto */}
        {hasMultiple && (
          <div className="ad-gallery-dots" aria-hidden="true">
            {validImages.map((_, i) => (
              <span key={i} className={`ad-dot${i === selectedIdx ? " active" : ""}`} />
            ))}
          </div>
        )}
      </div>

      {hasMultiple && (
        <div className="ad-gallery-thumbs" role="list">
          {validImages.map((image, index) => {
            const active = index === selectedIdx;
            return (
              <button
                key={`${image.image_url}-${index}`}
                type="button"
                role="listitem"
                onClick={() => { goTo(index); pause(); }}
                className={active ? "active" : ""}
                aria-label={`Ver foto ${index + 1}`}
                aria-pressed={active}
              >
                <img
                  src={image.image_url || ""}
                  alt={`${title} - foto ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        .ad-gallery { display: grid; gap: 10px; }

        .ad-gallery-main {
          border-radius: 16px; overflow: hidden;
          background: #0b0f17;
          aspect-ratio: 16/10;
          position: relative;
        }
        .ad-gallery-main img {
          width: 100%; height: 100%;
          object-fit: contain; display: block;
          transition: opacity .25s;
        }
        
        /* Setas de navegação na galeria principal */
        .ad-gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(15,23,42,0.45);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          z-index: 10;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .ad-gallery-nav:hover {
          background: rgba(15,23,42,0.7);
          transform: translateY(-50%) scale(1.05);
        }
        .ad-gallery-nav:active {
          transform: translateY(-50%) scale(0.95);
        }
        .nav-prev {
          left: 12px;
        }
        .nav-next {
          right: 12px;
        }
        
        .ad-gallery-empty {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 10px; color: var(--muted);
          font-size: 13px; font-weight: 700;
        }

        /* Dots */
        .ad-gallery-dots {
          position: absolute; bottom: 12px; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 5px; align-items: center;
        }
        .ad-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,.5);
          transition: background .2s, width .2s;
          flex-shrink: 0;
        }
        .ad-dot.active {
          background: #fff;
          width: 18px; border-radius: 3px;
        }

        /* Thumbs */
        .ad-gallery-thumbs {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .ad-gallery-thumbs button {
          width: 72px; height: 54px;
          border-radius: 10px; overflow: hidden;
          border: 2px solid transparent; padding: 0;
          background: var(--soft); cursor: pointer;
          transition: border-color .14s, opacity .14s;
          flex-shrink: 0;
        }
        .ad-gallery-thumbs button:not(.active) { opacity: .6; }
        .ad-gallery-thumbs button.active,
        .ad-gallery-thumbs button:hover { border-color: var(--blue); opacity: 1; }
        .ad-gallery-thumbs button img { width: 100%; height: 100%; object-fit: cover; display: block; }

        @media (max-width: 768px) {
          .ad-gallery-main {
            aspect-ratio: 16/12;
          }
          .ad-gallery-thumbs {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
