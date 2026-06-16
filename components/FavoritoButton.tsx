"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";

type Props = {
  truckId: string;
  initialFavorito?: boolean;
  size?: number;
};

export function FavoritoButton({ truckId, initialFavorito = false, size = 18 }: Props) {
  const [ativo, setAtivo] = useState(initialFavorito);
  const [isPending, startTransition] = useTransition();

  function toggle() {
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
        setAtivo(action === "added");
      }
    });
  }

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
        className={`fav-btn${ativo ? " fav-btn--ativo" : ""}`}
        aria-label={ativo ? "Remover dos favoritos" : "Salvar nos favoritos"}
        aria-pressed={ativo}
        disabled={isPending}
        title={ativo ? "Remover dos favoritos" : "Salvar nos favoritos"}
      >
        <Heart
          size={size}
          fill={ativo ? "currentColor" : "none"}
          strokeWidth={ativo ? 0 : 2}
        />
      </button>
      <style>{`
        .fav-btn {
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 34px; height: 34px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          color: var(--muted);
          cursor: pointer;
          transition: background .15s, color .15s, transform .15s;
          flex-shrink: 0;
        }
        .fav-btn:hover {
          background: rgba(239,68,68,.1);
          color: #ef4444;
          transform: scale(1.1);
        }
        .fav-btn--ativo {
          background: rgba(239,68,68,.12);
          color: #ef4444;
        }
        .fav-btn--ativo:hover {
          background: rgba(239,68,68,.2);
        }
        .fav-btn:disabled { opacity: .6; cursor: wait; }
        body.public-theme-dark .fav-btn {
          background: rgba(30,41,59,.85);
        }
      `}</style>
    </>
  );
}
