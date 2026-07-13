"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { formatImageUrl } from "@/lib/truck-utils";

type TruckImage = {
  image_url: string | null;
  principal: boolean | null;
  ordem: number | null;
};

type Props = {
  title: string;
  images: TruckImage[];
};

function isSupabaseUrl(url: string) {
  return url.includes(".supabase.co/storage/v1/object/public/");
}

export function TruckGallery({ title, images }: Props) {
  const validImages = [...images]
    .filter((img) => img.image_url)
    .map((img) => ({
      ...img,
      image_url: formatImageUrl(img.image_url),
    }))
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  const principalIndex = validImages.findIndex((img) => img.principal) ?? 0;
  const startIndex = principalIndex >= 0 ? principalIndex : 0;

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [selected, setSelected] = useState(
    validImages[startIndex]?.image_url || ""
  );
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const goToIndex = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      setSelected(validImages[index]?.image_url || "");
    },
    [validImages]
  );

  const nextImage = useCallback(() => {
    const next = (currentIndex + 1) % validImages.length;
    goToIndex(next);
  }, [currentIndex, validImages.length, goToIndex]);

  const prevImage = useCallback(() => {
    const prev = (currentIndex - 1 + validImages.length) % validImages.length;
    goToIndex(prev);
  }, [currentIndex, validImages.length, goToIndex]);

  // Autoplay: troca a foto a cada 5 segundos (apenas se lightbox estiver fechado)
  useEffect(() => {
    if (validImages.length <= 1 || isLightboxOpen) return;
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, [validImages.length, isLightboxOpen, nextImage]);

  // Teclas de atalho para o Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);

  return (
    <div style={styles.gallery} className="truck-gallery-wrap">
      <div style={styles.mainImageWrap} className="main-wrap" onClick={() => setIsLightboxOpen(true)}>
        {selected ? (
          <>
            {isSupabaseUrl(selected) ? (
              <Image
                src={selected}
                alt={title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 70vw"
                style={{ objectFit: "contain", objectPosition: "center", padding: 10 }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected}
                alt={title}
                style={styles.mainImage}
              />
            )}
            <div className="gallery-expand-hint">
              <Maximize2 size={20} />
              Clique para ampliar
            </div>
          </>
        ) : (
          <div style={styles.noImage}>Sem foto</div>
        )}
      </div>

      {validImages.length > 1 && (
        <div style={styles.thumbGrid} className="thumb-grid">
          {validImages.map((image, index) => {
            const active = index === currentIndex;
            const url = image.image_url || "";

            return (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() => goToIndex(index)}
                className="thumb-btn"
                style={{
                  ...styles.thumbButton,
                  border: active
                    ? "2px solid #22c55e"
                    : "1px solid rgba(255,255,255,.12)",
                }}
                title={`Ver foto ${index + 1}`}
              >
                {isSupabaseUrl(url) ? (
                  <Image
                    src={url}
                    alt={`${title} - foto ${index + 1}`}
                    width={200}
                    height={110}
                    loading="lazy"
                    style={{ objectFit: "contain", width: "100%", height: "100%", padding: 5, boxSizing: "border-box" }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt={`${title} - foto ${index + 1}`}
                    loading="lazy"
                    style={styles.thumb}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setIsLightboxOpen(false)}>
            <X size={32} />
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-nav lightbox-prev" onClick={prevImage}>
              <ChevronLeft size={48} />
            </button>
            
            <div className="lightbox-image-wrap">
              {isSupabaseUrl(selected) ? (
                <Image
                  src={selected}
                  alt={title}
                  fill
                  sizes="90vw"
                  style={{ objectFit: "contain" }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected} alt={title} className="lightbox-img" />
              )}
            </div>

            <button className="lightbox-nav lightbox-next" onClick={nextImage}>
              <ChevronRight size={48} />
            </button>

            <div className="lightbox-counter">
              {currentIndex + 1} / {validImages.length}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .truck-gallery-wrap .main-wrap {
          height: 520px;
          cursor: zoom-in;
          position: relative;
        }
        .gallery-expand-hint {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: rgba(0,0,0,0.6);
          color: white;
          padding: 8px 16px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .main-wrap:hover .gallery-expand-hint {
          opacity: 1;
        }
        @media (max-width: 768px) {
          .truck-gallery-wrap .main-wrap {
            height: 320px;
          }
          .truck-gallery-wrap .thumb-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
          }
          .truck-gallery-wrap .thumb-btn {
            height: 72px;
          }
          .gallery-expand-hint { display: none; }
        }
        @media (max-width: 420px) {
          .truck-gallery-wrap .main-wrap {
            height: 240px;
          }
          .truck-gallery-wrap .thumb-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
          }
          .truck-gallery-wrap .thumb-btn {
            height: 60px;
          }
        }

        /* Lightbox Styles */
        .lightbox-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
        }
        .lightbox-close {
          position: absolute;
          top: 20px; right: 20px;
          background: none; border: none;
          color: white; cursor: pointer;
          z-index: 10000;
          padding: 10px;
          transition: transform 0.2s;
        }
        .lightbox-close:hover { transform: scale(1.1); }
        .lightbox-content {
          position: relative;
          width: 90vw;
          height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lightbox-image-wrap {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .lightbox-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .lightbox-nav {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.1);
          border: none; color: white;
          width: 64px; height: 64px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          z-index: 10;
        }
        .lightbox-nav:hover { background: rgba(255,255,255,0.2); transform: translateY(-50%) scale(1.05); }
        .lightbox-prev { left: -80px; }
        .lightbox-next { right: -80px; }
        .lightbox-counter {
          position: absolute;
          bottom: -40px;
          left: 50%; transform: translateX(-50%);
          color: white;
          font-weight: 900;
          font-size: 16px;
        }
        @media (max-width: 1100px) {
          .lightbox-prev { left: 10px; }
          .lightbox-next { right: 10px; }
          .lightbox-nav { width: 48px; height: 48px; background: rgba(0,0,0,0.5); }
        }
      `}</style>
    </div>
  );
}

const photoBackground =
  "radial-gradient(circle at 50% 46%, rgba(34,197,94,.13), transparent 44%), linear-gradient(145deg, rgba(16,23,26,.98), rgba(5,11,8,.98))";

const styles: Record<string, CSSProperties> = {
  gallery: {
    display: "grid",
    gap: 16,
  },
  mainImageWrap: {
    position: "relative",
    height: 520,
    borderRadius: 28,
    overflow: "hidden",
    background: photoBackground,
    border: "1px solid rgba(255,255,255,.10)",
    display: "grid",
    placeItems: "center",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center center",
    display: "block",
    padding: 10,
    boxSizing: "border-box",
    background: photoBackground,
  },
  noImage: {
    height: "100%",
    display: "grid",
    placeItems: "center",
    color: "#94a3b8",
    fontSize: 22,
    fontWeight: 900,
  },
  thumbGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 12,
  },
  thumbButton: {
    padding: 0,
    height: 110,
    borderRadius: 16,
    overflow: "hidden",
    background: photoBackground,
    cursor: "pointer",
  },
  thumb: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center center",
    display: "block",
    padding: 5,
    boxSizing: "border-box",
    background: photoBackground,
  },
};
