import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { AnunciosSidebar } from "@/components/AnunciosSidebar";
import { CategoryBrandsBar } from "@/components/theme/CategoryBrandsBar";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { EmptyState } from "@/components/theme/EmptyState";
import { Package, Tractor, Container, Truck, Wrench } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Peças para Caminhão à Venda | Caminhões à Venda",
  description: "Motores, câmbios, eixos, suspensão, freios e muito mais. Negociação direta pelo WhatsApp.",
  alternates: { canonical: "/comprar/pecas" },
};

type PageProps = {
  searchParams: Promise<{
    estado?: string;
    categoria_peca?: string;
    condicao?: string;
    q?: string;
    marca?: string;
  }>
};

export default async function PecasPage({ searchParams }: PageProps) {
  const { estado, categoria_peca, condicao, q: searchQ, marca } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado")
    .eq("perfil", "Peças")
    .order("created_at", { ascending: false });

  if (estado) query = query.eq("estado", estado);
  if (categoria_peca) query = query.eq("carroceria", categoria_peca);
  if (condicao) query = query.eq("tracao", condicao); // Usando tracao como placeholder se não houver campo condicao
  if (searchQ) query = query.or(`titulo.ilike.%${searchQ}%,marca.ilike.%${searchQ}%,modelo.ilike.%${searchQ}%`);
  if (marca) query = query.ilike("marca", marca);

  const [{ data }, { data: facetData }] = await Promise.all([
    query.limit(48),
    supabase
      .from("trucks")
      .select("marca,estado")
      .eq("status", "aprovado")
      .eq("perfil", "Peças")
      .eq("vendido", false),
  ]);

  const pecas = (data || []) as TruckCardData[];

  const marcasDisponiveis = [...new Set(
    (facetData || []).map((t) => t.marca).filter(Boolean)
  )].sort() as string[];

  const estadosDisponiveis = [...new Set(
    (facetData || []).map((t) => t.estado).filter(Boolean)
  )].sort() as string[];

  const hasFilters = !!(estado || categoria_peca || condicao || searchQ || marca);

  return (
    <CategoryPageLayout
      title="Peças à Venda"
      subtitle="Motores, câmbios, eixos, suspensão, freios e muito mais."
      total={pecas.length}
      sidebar={
        <AnunciosSidebar
          contexto="pecas"
          q={searchQ || ""}
          marcaFiltro={marca || ""}
          estadoFiltro={estado || ""}
          hasFilters={hasFilters}
          total={pecas.length}
          marcasDisponiveis={marcasDisponiveis}
          estadosDisponiveis={estadosDisponiveis}
          categoria_peca={categoria_peca}
          condicao={condicao}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <p className="text-slate-500 font-bold">Peças genuínas e multimarcas para seu bruto</p>
          <Link href="/painel/anuncios/novo/peca" className="h-10 px-6 inline-flex items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors">
            + Anunciar peça
          </Link>
        </div>

        <CategoryBrandsBar categoria="pecas" labelSingular="Peças" />

        {pecas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pecas.map(item => <TruckCard key={item.id} truck={item} />)}
          </div>
        ) : (
          <EmptyState
            icon={<Package size={48} strokeWidth={1.5} />}
            title="Nenhuma peça encontrada"
            description={hasFilters ? "Tente outros filtros ou veja todos os anúncios." : "Nenhuma peça disponível no momento."}
            primaryHref="/comprar/pecas"
            primaryLabel="Ver todas as peças"
            suggestions={[
              { href: "/comprar/caminhoes", label: "Caminhões", icon: <Truck size={16} /> },
              { href: "/comprar/carretas", label: "Carretas", icon: <Container size={16} /> },
              { href: "/comprar/implementos", label: "Implementos", icon: <Wrench size={16} /> },
              { href: "/comprar/maquinas", label: "Máquinas", icon: <Tractor size={16} /> },
            ]}
            announceHref="/painel/anuncios/novo/peca"
            announceLabel="Anuncie sua peça"
          />
        )}
      </div>
    </CategoryPageLayout>
  );
}
