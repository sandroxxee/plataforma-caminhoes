import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { AnunciosSidebar } from "@/components/AnunciosSidebar";
import { CategoryBrandsBar } from "@/components/theme/CategoryBrandsBar";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { EmptyState } from "@/components/theme/EmptyState";
import { Tractor, Container, Truck, Package, Wrench } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { marca, estado, q, tipo } = await searchParams;
  const marcaFiltro = marca ? String(marca).trim() : "";
  const estadoFiltro = estado ? String(estado).trim() : "";
  const tipoFiltro = tipo ? String(tipo).trim() : "";
  const busca = (q || "").trim().slice(0, 100);

  let title = "Máquinas Pesadas à Venda | Escavadeiras e tratores usados e seminovos";
  let description = "Encontre máquinas pesadas à venda: escavadeiras, retroescavadeiras, pás-carregadeiras, motoniveladoras e tratores. Fale direto no WhatsApp.";

  if (marcaFiltro && estadoFiltro) {
    title = `Máquinas Pesadas ${marcaFiltro} à Venda em ${estadoFiltro} | Caminhões à Venda`;
    description = `Confira os anúncios de máquinas pesadas ${marcaFiltro} usadas e seminovas em ${estadoFiltro}. Contato direto via WhatsApp com o anunciante.`;
  } else if (marcaFiltro) {
    title = `Máquinas Pesadas ${marcaFiltro} à Venda | Ofertas de ${marcaFiltro}`;
    description = `Veja ofertas de máquinas pesadas da marca ${marcaFiltro} para construção ou agronegócio.`;
  } else if (estadoFiltro) {
    title = `Máquinas Pesadas à Venda em ${estadoFiltro} | Ofertas em ${estadoFiltro}`;
    description = `Veja anúncios de máquinas pesadas e equipamentos à venda no estado de ${estadoFiltro}.`;
  } else if (tipoFiltro) {
    title = `Máquinas do tipo ${tipoFiltro} à Venda | Caminhões à Venda`;
    description = `Confira ofertas de máquinas pesadas do tipo ${tipoFiltro} à venda. Fale direto pelo WhatsApp.`;
  } else if (busca) {
    title = `Busca por "${busca}" em Máquinas | Caminhões à Venda`;
    description = `Resultados de busca para "${busca}" em máquinas pesadas no nosso portal.`;
  }

  return {
    title,
    description,
    alternates: { canonical: "/comprar/maquinas" },
  };
}

type PageProps = { searchParams: Promise<{ estado?: string; tipo?: string; q?: string; marca?: string; pmin?: string; pmax?: string }> };

export default async function MaquinasPage({ searchParams }: PageProps) {
  const { estado, tipo, q: searchQ, marca, pmin, pmax } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado").eq("perfil", "Máquinas").order("created_at", { ascending: false });

  if (estado) query = query.eq("estado", estado);
  if (tipo)   query = query.eq("carroceria", tipo);
  if (searchQ) query = query.or(`titulo.ilike.%${searchQ}%,marca.ilike.%${searchQ}%,modelo.ilike.%${searchQ}%`);
  if (marca) query = query.ilike("marca", marca);
  if (pmin) query = query.gte("preco", Number(pmin));
  if (pmax) query = query.lte("preco", Number(pmax));

  const [{ data }, { data: facetData }] = await Promise.all([
    query.limit(48),
    supabase.from("trucks").select("marca,estado").eq("status", "aprovado").eq("perfil", "Máquinas").eq("vendido", false),
  ]);

  const maquinas = (data || []) as TruckCardData[];
  const marcasDisponiveis = [...new Set((facetData || []).map((t) => t.marca).filter(Boolean))].sort() as string[];
  const estadosDisponiveis = [...new Set((facetData || []).map((t) => t.estado).filter(Boolean))].sort() as string[];
  const hasFilters = !!(estado || tipo || searchQ || marca || pmin || pmax);

  return (
    <CategoryPageLayout
      title="Máquinas Pesadas à Venda"
      subtitle="Escavadeiras, pás-carregadeiras, motoniveladoras, rolos e muito mais."
      total={maquinas.length}
      sidebar={
        <AnunciosSidebar
          contexto="maquinas" q={searchQ || ""} marcaFiltro={marca || ""} estadoFiltro={estado || ""}
          hasFilters={hasFilters} total={maquinas.length} marcasDisponiveis={marcasDisponiveis}
          estadosDisponiveis={estadosDisponiveis} tipo={tipo}
          precoMin={pmin ? Number(pmin) : 0} precoMax={pmax ? Number(pmax) : 2_000_000}
        />
      }
    >
      <div className="cat-content">
        <div className="cat-banner">
          <p className="cat-banner-text">Máquinas pesadas para construção e agronegócio</p>
          <Link href="/painel/anuncios/novo/maquina" className="cat-banner-btn">+ Anunciar máquina</Link>
        </div>
        <CategoryBrandsBar categoria="maquinas" labelSingular="Máquinas" />
        {maquinas.length > 0 ? (
          <div className="cat-grid">{maquinas.map(item => <TruckCard key={item.id} truck={item} />)}</div>
        ) : (
          <EmptyState
            icon={<Tractor size={48} strokeWidth={1.5} />}
            title="Nenhuma máquina encontrada"
            description={hasFilters ? "Tente outros filtros ou veja todos os anúncios." : "Nenhuma máquina disponível no momento."}
            primaryHref="/comprar/maquinas" primaryLabel="Ver todas as máquinas"
            suggestions={[
              { href: "/comprar/caminhoes", label: "Caminhões", icon: <Truck size={16} /> },
              { href: "/comprar/carretas",  label: "Carretas",  icon: <Container size={16} /> },
              { href: "/comprar/implementos", label: "Implementos", icon: <Wrench size={16} /> },
              { href: "/comprar/pecas",     label: "Peças",     icon: <Package size={16} /> },
            ]}
            announceHref="/painel/anuncios/novo/maquina" announceLabel="Anuncie sua máquina"
          />
        )}
      </div>
    </CategoryPageLayout>
  );
}
