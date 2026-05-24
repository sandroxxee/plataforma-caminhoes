"use client";

import { useState } from "react";

type Props = {
  title: string;
  text?: string;
};

export function ShareAdButton({ title, text }: Props) {
  const [copied, setCopied] = useState(false);

  async function shareAd() {
    const url = window.location.href;
    const message = text || `Olha esse anúncio: ${title}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: message,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(`${message}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${message}\n${url}`)}`, "_blank");
    }
  }

  function shareWhatsapp() {
    const url = window.location.href;
    const message = text || `Olha esse anúncio: ${title}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(`${message}\n${url}`)}`, "_blank");
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
        .share-box {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-top: 12px;
        }

        .share-main,
        .share-whatsapp {
          width: 100%;
          min-height: 50px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.12);
          cursor: pointer;
          font-weight: 950;
          font-size: 15px;
        }

        .share-main {
          background: rgba(255,255,255,.08);
          color: white;
        }

        .share-whatsapp {
          background: rgba(34,197,94,.12);
          color: #86efac;
          border-color: rgba(34,197,94,.25);
        }

        @media (max-width: 640px) {
          .share-main,
          .share-whatsapp {
            min-height: 52px;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}
