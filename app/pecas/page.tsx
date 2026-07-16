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

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { marca, estado, q, categoria_peca, condicao } = await searchParams;
  const marcaFiltro = marca ? String(marca).trim() : "";
  const estadoFiltro = estado ? String(estado).trim() : "";
  const catFiltro = categoria_peca ? String(categoria_peca).trim() : "";
  const condFiltro = condicao ? String(condicao).trim() : "";
  const busca = (q || "").trim().slice(0, 100);

  let title = "Peças para Caminhão à Venda | Motores e componentes de reposição";
  let description = "Motores, câmbios, eixos, cabines, suspensão, freios e peças usadas ou novas de reposição para caminhões. Negociação direta pelo WhatsApp.";

  if (marcaFiltro && estadoFiltro) {
    title = `Peças para Caminhão ${marcaFiltro} à Venda em ${estadoFiltro} | Caminhões à Venda`;
    description = `Confira peças para caminhão ${marcaFiltro} usadas e novas em ${estadoFiltro}. Motores, câmbios, suspensão e mais com contato no WhatsApp.`;
  } else if (marcaFiltro) {
    title = `Peças para Caminhão ${marcaFiltro} à Venda | Ofertas de ${marcaFiltro}`;
    description = `Procurando peças originais ou paralelas da marca ${marcaFiltro}? Veja ofertas ativas no portal.`;
  } else if (estadoFiltro) {
    title = `Peças para Caminhão à Venda em ${estadoFiltro} | Ofertas em ${estadoFiltro}`;
    description = `Veja anúncios de peças e componentes para caminhões à venda no estado de ${estadoFiltro}.`;
  } else if (catFiltro) {
    title = `Peças de ${catFiltro} para Caminhão | Caminhões à Venda`;
    description = `Peças da categoria ${catFiltro} para caminhões usadas e seminovas. Fale com os vendedores no WhatsApp.`;
  } else if (condFiltro) {
    title = `Peças para Caminhão em estado ${condFiltro} | Caminhões à Venda`;
    description = `Confira anúncios de peças de reposição ${condFiltro}s para caminhões pesados.`;
  } else if (busca) {
    title = `Busca por "${busca}" em Peças | Caminhões à Venda`;
    description = `Resultados de busca para "${busca}" em peças de reposição de caminhão.`;
  }

  return {
    title,
    description,
    alternates: { canonical: "/pecas" },
  };
}

type PageProps = { searchParams: Promise<{ estado?: string; categoria_peca?: string; condicao?: string; q?: string; marca?: string }> };

export default async function PecasPage({ searchParams }: PageProps) {
  const { estado, categoria_peca, condicao, q: searchQ, marca } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado").eq("perfil", "Peças").order("created_at", { ascending: false });

  if (estado) query = query.eq("estado", estado);
  if (categoria_peca) query = query.eq("carroceria", categoria_peca);
  if (condicao) query = query.eq("tracao", condicao);
  if (searchQ) query = query.or(`titulo.ilike.%${searchQ}%,marca.ilike.%${searchQ}%,modelo.ilike.%${searchQ}%`);
  if (marca) query = query.ilike("marca", marca);

  const [{ data }, { data: facetData }] = await Promise.all([
    query.limit(48),
    supabase.from("trucks").select("marca,estado").eq("status", "aprovado").eq("perfil", "Peças").eq("vendido", false),
  ]);

  const pecas = (data || []) as TruckCardData[];
  const marcasDisponiveis = [...new Set((facetData || []).map((t) => t.marca).filter(Boolean))].sort() as string[];
  const estadosDisponiveis = [...new Set((facetData || []).map((t) => t.estado).filter(Boolean))].sort() as string[];
  const hasFilters = !!(estado || categoria_peca || condicao || searchQ || marca);

  return (
    <CategoryPageLayout
      title="Peças à Venda"
      subtitle="Motores, câmbios, eixos, suspensão, freios e muito mais."
      total={pecas.length}
      sidebar={
        <AnunciosSidebar
          contexto="pecas" q={searchQ || ""} marcaFiltro={marca || ""} estadoFiltro={estado || ""}
          hasFilters={hasFilters} total={pecas.length} marcasDisponiveis={marcasDisponiveis}
          estadosDisponiveis={estadosDisponiveis} categoria_peca={categoria_peca} condicao={condicao}
        />
      }
    >
      <div className="cat-content">
        <div className="cat-banner">
          <p className="cat-banner-text">Peças genuínas e multimarcas para seu bruto</p>
          <Link href="/painel/anuncios/novo/peca" className="cat-banner-btn">+ Anunciar peça</Link>
        </div>
        <CategoryBrandsBar categoria="pecas" labelSingular="Peças" />
        {pecas.length > 0 ? (
          <div className="cat-grid">{pecas.map(item => <TruckCard key={item.id} truck={item} />)}</div>
        ) : (
          <EmptyState
            icon={<Package size={48} strokeWidth={1.5} />}
            title="Nenhuma peça encontrada"
            description={hasFilters ? "Tente outros filtros ou veja todos os anúncios." : "Nenhuma peça disponível no momento."}
            primaryHref="/pecas" primaryLabel="Ver todas as peças"
            suggestions={[
              { href: "/caminhoes", label: "Caminhões", icon: <Truck size={16} /> },
              { href: "/carretas",  label: "Carretas",  icon: <Container size={16} /> },
              { href: "/implementos", label: "Implementos", icon: <Wrench size={16} /> },
              { href: "/maquinas",  label: "Máquinas",  icon: <Tractor size={16} /> },
            ]}
            announceHref="/painel/anuncios/novo/peca" announceLabel="Anuncie sua peça"
          />
        )}
      </div>
    </CategoryPageLayout>
  );
}
