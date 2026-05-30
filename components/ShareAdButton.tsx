"use client";

import { useState } from "react";

type Props = {
  title: string;
  text?: string;
  imageUrl?: string;
};

export function ShareAdButton({ title, text, imageUrl }: Props) {
  const [status, setStatus] = useState("");

  function getMessage() {
    const url = window.location.href;
    const message = text || `Olha esse anúncio: ${title}`;
    return `${message}\n${url}`;
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(getMessage());
      setStatus("Texto copiado ✓ Agora abra o Facebook e cole na publicação.");
      setTimeout(() => setStatus(""), 3000);
    } catch {
      setStatus("Não consegui copiar o texto. Selecione e copie manualmente.");
    }
  }

  async function copyImage() {
    if (!imageUrl) {
      setStatus("Esse anúncio ainda não tem foto para copiar.");
      return;
    }

    try {
      if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
        throw new Error("Clipboard de imagem não suportado neste navegador.");
      }

      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      const imageBlob = blob.type === "image/png" ? blob : new Blob([blob], { type: blob.type || "image/jpeg" });

      await navigator.clipboard.write([
        new ClipboardItem({ [imageBlob.type]: imageBlob }),
      ]);

      setStatus("Foto copiada ✓ Agora abra o Facebook e aperte Ctrl + V na publicação.");
      setTimeout(() => setStatus(""), 4200);
    } catch (error) {
      console.error(error);
      setStatus("O navegador não deixou copiar a foto direto. Abri a imagem para você copiar ou salvar manualmente.");
      window.open(imageUrl, "_blank");
    }
  }

  async function copyTextAndImage() {
    await copyText();
    await copyImage();
  }

  function openFacebook() {
    window.open("https://www.facebook.com/", "_blank", "noopener,noreferrer");
  }

  function openFacebookShare() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
  }

  function shareWhatsapp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(getMessage())}`, "_blank", "noopener,noreferrer");
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

      await copyText();
    } catch {
      shareWhatsapp();
    }
  }

  return (
    <div className="share-box">
      <button type="button" onClick={shareAd} className="share-main">
        Compartilhar anúncio
      </button>

      <div className="facebook-box">
        <strong>Preparar Facebook</strong>
        <p>Copie o texto e a foto, abra o Facebook, entre no grupo/página e cole na publicação.</p>

        <div className="facebook-actions">
          <button type="button" onClick={copyText}>
            Copiar texto
          </button>
          <button type="button" onClick={copyImage} disabled={!imageUrl}>
            Copiar foto principal
          </button>
          <button type="button" onClick={copyTextAndImage} disabled={!imageUrl}>
            Copiar texto + foto
          </button>
          <button type="button" onClick={openFacebook}>
            Abrir Facebook
          </button>
          <button type="button" onClick={openFacebookShare}>
            Compartilhar link
          </button>
        </div>

        {status && <small>{status}</small>}
      </div>

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
        .share-whatsapp,
        .facebook-actions button {
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

        .facebook-box {
          padding: 14px;
          border-radius: 16px;
          border: 1px solid rgba(59,130,246,.28);
          background: rgba(30,64,175,.16);
          display: grid;
          gap: 10px;
        }

        .facebook-box strong {
          color: #dbeafe;
          font-size: 15px;
        }

        .facebook-box p {
          margin: 0;
          color: #bfdbfe;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 750;
        }

        .facebook-box small {
          color: #d9f99d;
          line-height: 1.45;
          font-weight: 900;
        }

        .facebook-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .facebook-actions button {
          min-height: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,.1);
          color: white;
          font-size: 13px;
        }

        .facebook-actions button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .share-main,
          .share-whatsapp {
            min-height: 52px;
            font-size: 15px;
          }

          .facebook-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
