import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { AnunciosSidebar } from "../anuncios/AnunciosSidebar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Carretas à Venda | Caminhões à Venda",
  description: "Graneleiras, porta-containers, pranchas, frigoríficas e tanques. Negociação direta pelo WhatsApp.",
  alternates: { canonical: "/carretas" },
};

type PageProps = { 
  searchParams: Promise<{ 
    estado?: string;
    marca?: string;
    faixa?: string;
    q?: string;
  }> 
};

export default async function CarretasPage({ searchParams }: PageProps) {
  const { estado, marca, faixa, q: searchQ } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado")
    .eq("perfil", "Carretas")
    .order("created_at", { ascending: false });

  if (estado) query = query.eq("estado", estado);
  if (marca) query = query.eq("marca", marca);
  if (searchQ) query = query.ilike("titulo", `%${searchQ}%`);

  const { data } = await query.limit(48);
  const carretas = (data || []) as TruckCardData[];

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
            hasFilters={!!(estado || marca || faixa || searchQ)}
            total={carretas.length}
            categoriaAtiva="carretas"
          />

          <div className="category-content">
            <div className="category-header">
              <div>
                <h1 className="category-title">Carretas à Venda</h1>
                <p className="category-sub">Explore as melhores ofertas de carretas em todo o Brasil.</p>
              </div>
              <Link href="/anunciar" className="category-btn">Anunciar Carreta</Link>
            </div>

            {carretas.length > 0 ? (
              <div className="category-grid">
                {carretas.map(item => <TruckCard key={item.id} truck={item} />)}
              </div>
            ) : (
              <div className="category-empty">
                <span>🚛</span>
                <strong>Nenhuma carreta encontrada com esses filtros</strong>
                <Link href="/carretas" className="category-btn-outline">Limpar Filtros</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
