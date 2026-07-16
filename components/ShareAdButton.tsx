"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

type Props = {
  title: string;
  text?: string;
  className?: string;
};

export function ShareAdButton({ title, text, className = "share-btn" }: Props) {
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
    <button type="button" onClick={shareAd} className={className}>
      {copied ? (
        <>
          <Check size={16} strokeWidth={3} />
          <span>Copiado!</span>
        </>
      ) : (
        <>
          <Share2 size={16} strokeWidth={2.5} />
          <span>Compartilhar</span>
        </>
      )}
    </button>
  );
}
