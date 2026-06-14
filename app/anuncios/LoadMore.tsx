"use client";

import { useState, useTransition } from "react";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";

type Props = {
  initialTrucks: TruckCardData[];
  total: number;
  pageSize?: number;
};

export function LoadMore({ initialTrucks, total, pageSize = 24 }: Props) {
  const [trucks, setTrucks] = useState(initialTrucks);
  const [isPending, startTransition] = useTransition();

  const hasMore = trucks.length < total;

  async function loadMore() {
    startTransition(async () => {
      const offset = trucks.length;
      const res = await fetch(`/api/anuncios?offset=${offset}&limit=${pageSize}`);
      if (!res.ok) return;
      const json = await res.json();
      setTrucks((prev) => [...prev, ...json.trucks]);
    });
  }

  return (
    <>
      <div className="stock-grid">
        {trucks.map((truck) => (
          <TruckCard key={truck.id} truck={truck} />
        ))}
      </div>

      {hasMore && (
        <div className="lm-wrap">
          <button
            className="lm-btn"
            onClick={loadMore}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Carregando..." : `Carregar mais (${total - trucks.length} restantes)`}
          </button>
        </div>
      )}

      <style>{`
        .lm-wrap { display: flex; justify-content: center; padding: 32px 0 8px; }
        .lm-btn {
          height: 48px; padding: 0 32px; border-radius: 14px;
          border: 1.5px solid var(--line);
          background: var(--surface); color: var(--text);
          font-size: 14px; font-weight: 800; cursor: pointer;
          transition: border-color .14s, box-shadow .14s, transform .14s;
          box-shadow: var(--shadow);
        }
        .lm-btn:hover:not(:disabled) {
          border-color: var(--blue); box-shadow: var(--shadow2);
          transform: translateY(-1px);
        }
        .lm-btn:disabled { opacity: .6; cursor: not-allowed; }
      `}</style>
    </>
  );
}
