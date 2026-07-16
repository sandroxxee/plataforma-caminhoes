import { createClient } from "@/lib/supabase/server";
import { type TruckCardData, type TruckImage } from "@/components/theme/TruckCard";
import { AnunciosFilters } from "./AnunciosFilters";
import { AnunciosSidebar } from "@/components/AnunciosSidebar";
import { LoadMore } from "./LoadMore";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import Link from "next/link";
import { MARCAS_VALIDAS, ESTADOS_VALIDOS, FAIXAS } from "@/lib/constants";
import type { Metadata } from "next";

export const revalidate = 30;

type PageProps = {
  searchParams: Promise<{
    faixa?: string; marca?: string; estado?: string; q?: string;
    tracao?: string; ano_min?: string; ano_max?: string;
  }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { marca, estado, q } = await searchParams;
  const marcaFiltro = MARCAS_VALIDAS.includes(marca || "") ? marca! : "";
  const estadoFiltro = ESTADOS_VALIDOS.includes(estado || "") ? estado! : "";
  const busca = (q || "").trim().slice(0, 100);
  let title = "Caminhões à Venda | Todos os anúncios";
  let description = "Veja todos os caminhões disponíveis. Filtre por marca, estado ou faixa de preço e fale direto pelo WhatsApp.";
  if (marcaFiltro && estadoFiltro) {
    title = `Caminhões ${marcaFiltro} à Venda em ${estadoFiltro}`;
    description = `Confira os melhores anúncios de caminhões ${marcaFiltro} usados e seminovos em ${estadoFiltro}.`;
  } else if (marcaFiltro) {
    title = `Caminhões ${marcaFiltro} à Venda | Anúncios de ${marcaFiltro}`;
    description = `Procurando caminhão ${marcaFiltro}? Veja as melhores ofertas em todo o Brasil.`;
  } else if (estadoFiltro) {
    title = `Caminhões à Venda em ${estadoFiltro} | Ofertas em ${estadoFiltro}`;
    description = `Veja anúncios de caminhões e implementos à venda em ${estadoFiltro}.`;
  } else if (busca) {
    title = `Busca por "${busca}" | Caminhões à Venda`;
    description = `Resultados de busca para "${busca}" em nosso marketplace.`;
  }
  return { title, description };
}

type Truck = TruckCardData & { truck_images?: TruckImage[]; perfil?: string | null };

export default async function AnunciosPage({ searchParams }: PageProps) {
  const { faixa, marca, estado, q, tracao, ano_min, ano_max } = await searchParams;
  const faixaIdx = Math.max(0, Math.min(FAIXAS.length - 1, Number(faixa ?? 0)));
  const { min, max } = FAIXAS[faixaIdx];
  const marcaFiltro = MARCAS_VALIDAS.includes(marca || "") ? marca! : "";
  const estadoFiltro = ESTADOS_VALIDOS.includes(estado || "") ? estado! : "";
  const busca = (q || "").trim().slice(0, 100);
  const hasFilters = faixaIdx > 0 || !!marcaFiltro || !!estadoFiltro || !!busca;
  const supabase = await createClient();

  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,perfil,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado").eq("vendido", false)
    .order("created_at", { ascending: false }).limit(24);

  if (marcaFiltro) query = query.ilike("marca", marcaFiltro);
  if (estadoFiltro) query = query.eq("estado", estadoFiltro);
  if (min > 0) query = query.gte("preco", min);
  if (max !== Infinity) query = query.lte("preco", max);
  if (busca) query = query.or(`titulo.ilike.%${busca}%,marca.ilike.%${busca}%,modelo.ilike.%${busca}%,cidade.ilike.%${busca}%`);

  const [{ data }, { data: facetData }] = await Promise.all([
    query,
    supabase.from("trucks").select("marca,estado").eq("status", "aprovado").eq("vendido", false),
  ]);

  const trucks = (data || []) as Truck[];
  const marcasComAnuncios = [...new Set((facetData || []).map((t) => t.marca).filter(Boolean))].sort() as string[];
  const estadosComAnuncios = [...new Set((facetData || []).map((t) => t.estado).filter(Boolean))].sort() as string[];

  let countQ = supabase.from("trucks").select("*", { count: "exact", head: true }).eq("status", "aprovado").eq("vendido", false);
  if (marcaFiltro) countQ = countQ.ilike("marca", marcaFiltro);
  if (estadoFiltro) countQ = countQ.eq("estado", estadoFiltro);
  if (min > 0) countQ = countQ.gte("preco", min);
  if (max !== Infinity) countQ = countQ.lte("preco", max);
  if (busca) countQ = countQ.or(`titulo.ilike.%${busca}%,marca.ilike.%${busca}%,modelo.ilike.%${busca}%,cidade.ilike.%${busca}%`);
  const { count: total } = await countQ;

  let titleText = "Caminhões à Venda";
  let subtitleText = "Encontre os melhores caminhões usados e seminovos com garantia de procedência.";

  if (marcaFiltro && estadoFiltro) {
    titleText = `Caminhões ${marcaFiltro} à Venda em ${estadoFiltro}`;
    subtitleText = `Confira os melhores anúncios de caminhões ${marcaFiltro} usados e seminovos em ${estadoFiltro}.`;
  } else if (marcaFiltro) {
    titleText = `Caminhões ${marcaFiltro} à Venda`;
    subtitleText = `Procurando caminhão ${marcaFiltro}? Veja as melhores ofertas de ${marcaFiltro} em todo o Brasil.`;
  } else if (estadoFiltro) {
    titleText = `Caminhões à Venda em ${estadoFiltro}`;
    subtitleText = `Veja anúncios de caminhões e implementos à venda no estado de ${estadoFiltro}.`;
  } else if (busca) {
    titleText = `Busca por "${busca}"`;
    subtitleText = `Resultados de busca para "${busca}" em caminhões e pesados.`;
  }

  return (
    <CategoryPageLayout
      title={titleText}
      subtitle={subtitleText}
      total={total ?? trucks.length}
      sidebar={
        <AnunciosSidebar
          contexto="caminhoes" q={busca} precoMin={min} precoMax={max === Infinity ? 2_000_000 : max}
          marcaFiltro={marcaFiltro} estadoFiltro={estadoFiltro} hasFilters={hasFilters}
          total={total ?? trucks.length} marcasDisponiveis={marcasComAnuncios}
          estadosDisponiveis={estadosComAnuncios} tracao={tracao} ano_min={ano_min} ano_max={ano_max}
        />
      }
    >
      <AnunciosFilters
        q={busca} faixaIdx={faixaIdx} marcaFiltro={marcaFiltro} estadoFiltro={estadoFiltro}
        hasFilters={hasFilters} total={total ?? trucks.length} categoriaAtiva="anuncios"
      />
      {trucks.length === 0 ? (
        <div className="cat-empty">
          <strong className="cat-empty-title">Nenhum anúncio encontrado</strong>
          <p className="cat-empty-desc">Tente outros filtros ou veja todos.</p>
          <Link href="/caminhoes" className="cat-empty-btn">Ver todos</Link>
        </div>
      ) : (
        <LoadMore
          key={`${busca}-${marcaFiltro}-${estadoFiltro}-${faixaIdx}`}
          initialTrucks={trucks} total={total ?? trucks.length} pageSize={24}
          q={busca} marca={marcaFiltro} estado={estadoFiltro} faixa={faixaIdx}
        />
      )}
    </CategoryPageLayout>
  );
}
