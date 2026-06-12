"use client";

import { useState } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";

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
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  const principal =
    validImages.find((img) => img.principal)?.image_url ||
    validImages[0]?.image_url ||
    "";

  const [selected, setSelected] = useState(principal);

  return (
    <div style={styles.gallery}>
      <div style={styles.mainImageWrap}>
        {selected ? (
          isSupabaseUrl(selected) ? (
            <Image
              src={selected}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 70vw"
              style={{ objectFit: "contain", objectPosition: "center", padding: 10 }}
            />
          ) : (
            <img src={selected} alt={title} style={styles.mainImage} />
          )
        ) : (
          <div style={styles.noImage}>Sem foto</div>
        )}
      </div>

      {validImages.length > 1 && (
        <div style={styles.thumbGrid}>
          {validImages.map((image, index) => {
            const active = image.image_url === selected;
            const url = image.image_url || "";

            return (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() => setSelected(url)}
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
                  <img
                    src={url}
                    alt={`${title} - foto ${index + 1}`}
                    style={styles.thumb}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
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
    gridTemplateColumns: "repeat(5,1fr)",
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
