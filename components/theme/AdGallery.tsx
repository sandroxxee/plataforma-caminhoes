"use client";

import { useState } from "react";
import type { TruckImage } from "./TruckCard";

type Props = {
  title: string;
  images: TruckImage[];
};

export function AdGallery({ title, images }: Props) {
  const validImages = [...images]
    .filter((img) => img.image_url)
    .sort((a, b) => {
      if (a.principal && !b.principal) return -1;
      if (!a.principal && b.principal) return 1;
      return (a.ordem || 0) - (b.ordem || 0);
    });

  const firstImage = validImages[0]?.image_url || "";
  const [selected, setSelected] = useState(firstImage);
  const hasMultiple = validImages.length > 1;

  return (
    <div className="ad-gallery">
      <div className="ad-gallery-main">
        {selected ? (
          <img
            src={selected}
            alt={title}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
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
      </div>

      {hasMultiple && (
        <div className="ad-gallery-thumbs">
          {validImages.map((image, index) => {
            const active = image.image_url === selected;
            return (
              <button
                key={`${image.image_url}-${index}`}
                type="button"
                onClick={() => setSelected(image.image_url || "")}
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
          border-radius: 16px;
          overflow: hidden;
          background: var(--soft);
          aspect-ratio: 16/10;
          position: relative;
        }
        .ad-gallery-main img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: opacity .2s;
        }
        .ad-gallery-empty {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 10px; color: var(--muted);
          font-size: 13px; font-weight: 700;
        }
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
        .ad-gallery-thumbs button:not(.active) { opacity: .65; }
        .ad-gallery-thumbs button.active,
        .ad-gallery-thumbs button:hover { border-color: var(--blue); opacity: 1; }
        .ad-gallery-thumbs button img { width: 100%; height: 100%; object-fit: cover; display: block; }
        @media (max-width: 560px) {
          .ad-gallery-thumbs button { width: 60px; height: 46px; }
        }
      `}</style>
    </div>
  );
}
