"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FeaturedTruck = {
  id: string;
  title: string;
  image: string;
  price: string;
  location: string;
  meta: string;
};

type HomeFeaturedSliderProps = {
  trucks: FeaturedTruck[];
};

export function HomeFeaturedSlider({ trucks }: HomeFeaturedSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (trucks.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrent((value) => (value + 1) % trucks.length);
    }, 5000);  // Mudado de 3000ms para 5000ms

    return () => window.clearInterval(interval);
  }, [trucks.length]);

  const visibleTrucks = useMemo(() => {
    if (!trucks.length) return [];
    const amount = Math.min(3, trucks.length);
    return Array.from({ length: amount }, (_, index) => trucks[(current + index) % trucks.length]);
  }, [current, trucks]);

  if (!trucks.length) {
    return (
      <section className="featuredSlider emptySlider">
        <div>
          <span>Anúncios em destaque</span>
          <h2>Os caminhões aprovados aparecerão aqui.</h2>
        </div>
        <style>{sliderCss}</style>
      </section>
    );
  }

  return (
    <section className="featuredSlider">
      <div className="featuredGrid">
        {visibleTrucks.map((truck, truckIndex) => (
          <article className="featuredCard" key={truck.id}>
            <Link href={`/anuncios/${truck.id}`} className="featuredImage">
              {truck.image ? (
                <img 
                  src={truck.image} 
                  alt={truck.title}
                  fetchPriority={truckIndex === 0 ? "high" : "auto"}
                  loading={truckIndex === 0 ? "eager" : "lazy"}
                />
              ) : <span>Sem foto</span>}
            </Link>

            <div className="featuredInfo">
              <span>Anúncio em destaque</span>
              <Link href={`/anuncios/${truck.id}`} className="featuredTitle">{truck.title}</Link>
              <p>{truck.meta}</p>
              <strong>{truck.price}</strong>
              <small>{truck.location}</small>
            </div>
          </article>
        ))}
      </div>

      <div className="sliderDots" aria-label="Indicadores do slide">
        {trucks.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Mostrar grupo de destaque ${index + 1}`}
            className={index === current ? "active" : ""}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>

      <style>{sliderCss}</style>
    </section>
  );
}

const sliderCss = `
  .featuredSlider{position:relative;border-radius:22px;background:linear-gradient(135deg,rgba(16,23,26,.90),rgba(5,10,11,.86));border:1px solid rgba(255,255,255,.10);box-shadow:0 20px 58px rgba(0,0,0,.24);padding:14px 14px 34px;overflow:hidden;isolation:isolate}
  .featuredSlider::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 16% 8%,rgba(34,197,94,.14),transparent 30%),linear-gradient(120deg,rgba(34,197,94,.07),transparent 38%);z-index:-1}
  .featuredGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
  .featuredCard{overflow:hidden;border-radius:16px;background:linear-gradient(180deg,rgba(12,18,20,.96),rgba(6,10,12,.95));border:1px solid rgba(255,255,255,.11);box-shadow:0 14px 34px rgba(0,0,0,.20)}
  .featuredImage{position:relative;aspect-ratio:1.45/1;display:grid;place-items:center;overflow:hidden;background:#111827;color:#94a3b8;text-decoration:none;font-weight:950}
  .featuredImage img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(1.04) contrast(1.03)}
  .featuredInfo{padding:14px;display:grid;gap:8px}
  .featuredInfo span{width:max-content;max-width:100%;display:inline-flex;align-items:center;min-height:25px;padding:0 9px;border-radius:999px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.28);color:#bbf7d0;font-size:10px;font-weight:950;letter-spacing:.06em;text-transform:uppercase}
  .featuredTitle{min-height:42px;color:white;text-decoration:none;font-size:17px;line-height:1.18;font-weight:950;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .featuredInfo p{margin:0;color:#cbd5e1;font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .featuredInfo strong{display:block;color:#22c55e;font-size:24px;line-height:1}
  .featuredInfo small{display:block;color:#d7dee8;font-size:12px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .sliderDots{position:absolute;left:18px;bottom:14px;display:flex;gap:8px;z-index:3}
  .sliderDots button{width:8px;height:8px;border-radius:999px;border:0;background:rgba(255,255,255,.38);cursor:pointer;padding:0}
  .sliderDots button.active{width:26px;background:#22c55e}
  .emptySlider{display:flex;align-items:center;min-height:160px;padding:24px}.emptySlider span{color:#86efac;font-size:12px;font-weight:950;text-transform:uppercase}.emptySlider h2{margin:10px 0 0;font-size:30px}
  @media(max-width:900px){.featuredGrid{grid-template-columns:1fr 1fr}.featuredCard:nth-child(3){display:none}}
  @media(max-width:640px){.featuredSlider{padding:12px 12px 32px}.featuredGrid{grid-template-columns:1fr}.featuredCard:nth-child(2),.featuredCard:nth-child(3){display:none}.featuredImage{aspect-ratio:1.35/1}.featuredInfo strong{font-size:23px}}
`;
