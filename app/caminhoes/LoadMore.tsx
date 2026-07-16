"use client";

import { useState, useTransition } from "react";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { TruckGridSkeleton } from "@/components/theme/TruckCardSkeleton";

type Props = {
  initialTrucks: TruckCardData[];
  total:         number;
  pageSize?:     number;
  q?:            string;
  marca?:        string;
  estado?:       string;
  faixa?:        number;
};

export function LoadMore({
  initialTrucks,
  total,
  pageSize = 24,
  q      = "",
  marca  = "",
  estado = "",
  faixa  = 0,
}: Props) {
  const [trucks, setTrucks]          = useState(initialTrucks);
  const [isPending, startTransition] = useTransition();

  const hasMore = trucks.length < total;

  async function loadMore() {
    startTransition(async () => {
      const offset = trucks.length;
      const params = new URLSearchParams({ offset: String(offset), limit: String(pageSize) });
      if (q)       params.set("q",      q);
      if (marca)   params.set("marca",  marca);
      if (estado)  params.set("estado", estado);
      if (faixa > 0) params.set("faixa", String(faixa));

      const res = await fetch(`/api/anuncios?${params.toString()}`);
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

      {isPending && <TruckGridSkeleton count={pageSize} />}

      {hasMore && !isPending && (
        <div className="lm-wrap">
          <button className="lm-btn" onClick={loadMore} aria-busy={isPending}>
            Carregar mais
            <span className="lm-count">{total - trucks.length} restantes</span>
          </button>
        </div>
      )}

      <style>{`
        .lm-wrap {
          display: flex; justify-content: center;
          padding: 36px 0 8px;
        }
        .lm-btn {
          display: inline-flex; align-items: center; gap: 10px;
          height: 50px; padding: 0 32px; border-radius: 14px;
          border: 1.5px solid var(--line);
          background: var(--surface); color: var(--text);
          font-size: 14px; font-weight: 800; cursor: pointer;
          transition: border-color .14s, box-shadow .14s, transform .14s;
          box-shadow: var(--shadow);
        }
        .lm-btn:hover {
          border-color: var(--blue);
          box-shadow: var(--shadow2);
          transform: translateY(-1px);
        }
        .lm-count {
          display: inline-flex; align-items: center;
          height: 22px; padding: 0 9px;
          border-radius: 999px;
          background: var(--blueSoft);
          color: var(--blue);
          font-size: 11px; font-weight: 900;
        }
      `}</style>
    </>
  );
}
