import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { AnunciosSidebar } from "@/components/AnunciosSidebar";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { EmptyState } from "@/components/theme/EmptyState";
import Link from "next/link";
import { Truck, Container, Wrench, Tractor, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { marca, estado, q, tipo } = await searchParams;
  const marcaFiltro = marca ? String(marca).trim() : "";
  const estadoFiltro = estado ? String(estado).trim() : "";
  const tipoFiltro = tipo ? String(tipo).trim() : "";
  const busca = (q || "").trim().slice(0, 100);

  let title = "Implementos à Venda | Caçambas, baús e munks usados e seminovos";
  let description = "Encontre implementos rodoviários à venda: caçambas, munks, pranchas, baús, tanques, plataformas e muito mais. Fale pelo WhatsApp.";

  if (marcaFiltro && estadoFiltro) {
    title = `Implementos ${marcaFiltro} à Venda em ${estadoFiltro} | Caminhões à Venda`;
    description = `Confira os anúncios de implementos ${marcaFiltro} usados e seminovos em ${estadoFiltro}. Entre em contato pelo WhatsApp.`;
  } else if (marcaFiltro) {
    title = `Implementos ${marcaFiltro} à Venda | Ofertas de ${marcaFiltro}`;
    description = `Veja ofertas de implementos rodoviários da marca ${marcaFiltro} e negocie direto com o vendedor.`;
  } else if (estadoFiltro) {
    title = `Implementos à Venda em ${estadoFiltro} | Ofertas em ${estadoFiltro}`;
    description = `Veja os anúncios de implementos rodoviários à venda no estado de ${estadoFiltro}. Fale direto pelo WhatsApp.`;
  } else if (tipoFiltro) {
    title = `Implementos do tipo ${tipoFiltro} à Venda | Caminhões à Venda`;
    description = `Confira ofertas de implementos rodoviários do tipo ${tipoFiltro} à venda. Contato direto via WhatsApp.`;
  } else if (busca) {
    title = `Busca por "${busca}" em Implementos | Caminhões à Venda`;
    description = `Resultados de busca para "${busca}" em implementos no nosso portal.`;
  }

  return {
    title,
    description,
    alternates: { canonical: "/comprar/implementos" },
  };
}

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
