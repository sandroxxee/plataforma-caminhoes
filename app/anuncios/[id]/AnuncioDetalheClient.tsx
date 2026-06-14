"use client";
// Componente client — apenas interações que exigem browser
import { AdGallery } from "@/components/theme/AdGallery";
import { ViewCounter } from "@/components/ViewCounter";
import { ShareAdButton } from "@/components/ShareAdButton";
import { Camera, MessageCircle } from "lucide-react";
import type { Truck } from "./anuncio-utils";
import type { TruckImage } from "@/lib/truck-utils";

interface Props {
  truckId: string;
  title: string;
  images: TruckImage[];
  whatsappLink: string;
  shareText: string;
  initialViews: number;
}

export function AnuncioDetalheClient({
  truckId,
  title,
  images,
  whatsappLink,
  shareText,
  initialViews,
}: Props) {
  const photoCount = images.length;

  return (
    <>
      {/* Galeria com counter e badge */}
      <div className="detail-card detail-gallery-card">
        <div className="detail-gallery-meta">
          {photoCount > 0 && (
            <div className="detail-badge">
              <Camera size={13} strokeWidth={2.5} aria-hidden="true" />
              {photoCount} {photoCount === 1 ? "foto" : "fotos"}
            </div>
          )}
          <ViewCounter truckId={truckId} initialViews={initialViews} />
        </div>
        <AdGallery title={title} images={images} />
      </div>

      {/* CTA WhatsApp */}
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
          <MessageCircle size={20} strokeWidth={2} aria-hidden="true" />
          Tenho interesse neste caminhão
        </a>
      )}

      {/* Compartilhar */}
      <ShareAdButton title={title} text={shareText} />
    </>
  );
}
