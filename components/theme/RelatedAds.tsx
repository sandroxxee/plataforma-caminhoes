import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";

type Props = {
  currentId: string;
  marca?: string | null;
  perfil?: string | null;
};

export async function RelatedAds({ currentId, marca, perfil }: Props) {
  const supabase = await createClient();

  let query = supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, destaque, views, created_at, truck_images(image_url, principal, ordem)`)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .neq("id", currentId)
    .order("created_at", { ascending: false })
    .limit(4);

  // Prefer same brand, fallback to same category
  if (marca) query = query.eq("marca", marca);
  else if (perfil) query = query.eq("perfil", perfil);

  const { data } = await query;
  let related = (data || []) as TruckCardData[];

  // If less than 2 by brand, fill with same category
  if (related.length < 2 && marca && perfil) {
    const { data: fill } = await supabase
      .from("trucks")
      .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, destaque, views, created_at, truck_images(image_url, principal, ordem)`)
      .eq("status", "aprovado")
      .eq("vendido", false)
      .eq("perfil", perfil)
      .neq("id", currentId)
      .order("created_at", { ascending: false })
      .limit(4);
    const ids = new Set(related.map((r) => r.id));
    const extra = (fill || []).filter((r) => !ids.has(r.id));
    related = [...related, ...extra].slice(0, 4);
  }

  if (!related.length) return null;

  return (
    <section className="ra-wrap">
      <div className="ra-header">
        <h2 className="ra-title">Veja também</h2>
        <Link href="/anuncios" className="ra-all">Ver todos &rarr;</Link>
      </div>
      <div className="ra-grid">
        {related.map((truck) => (
          <TruckCard key={truck.id} truck={truck} />
        ))}
      </div>
      <style>{`
        .ra-wrap {
          width: min(1280px, calc(100vw - 32px));
          margin: 32px auto 0;
          padding-bottom: 48px;
        }
        .ra-header {
          display: flex; align-items: center;
          justify-content: space-between; gap: 12px;
          margin-bottom: 16px;
        }
        .ra-title {
          margin: 0; font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 950; letter-spacing: -.03em;
        }
        .ra-all {
          font-size: 13px; font-weight: 800;
          color: var(--blue); text-decoration: none;
          white-space: nowrap;
        }
        .ra-all:hover { text-decoration: underline; }
        .ra-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }
        @media (max-width: 560px) {
          .ra-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>
    </section>
  );
}
