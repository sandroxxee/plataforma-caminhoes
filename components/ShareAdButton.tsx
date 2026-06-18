"use client";

import { useState } from "react";

type Props = {
  title: string;
  text?: string;
};

export function ShareAdButton({ title, text }: Props) {
  const [copied, setCopied] = useState(false);

  function getMessage() {
    const url = window.location.href;
    const message = text || `Olha esse anúncio: ${title}`;
    return `${message}\n${url}`;
  }

  async function shareAd() {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: text || `Olha esse anúncio: ${title}`,
          url: window.location.href,
        });
        return;
      }

      await navigator.clipboard.writeText(getMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      shareWhatsapp();
    }
  }

  function shareWhatsapp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(getMessage())}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="share-box">
      <button type="button" onClick={shareAd} className="share-main">
        {copied ? "Link copiado ✓" : "Compartilhar anúncio"}
      </button>

      <button type="button" onClick={shareWhatsapp} className="share-whatsapp">
        Encaminhar no WhatsApp
      </button>

      <style>{`
        .share-box{display:grid;grid-template-columns:1fr;gap:10px;margin-top:10px}.share-main,.share-whatsapp{width:100%;min-height:48px;border-radius:999px;cursor:pointer;font-weight:950;font-size:14px}.share-main{background:var(--surface-soft);color:var(--text);border:1px solid var(--border)}.share-whatsapp{background:var(--surface);color:#0c7a3a;border:1px solid rgba(37,211,102,.45)}@media(max-width:640px){.share-main,.share-whatsapp{min-height:52px}}
      `}</style>
    </div>
  );
}
