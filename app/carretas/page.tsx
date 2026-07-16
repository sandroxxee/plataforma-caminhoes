import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { AnunciosSidebar } from "@/components/AnunciosSidebar";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { EmptyState } from "@/components/theme/EmptyState";
import { Container, Truck, Wrench, Tractor, Package } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { marca, estado, q, tipo } = await searchParams;
  const marcaFiltro = marca ? String(marca).trim() : "";
  const estadoFiltro = estado ? String(estado).trim() : "";
  const tipoFiltro = tipo ? String(tipo).trim() : "";
  const busca = (q || "").trim().slice(0, 100);

  let title = "Carretas à Venda | Semirreboques e tanques usados e seminovos";
  let description = "Encontre carretas à venda: graneleiras, basculantes, baús, porta-containers, pranchas e tanques. Negociação direta pelo WhatsApp.";

  if (marcaFiltro && estadoFiltro) {
    title = `Carretas ${marcaFiltro} à Venda em ${estadoFiltro} | Caminhões à Venda`;
    description = `Confira os melhores anúncios de carretas ${marcaFiltro} usadas e seminovas em ${estadoFiltro}. Fale com o vendedor pelo WhatsApp.`;
  } else if (marcaFiltro) {
    title = `Carretas ${marcaFiltro} à Venda | Ofertas de ${marcaFiltro}`;
    description = `Procurando carretas da marca ${marcaFiltro}? Veja os modelos anunciados e fale direto com o anunciante.`;
  } else if (estadoFiltro) {
    title = `Carretas à Venda em ${estadoFiltro} | Ofertas em ${estadoFiltro}`;
    description = `Veja anúncios de carretas e semirreboques à venda no estado de ${estadoFiltro}. Contato direto via WhatsApp.`;
  } else if (tipoFiltro) {
    title = `Carretas do tipo ${tipoFiltro} à Venda | Caminhões à Venda`;
    description = `Confira ofertas de carretas e semirreboques ${tipoFiltro} à venda. Fale direto pelo WhatsApp.`;
  } else if (busca) {
    title = `Busca por "${busca}" em Carretas | Caminhões à Venda`;
    description = `Resultados de busca para "${busca}" em carretas no nosso portal.`;
  }

  return {
    title,
    description,
    alternates: { canonical: "/carretas" },
  };
}

type PageProps = { searchParams: Promise<{ estado?: string; marca?: string; faixa?: string; pmin?: string; pmax?: string; q?: string; tipo?: string }> };

export default async function CarretasPage({ searchParams }: PageProps) {
  const { estado, marca, faixa, pmin, pmax, q: searchQ, tipo } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado").eq("perfil", "Carretas").order("created_at", { ascending: false });

  if (estado) query = query.eq("estado", estado);
  if (marca) query = query.ilike("marca", marca);
  if (pmin) query = query.gte("preco", Number(pmin));
  if (pmax) query = query.lte("preco", Number(pmax));
  if (searchQ) query = query.or(`titulo.ilike.%${searchQ}%,marca.ilike.%${searchQ}%,modelo.ilike.%${searchQ}%`);

  const [{ data }, { data: facetData }] = await Promise.all([
    query.limit(48),
    supabase.from("trucks").select("marca,estado").eq("status", "aprovado").eq("perfil", "Carretas").eq("vendido", false),
  ]);

  const carretas = (data || []) as TruckCardData[];
  const marcasDisponiveis = [...new Set((facetData || []).map((t) => t.marca).filter(Boolean))].sort() as string[];
  const estadosDisponiveis = [...new Set((facetData || []).map((t) => t.estado).filter(Boolean))].sort() as string[];
  const hasFilters = !!(estado || marca || faixa || pmin || pmax || searchQ);

  const marcaFiltro = marca ? String(marca).trim() : "";
  const estadoFiltro = estado ? String(estado).trim() : "";
  const busca = (searchQ || "").trim().slice(0, 100);

  let titleText = "Carretas à Venda";
  let subtitleText = "Graneleiras, porta-containers, pranchas, frigoríficas e muito mais.";

  if (marcaFiltro && estadoFiltro) {
    titleText = `Carretas ${marcaFiltro} à Venda em ${estadoFiltro}`;
    subtitleText = `Confira os melhores anúncios de carretas ${marcaFiltro} usadas e seminovas em ${estadoFiltro}.`;
  } else if (marcaFiltro) {
    titleText = `Carretas ${marcaFiltro} à Venda`;
    subtitleText = `Procurando carretas da marca ${marcaFiltro}? Veja os modelos anunciados e fale direto com o anunciante.`;
  } else if (estadoFiltro) {
    titleText = `Carretas à Venda em ${estadoFiltro}`;
    subtitleText = `Veja anúncios de carretas e semirreboques à venda no estado de ${estadoFiltro}.`;
  } else if (busca) {
    titleText = `Busca por "${busca}" em Carretas`;
    subtitleText = `Resultados de busca para "${busca}" em carretas no nosso portal.`;
  }

  return (
    <CategoryPageLayout
      title={titleText}
      subtitle={subtitleText}
      total={carretas.length}
      sidebar={
        <AnunciosSidebar
          contexto="carretas" q={searchQ || ""} marcaFiltro={marca || ""} estadoFiltro={estado || ""}
          hasFilters={hasFilters} total={carretas.length} marcasDisponiveis={marcasDisponiveis}
          estadosDisponiveis={estadosDisponiveis}
          precoMin={pmin ? Number(pmin) : 0} precoMax={pmax ? Number(pmax) : 2_000_000} tipo={tipo}
        />
      }
    >
      <div className="cat-content">
        <div className="cat-banner">
          <p className="cat-banner-text">Encontre a carreta ideal para seu negócio</p>
          <Link href="/anunciar" className="cat-banner-btn">Anunciar Carreta</Link>
        </div>
        {carretas.length > 0 ? (
          <div className="cat-grid">{carretas.map(item => <TruckCard key={item.id} truck={item} />)}</div>
        ) : (
          <EmptyState
            icon={<Container size={48} strokeWidth={1.5} />}
            title="Nenhuma carreta encontrada"
            description={hasFilters ? "Tente outros filtros ou veja todos os anúncios." : "Nenhuma carreta disponível no momento."}
            primaryHref="/carretas" primaryLabel="Ver todas as carretas"
            suggestions={[
              { href: "/caminhoes",   label: "Caminhões",   icon: <Truck size={16} /> },
              { href: "/implementos", label: "Implementos", icon: <Wrench size={16} /> },
              { href: "/maquinas",    label: "Máquinas",    icon: <Tractor size={16} /> },
              { href: "/pecas",       label: "Peças",       icon: <Package size={16} /> },
            ]}
            announceHref="/painel/anuncios/novo/carreta" announceLabel="Anuncie sua carreta"
          />
        )}
      </div>
    </CategoryPageLayout>
  );
}
