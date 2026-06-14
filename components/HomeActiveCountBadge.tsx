"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function HomeActiveCountBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("trucks")
      .select("id", { count: "exact", head: true })
      .eq("status", "aprovado")
      .eq("vendido", false)
      .then(({ count: c }) => setCount(c ?? null));
  }, []);

  if (count === null) return null;

  return (
    <span className="home-active-badge">
      {count.toLocaleString("pt-BR")} anúncios ativos
      <style>{`
        .home-active-badge {
          display: inline-flex; height: 26px; align-items: center;
          padding: 0 12px; border-radius: 999px;
          background: var(--blueSoft); color: var(--blue);
          font-size: 12px; font-weight: 950; letter-spacing: .02em;
        }
      `}</style>
    </span>
  );
}
