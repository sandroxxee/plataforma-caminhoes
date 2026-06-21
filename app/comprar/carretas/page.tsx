import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { AnunciosSidebar } from "@/components/AnunciosSidebar";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { EmptyState } from "@/components/theme/EmptyState";
import { Container, Truck, Wrench, Tractor, Package } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Carretas à Venda | Caminhões à Venda",
  description: "Graneleiras, porta-containers, pranchas, frigoríficas e tanques. Negociação direta pelo WhatsApp.",
  alternates: { canonical: "/comprar/carretas" },
};

type PageProps = {
  searchParams: Promise<{
    estado?: string;
    marca?: string;
    faixa?: string;
    pmin?: string;
    pmax?: string;
    q?: string;
    tipo?: string;
  }>
};

export default async function CarretasPage({ searchParams }: PageProps) {
  const { estado, marca, faixa, pmin, pmax, q: searchQ, tipo } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado")
    .eq("perfil", "Carretas")
    .order("created_at", { ascending: false });

  if (estado) query = query.eq("estado", estado);
  if (marca) query = query.ilike("marca", marca);
  if (pmin) query = query.gte("preco", Number(pmin));
  if (pmax) query = query.lte("preco", Number(pmax));
  if (searchQ) query = query.or(`titulo.ilike.%${searchQ}%,marca.ilike.%${searchQ}%,modelo.ilike.%${searchQ}%`);

  const [{ data }, { data: facetData }] = await Promise.all([
    query.limit(48),
    supabase
      .from("trucks")
      .select("marca,estado")
      .eq("status", "aprovado")
      .eq("perfil", "Carretas")
      .eq("vendido", false),
  ]);

  const carretas = (data || []) as TruckCardData[];

  const marcasDisponiveis = [...new Set(
    (facetData || []).map((t) => t.marca).filter(Boolean)
  )].sort() as string[];

  const estadosDisponiveis = [...new Set(
    (facetData || []).map((t) => t.estado).filter(Boolean)
  )].sort() as string[];

  const hasFilters = !!(estado || marca || faixa || pmin || pmax || searchQ);

  return (
    <CategoryPageLayout
      title="Carretas à Venda"
      subtitle="Graneleiras, porta-containers, pranchas, frigoríficas e muito mais."
      total={carretas.length}
      sidebar={
        <AnunciosSidebar
          contexto="carretas"
          q={searchQ || ""}
          marcaFiltro={marca || ""}
          estadoFiltro={estado || ""}
          hasFilters={hasFilters}
          total={carretas.length}
          marcasDisponiveis={marcasDisponiveis}
          estadosDisponiveis={estadosDisponiveis}
          precoMin={pmin ? Number(pmin) : 0}
          precoMax={pmax ? Number(pmax) : 2_000_000}
          tipo={tipo}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <p className="text-slate-500 font-bold">Encontre a carreta ideal para seu negócio</p>
          <Link href="/anunciar" className="h-10 px-6 inline-flex items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors">
            Anunciar Carreta
          </Link>
        </div>

        {carretas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {carretas.map(item => <TruckCard key={item.id} truck={item} />)}
          </div>
        ) : (
          <EmptyState
            icon={<Container size={48} strokeWidth={1.5} />}
            title="Nenhuma carreta encontrada"
            description={hasFilters ? "Tente outros filtros ou veja todos os anúncios." : "Nenhuma carreta disponível no momento."}
            primaryHref="/comprar/carretas"
            primaryLabel="Ver todas as carretas"
            suggestions={[
              { href: "/comprar/caminhoes", label: "Caminhões", icon: <Truck size={16} /> },
              { href: "/comprar/implementos", label: "Implementos", icon: <Wrench size={16} /> },
              { href: "/comprar/maquinas", label: "Máquinas", icon: <Tractor size={16} /> },
              { href: "/comprar/pecas", label: "Peças", icon: <Package size={16} /> },
            ]}
            announceHref="/painel/anuncios/novo/carreta"
            announceLabel="Anuncie sua carreta"
          />
        )}
      </div>
    </CategoryPageLayout>
  );
}
