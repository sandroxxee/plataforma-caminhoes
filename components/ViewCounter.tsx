"use client";

import { useEffect, useState } from "react";

export function ViewCounter({ truckId, initialViews }: { truckId: string; initialViews: number }) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    // Evita contar a mesma visita duas vezes na mesma sessão
    const key = `viewed_${truckId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: truckId }),
    })
      .then((r) => r.json())
      .then(() => setViews((v) => v + 1))
      .catch(() => null);
  }, [truckId]);

  if (views < 1) return null;

  return (
    <span
      className="detail-views-badge"
      title={`${views} visualizações`}
      aria-label={`${views} visualizações`}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {views.toLocaleString("pt-BR")} {views === 1 ? "visualização" : "visualizações"}
    </span>
  );
}
