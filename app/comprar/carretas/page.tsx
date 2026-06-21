import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { AnunciosSidebar } from "../caminhoes/AnunciosSidebar";
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
  }>
};

export default async function CarretasPage({ searchParams }: PageProps) {
  const { estado, marca, faixa, pmin, pmax, q: searchQ } = await searchParams;
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
            total={carretas.length}
            categoriaAtiva="carretas"
            marcasDisponiveis={marcasDisponiveis}
            estadosDisponiveis={estadosDisponiveis}
            precoMin={pmin ? Number(pmin) : 0}
            precoMax={pmax ? Number(pmax) : 2_000_000}
          />

          <div className="category-content">
            <div className="category-header">
              <div>
                <h1 className="category-title">Carretas à Venda</h1>
                <p className="category-sub">Graneleiras, porta-containers, pranchas, frigoríficas e muito mais.</p>
              </div>
              <Link href="/anunciar" className="category-btn">Anunciar Carreta</Link>
            </div>

            {carretas.length > 0 ? (
              <div className="category-grid">
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
        </div>
      </div>

      <style>{`
        .category-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 32px; background: #fff; border-radius: 24px;
          border: 1px solid rgba(148,163,184,0.12); margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .category-title { margin: 0 0 4px; font-size: 32px; font-weight: 800; letter-spacing: -0.03em; color: #0f172a; }
        .category-sub { margin: 0; color: #64748b; font-size: 15px; font-weight: 600; }
        .category-btn {
          display: inline-flex; align-items: center; height: 46px; padding: 0 24px;
          border-radius: 14px; background: var(--blue); color: #fff;
          font-weight: 800; font-size: 14px; text-decoration: none;
          transition: all 0.2s; box-shadow: 0 4px 12px rgba(24,119,242,0.2);
        }
        .category-btn:hover { background: var(--blue2); transform: translateY(-1px); }
        .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        @media (max-width: 900px) {
          .category-header { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px; }
          .category-btn { width: 100%; justify-content: center; }
          .category-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
      `}</style>
      <SiteFooter />
    </main>
  );
}
