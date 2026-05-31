"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
    }, 3000);

    return () => window.clearInterval(interval);
  }, [trucks.length]);

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

  const truck = trucks[current];

  return (
    <section className="featuredSlider">
      <div className="sliderImage">
        {truck.image ? <img src={truck.image} alt={truck.title} /> : <span>Sem foto</span>}
      </div>

      <div className="sliderInfo">
        <span>Anúncio em destaque</span>
        <h2>{truck.title}</h2>
        <p>{truck.meta}</p>
        <strong>{truck.price}</strong>
        <small>{truck.location}</small>
        <Link href={`/anuncios/${truck.id}`}>Ver detalhes →</Link>
      </div>

      <div className="sliderDots" aria-label="Indicadores do slide">
        {trucks.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Mostrar anúncio ${index + 1}`}
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
  .featuredSlider{position:relative;min-height:360px;border-radius:24px;overflow:hidden;background:linear-gradient(135deg,rgba(16,23,26,.96),rgba(5,10,11,.94));border:1px solid rgba(255,255,255,.12);box-shadow:0 24px 70px rgba(0,0,0,.30);display:grid;grid-template-columns:1.15fr .85fr;isolation:isolate}
  .featuredSlider::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 18% 20%,rgba(34,197,94,.18),transparent 28%),linear-gradient(120deg,rgba(34,197,94,.10),transparent 38%);z-index:-1}
  .sliderImage{min-height:360px;background:#111827;overflow:hidden;display:grid;place-items:center;color:#94a3b8;font-weight:950}
  .sliderImage img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(1.06) contrast(1.04)}
  .sliderInfo{padding:clamp(24px,4vw,42px);display:flex;flex-direction:column;justify-content:center;align-items:flex-start}
  .sliderInfo span{display:inline-flex;align-items:center;min-height:30px;padding:0 11px;border-radius:999px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.30);color:#bbf7d0;font-size:11px;font-weight:950;letter-spacing:.07em;text-transform:uppercase}
  .sliderInfo h2{margin:16px 0 10px;font-size:clamp(28px,3.6vw,48px);line-height:1.02;letter-spacing:-.045em;text-wrap:balance}
  .sliderInfo p{margin:0 0 12px;color:#cbd5e1;line-height:1.5;font-weight:800}
  .sliderInfo strong{display:block;color:#22c55e;font-size:clamp(28px,3vw,42px);line-height:1;margin-bottom:8px}
  .sliderInfo small{display:block;color:#d7dee8;font-size:14px;font-weight:900;margin-bottom:18px}
  .sliderInfo a{min-height:46px;padding:0 16px;border-radius:11px;background:#22c55e;color:#052e16;text-decoration:none;font-weight:950;display:inline-flex;align-items:center;text-transform:uppercase;font-size:12px;letter-spacing:.04em}
  .sliderDots{position:absolute;left:18px;bottom:18px;display:flex;gap:8px;z-index:3}
  .sliderDots button{width:9px;height:9px;border-radius:999px;border:0;background:rgba(255,255,255,.42);cursor:pointer;padding:0}
  .sliderDots button.active{width:28px;background:#22c55e}
  .emptySlider{display:flex;align-items:center;padding:30px}.emptySlider span{color:#86efac;font-size:12px;font-weight:950;text-transform:uppercase}.emptySlider h2{margin:10px 0 0;font-size:30px}
  @media(max-width:900px){.featuredSlider{grid-template-columns:1fr}.sliderImage{min-height:240px}.sliderDots{top:218px;bottom:auto}.sliderInfo{padding:24px 18px 26px}}
`;
