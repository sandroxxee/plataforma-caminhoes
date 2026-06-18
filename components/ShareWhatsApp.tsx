"use client";

import { Share2 } from "lucide-react";

type Props = { titulo: string; preco?: number | null; url?: string };

export function ShareWhatsApp({ titulo, preco, url }: Props) {
  function share() {
    const link = url || window.location.href;
    const valor = preco ? ` — R$${preco.toLocaleString("pt-BR")}` : "";
    const text = `🚚 ${titulo}${valor}\n${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }
  return (
    <button onClick={share} className="share-wa-btn" aria-label="Compartilhar no WhatsApp" title="Compartilhar">
      <Share2 size={15} />
      <span>Compartilhar</span>
      <style>{`
        .share-wa-btn { display:inline-flex;align-items:center;gap:6px;padding:0 16px;height:40px;border-radius:999px;background:rgba(37,211,102,.12);border:1.5px solid rgba(37,211,102,.35);color:#16a34a;font-size:13px;font-weight:800;cursor:pointer;transition:background .15s; }
        .share-wa-btn:hover { background:rgba(37,211,102,.22); }
        body.public-theme-dark .share-wa-btn { color:#4ade80; }
      `}</style>
    </button>
  );
}
