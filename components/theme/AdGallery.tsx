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

  return (
    <div className="ad-gallery">
      <div className="ad-gallery-main">
        {selected ? <img src={selected} alt={title} /> : <span>Sem foto</span>}
      </div>

      {validImages.length > 1 ? (
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
              >
                <img src={image.image_url || ""} alt={`${title} - foto ${index + 1}`} />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
