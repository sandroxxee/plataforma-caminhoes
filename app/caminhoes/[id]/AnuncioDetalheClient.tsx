"use client";

import { AdGallery } from "@/components/theme/AdGallery";
import { ViewCounter } from "@/components/ViewCounter";
import { ShareAdButton } from "@/components/ShareAdButton";
import { Camera, Heart, Check, X, MessageSquare } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import type { TruckImage } from "@/lib/truck-utils";
import { iniciarConversaAction } from "./actions";

interface GaleriaProps {
  truckId: string;
  title: string;
  images: TruckImage[];
  initialViews: number;
}

export function AnuncioGaleria({ truckId, title, images, initialViews }: GaleriaProps) {
  return (
    <div className="detail-card detail-gallery-card">
      <AdGallery title={title} images={images} />
    </div>
  );
}

interface AsideActionsProps {
  truckId: string;
  title: string;
  whatsappLink: string;
  shareText: string;
  whatsappLabel?: string;
  initialFavorito?: boolean;
  isOwner?: boolean;
}

const WaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export function AnuncioAsideActions({
  truckId,
  title,
  whatsappLink,
  shareText,
  whatsappLabel,
  initialFavorito = false,
  isOwner = false,
}: AsideActionsProps) {
  const label = whatsappLabel || "Tenho interesse neste caminhão";
  const [favoritado, setFavoritado] = useState(initialFavorito);
  const [isPending, startTransition] = useTransition();

  function toggleFavorito() {
    startTransition(async () => {
      const res = await fetch("/api/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ truck_id: truckId }),
      });
      if (res.status === 401) {
        window.location.href = "/login?next=" + encodeURIComponent(window.location.pathname);
        return;
      }
      if (res.ok) {
        const { action } = await res.json();
        setFavoritado(action === "added");
      }
    });
  }

  return (
    <>
      {whatsappLink && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="detail-whatsapp"
          aria-label={`Entrar em contato sobre ${title} pelo WhatsApp`}
          data-whatsapp-click
          data-truck-id={truckId}
        >
          <WaIcon />
          {label}
        </a>
      )}

      {/* Botão de Chat Desktop */}
      {!isOwner && (
        <form action={iniciarConversaAction.bind(null, truckId)} className="detail-chat-desktop-form">
          <button type="submit" className="detail-chat-btn-desktop">
            <MessageSquare size={16} />
            Conversar pelo Chat
          </button>
        </form>
      )}

      {/* Grid de Ações Secundárias (Compartilhar + Favoritar) */}
      <div className="action-buttons-grid">
        <ShareAdButton title={title} text={shareText} className="action-btn share-btn" />
        
        <button
          type="button"
          onClick={toggleFavorito}
          disabled={isPending}
          className={`action-btn fav-btn${favoritado ? " fav-btn--active" : ""}`}
        >
          <Heart size={16} fill={favoritado ? "#ef4444" : "none"} strokeWidth={favoritado ? 0 : 2.5} style={{ color: favoritado ? "#ef4444" : "currentColor" }} />
          <span>{favoritado ? "Favoritado" : "Favoritar"}</span>
        </button>
      </div>

      {/* Barra sticky dupla no mobile */}
      <div className="detail-mobile-sticky-bar" style={isOwner ? { gridTemplateColumns: "1fr" } : undefined}>
        {!isOwner && (
          <form action={iniciarConversaAction.bind(null, truckId)} style={{ width: "100%" }}>
            <button type="submit" className="detail-chat-sticky">
              <MessageSquare size={16} />
              Chat
            </button>
          </form>
        )}

        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="detail-wa-sticky"
            aria-label={`WhatsApp: ${title}`}
            data-whatsapp-click
            data-truck-id={truckId}
          >
            <WaIcon />
            WhatsApp
          </a>
        )}
      </div>

      <style>{`
        .detail-whatsapp {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 56px;
          border-radius: 30px !important;
          background: #25d366 !important;
          color: #fff !important;
          font-weight: 900;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35);
          margin-bottom: 12px;
        }
        .detail-whatsapp:hover {
          background: #1da851 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.45);
        }
        .detail-whatsapp:active {
          transform: scale(0.98);
        }

        /* Grid de Ações Secundárias */
        .action-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 48px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 800;
          font-size: 14px;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          outline: none;
          width: 100%;
        }

        /* Compartilhar */
        .share-btn {
          background: #f1f5f9;
          color: #334155;
          border-color: #e2e8f0;
        }
        .share-btn:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }
        .share-btn:active {
          transform: scale(0.97);
        }

        /* Favoritar */
        .fav-btn {
          background: #f1f5f9;
          color: #334155;
          border-color: #e2e8f0;
        }
        .fav-btn:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }
        .fav-btn--active {
          background: #fef2f2 !important;
          color: #ef4444 !important;
          border-color: #fca5a5 !important;
        }
        .fav-btn--active:hover {
          background: #fee2e2 !important;
        }
        .fav-btn:active {
          transform: scale(0.97);
        }

        /* Modo Escuro */
        body.public-theme-dark .share-btn,
        body.public-theme-dark .fav-btn {
          background: #1e293b;
          color: #cbd5e1;
          border-color: #334155;
        }
        body.public-theme-dark .share-btn:hover,
        body.public-theme-dark .fav-btn:hover {
          background: #334155;
        }
        body.public-theme-dark .fav-btn--active {
          background: rgba(239, 68, 68, 0.12) !important;
          color: #f87171 !important;
          border-color: rgba(239, 68, 68, 0.3) !important;
        }

        .detail-chat-desktop-form {
          width: 100%;
          margin-bottom: 12px;
        }
        .detail-chat-btn-desktop {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 52px;
          border-radius: 30px !important;
          background: var(--blue) !important;
          color: #fff !important;
          font-weight: 900;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 0;
          width: 100%;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.2);
        }
        .detail-chat-btn-desktop:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.3);
        }
        .detail-chat-btn-desktop:active {
          transform: scale(0.98);
        }
        .detail-mobile-sticky-bar {
          display: none;
        }

        .detail-wa-sticky {
          display: none;
        }

        @media (max-width: 900px) {
          .detail-whatsapp,
          .detail-chat-desktop-form {
            display: none !important;
          }
          .detail-mobile-sticky-bar {
            display: grid !important;
            grid-template-columns: 1fr 1.2fr;
            gap: 10px;
            position: fixed;
            left: 12px; right: 12px;
            bottom: calc(70px + env(safe-area-inset-bottom, 0px));
            z-index: 199;
          }
          .detail-wa-sticky {
            display: flex !important;
            align-items: center;
            justify-content: center;
            gap: 6px;
            height: 52px;
            border-radius: 16px;
            background: #25d366;
            color: #073b1d;
            font-weight: 950;
            font-size: 13.5px;
            text-decoration: none;
            box-shadow: 0 8px 24px rgba(37,211,102,.4);
            width: 100%;
          }
          .detail-chat-sticky {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            height: 52px;
            border-radius: 16px;
            background: var(--blue);
            color: #ffffff;
            font-weight: 950;
            font-size: 13.5px;
            border: 0;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
