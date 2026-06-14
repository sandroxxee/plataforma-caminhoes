import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import Link from "next/link";

type Props = {
  currentId: string;
  marca?: string | null;
  perfil?: string | null;
};

export async function RelatedAds({ currentId, marca, perfil }: Props) {
  const supabase = await createClient();

  // Busca por mesma marca primeiro, senão mesmo perfil
  let query = supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, destaque, created_at, truck_images(image_url, principal, ordem)`)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .neq("id", currentId)
    .order("created_at", { ascending: false })
    .limit(4);

  if (marca) query = query.eq("marca", marca);
  else if (perfil) query = query.eq("perfil", perfil);

  const { data } = await query;
  const related = (data || []) as TruckCardData[];

  // Fallback: se não achou por marca, busca por perfil
  if (related.length === 0 && marca && perfil) {
    const { data: fallback } = await supabase
      .from("trucks")
      .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, destaque, created_at, truck_images(image_url, principal, ordem)`)
      .eq("status", "aprovado")
      .eq("vendido", false)
      .eq("perfil", perfil)
      .neq("id", currentId)
      .order("created_at", { ascending: false })
      .limit(4);
    if ((fallback || []).length === 0) return null;
    return <RelatedGrid items={fallback as TruckCardData[]} label="Veía também" />;
  }

  if (related.length === 0) return null;

  const label = marca ? `Mais ${marca} à venda` : "Veja também";
  return <RelatedGrid items={related} label={label} />;
}

function RelatedGrid({ items, label }: { items: TruckCardData[]; label: string }) {
  return (
    <section className="related-wrap">
      <div className="related-header">
        <h2 className="related-title">{label}</h2>
        <Link href="/anuncios" className="related-all">Ver todos</Link>
      </div>
      <div className="related-grid">
        {items.map((item) => (
          <TruckCard key={item.id} truck={item} />
        ))}
      </div>
      <style>{`
        .related-wrap {
          width: min(1280px, calc(100vw - 32px));
          margin: 40px auto 0;
          padding-bottom: 48px;
        }
        .related-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .related-title {
          margin: 0; font-size: clamp(18px, 2.5vw, 24px);
          letter-spacing: -.04em; font-weight: 950;
        }
        .related-all {
          font-size: 13px; font-weight: 800; color: var(--blue);
          text-decoration: none;
        }
        .related-all:hover { text-decoration: underline; }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }
        @media (max-width: 480px) {
          .related-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>
    </section>
  );
}
