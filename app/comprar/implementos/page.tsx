import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { AnunciosSidebar } from "@/components/AnunciosSidebar";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { EmptyState } from "@/components/theme/EmptyState";
import Link from "next/link";
import { Truck, Container, Wrench, Tractor, Package } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Implementos à Venda | Caminhões à Venda",
  description: "Implementos rodoviários à venda: caçambas, munks, pranchas, baús, tanques, plataformas e muito mais.",
  alternates: { canonical: "/comprar/implementos" },
};

type PageProps = { searchParams: Promise<{ tipo?: string; estado?: string; q?: string; marca?: string; pmin?: string; pmax?: string }> };

export default async function ImplementosPage({ searchParams }: PageProps) {
  const { tipo, estado, q, marca, pmin, pmax } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado").eq("perfil", "Implementos").order("created_at", { ascending: false });

  if (estado) query = query.eq("estado", estado);
  if (tipo)   query = query.eq("carroceria", tipo);
  if (q) query = query.or(`titulo.ilike.%${q}%,marca.ilike.%${q}%,modelo.ilike.%${q}%`);
  if (marca) query = query.ilike("marca", marca);
  if (pmin) query = query.gte("preco", Number(pmin));
  if (pmax) query = query.lte("preco", Number(pmax));

  const [{ data }, { data: facetData }] = await Promise.all([
    query.limit(48),
    supabase.from("trucks").select("marca,estado").eq("status", "aprovado").eq("perfil", "Implementos").eq("vendido", false),
  ]);

  const implementos = (data || []) as TruckCardData[];
  const marcasDisponiveis = [...new Set((facetData || []).map((t) => t.marca).filter(Boolean))].sort() as string[];
  const estadosDisponiveis = [...new Set((facetData || []).map((t) => t.estado).filter(Boolean))].sort() as string[];
  const hasFilters = !!(tipo || estado || q || marca || pmin || pmax);

  return (
    <CategoryPageLayout
      title="Implementos à Venda"
      subtitle="Caçambas, munks, pranchas, baús, tanques e muito mais."
      total={implementos.length}
      sidebar={
        <AnunciosSidebar
          contexto="implementos" q={q || ""} marcaFiltro={marca || ""} estadoFiltro={estado || ""}
          hasFilters={hasFilters} total={implementos.length} marcasDisponiveis={marcasDisponiveis}
          estadosDisponiveis={estadosDisponiveis} tipo={tipo}
          precoMin={pmin ? Number(pmin) : 0} precoMax={pmax ? Number(pmax) : 2_000_000}
        />
      }
    >
      <div className="cat-content">
        <div className="cat-banner">
          <p className="cat-banner-text">Variedade em implementos rodoviários</p>
          <Link href="/painel/anuncios/novo/implemento" className="cat-banner-btn">+ Anunciar implemento</Link>
        </div>
        {implementos.length > 0 ? (
          <div className="cat-grid">{implementos.map((item) => <TruckCard key={item.id} truck={item} />)}</div>
        ) : (
          <EmptyState
            icon={<Wrench size={48} strokeWidth={1.5} />}
            title="Nenhum implemento encontrado"
            description={hasFilters ? "Tente outros filtros ou veja todos os anúncios." : "Nenhum implemento disponível no momento."}
            primaryHref="/comprar/implementos" primaryLabel="Ver todos os implementos"
            suggestions={[
              { href: "/comprar/carretas",  label: "Carretas",  icon: <Container size={16} /> },
              { href: "/comprar/caminhoes",  label: "Caminhões", icon: <Truck size={16} /> },
              { href: "/comprar/maquinas",  label: "Máquinas",  icon: <Tractor size={16} /> },
              { href: "/comprar/pecas",     label: "Peças",     icon: <Package size={16} /> },
            ]}
            announceHref="/painel/anuncios/novo/implemento" announceLabel="Anuncie seu implemento"
          />
        )}
      </div>
    </CategoryPageLayout>
  );
}
