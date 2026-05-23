"use client";

import { useState } from "react";
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
          <img src={selected} alt={title} style={styles.mainImage} />
        ) : (
          <div style={styles.noImage}>Sem foto</div>
        )}
      </div>

      {validImages.length > 1 && (
        <div style={styles.thumbGrid}>
          {validImages.map((image, index) => {
            const active = image.image_url === selected;

            return (
              <button
                key={`${image.image_url}-${index}`}
                type="button"
                onClick={() => setSelected(image.image_url || "")}
                style={{
                  ...styles.thumbButton,
                  border: active
                    ? "2px solid #22c55e"
                    : "1px solid rgba(255,255,255,.12)",
                }}
                title={`Ver foto ${index + 1}`}
              >
                <img
                  src={image.image_url || ""}
                  alt={`${title} - foto ${index + 1}`}
                  style={styles.thumb}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  gallery: {
    display: "grid",
    gap: 16,
  },
  mainImageWrap: {
    height: 520,
    borderRadius: 28,
    overflow: "hidden",
    background: "rgba(15,23,42,.72)",
    border: "1px solid rgba(255,255,255,.10)",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
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
    background: "rgba(15,23,42,.75)",
    cursor: "pointer",
  },
  thumb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
};
