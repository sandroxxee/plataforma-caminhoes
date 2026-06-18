import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { AnunciosSidebar } from "../anuncios/AnunciosSidebar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Caminhões à Venda | Caminhões à Venda",
  description: "Caminhões usados e seminovos de todas as marcas. Toco, truck, bi-truck, cavalo mecânico. Negociação direta pelo WhatsApp.",
  alternates: { canonical: "/caminhoes" },
};

type PageProps = {
  searchParams: Promise<{
    estado?: string;
    marca?: string;
    tracao?: string;
    carroceria?: string;
    faixa?: string;
    pmin?: string;
    pmax?: string;
    q?: string;
  }>
};

export default async function CaminhoesPage({ searchParams }: PageProps) {
  const { estado, marca, tracao, carroceria, faixa, pmin, pmax, q: searchQ } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado")
    .eq("perfil", "Caminhões")
    .order("created_at", { ascending: false });

  if (estado) query = query.eq("estado", estado);
  if (marca) query = query.ilike("marca", marca);
  if (tracao) query = query.eq("tracao", tracao);
  if (carroceria) query = query.eq("carroceria", carroceria);
  if (pmin) query = query.gte("preco", Number(pmin));
  if (pmax) query = query.lte("preco", Number(pmax));
  if (searchQ) query = query.or(`titulo.ilike.%${searchQ}%,marca.ilike.%${searchQ}%,modelo.ilike.%${searchQ}%`);

  const [{ data }, { data: facetData }] = await Promise.all([
    query.limit(48),
    supabase
      .from("trucks")
      .select("marca,estado")
      .eq("status", "aprovado")
      .eq("perfil", "Caminhões")
      .eq("vendido", false),
  ]);

  const caminhoes = (data || []) as TruckCardData[];

  const marcasDisponiveis = [...new Set(
    (facetData || []).map((t) => t.marca).filter(Boolean)
  )].sort() as string[];

  const estadosDisponiveis = [...new Set(
    (facetData || []).map((t) => t.estado).filter(Boolean)
  )].sort() as string[];

  const hasFilters = !!(estado || marca || tracao || carroceria || faixa || pmin || pmax || searchQ);

  return (
    <main className="market-page">
      <PublicHeader />

      <div className="market-container">
        <div className="category-layout">
          <AnunciosSidebar
            q={searchQ || ""}
            faixaIdx={Number(faixa) || 0}
            marcaFiltro={marca || ""}
            estadoFiltro={estado || ""}
            hasFilters={hasFilters}
            total={caminhoes.length}
            categoriaAtiva="caminhoes"
            marcasDisponiveis={marcasDisponiveis}
            estadosDisponiveis={estadosDisponiveis}
            precoMin={pmin ? Number(pmin) : 0}
            precoMax={pmax ? Number(pmax) : 2_000_000}
          />

          <div className="category-content">
            <div className="category-header">
              <div>
                <h1 className="category-title">Caminhões à Venda</h1>
                <p className="category-sub">Toco, truck, bi-truck, cavalo mecânico — todas as marcas e modelos.</p>
              </div>
              <Link href="/anunciar" className="category-btn">Anunciar Caminhão</Link>
            </div>

            {caminhoes.length > 0 ? (
              <div className="category-grid">
                {caminhoes.map(item => <TruckCard key={item.id} truck={item} />)}
              </div>
            ) : (
              <div className="category-empty">
                <span>🚛</span>
                <strong>Nenhum caminhão encontrado com esses filtros</strong>
                <Link href="/caminhoes" className="category-btn-outline">Limpar Filtros</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
