import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { AnunciosSidebar } from "@/components/AnunciosSidebar";
import { EmptyState } from "@/components/theme/EmptyState";
import Link from "next/link";
import { Truck, Container, Wrench, Tractor, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Implementos à Venda | Caminhões à Venda",
  description: "Implementos rodoviários à venda: caçambas, munks, pranchas, baús, tanques, plataformas e muito mais.",
  alternates: { canonical: "/comprar/implementos" },
};

type PageProps = {
  searchParams: Promise<{
    tipo?: string;
    estado?: string;
    q?: string;
    marca?: string;
    pmin?: string;
    pmax?: string;
  }>
};

export default async function ImplementosPage({ searchParams }: PageProps) {
  const { tipo, estado, q, marca, pmin, pmax } = await searchParams;

  const supabase = await createClient();
  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado").eq("perfil", "Implementos")
    .order("created_at", { ascending: false });

  if (estado) query = query.eq("estado", estado);
  if (tipo)   query = query.eq("carroceria", tipo);
  if (q) query = query.or(`titulo.ilike.%${q}%,marca.ilike.%${q}%,modelo.ilike.%${q}%`);
  if (marca) query = query.ilike("marca", marca);
  if (pmin) query = query.gte("preco", Number(pmin));
  if (pmax) query = query.lte("preco", Number(pmax));

  const [{ data }, { data: facetData }] = await Promise.all([
    query.limit(48),
    supabase
      .from("trucks")
      .select("marca,estado")
      .eq("status", "aprovado")
      .eq("perfil", "Implementos")
      .eq("vendido", false),
  ]);

  const implementos = (data || []) as TruckCardData[];

  const marcasDisponiveis = [...new Set(
    (facetData || []).map((t) => t.marca).filter(Boolean)
  )].sort() as string[];

  const estadosDisponiveis = [...new Set(
    (facetData || []).map((t) => t.estado).filter(Boolean)
  )].sort() as string[];

  const hasFilters = !!(tipo || estado || q || marca || pmin || pmax);

  return (
    <div className="impl-page">
      <PublicHeader />
      <div className="impl-cta">
        <div className="impl-cta-inner">
          <div>
            <h1 className="impl-title">Implementos à Venda</h1>
            <p className="impl-sub">Caçambas, munks, pranchas, baús, tanques e muito mais. Contato direto pelo WhatsApp.</p>
          </div>
          <Link href="/painel/anuncios/novo/implemento" className="impl-anuncie">+ Anunciar implemento</Link>
        </div>
      </div>

      <div className="impl-container">
        <div className="category-layout">
          <div className="sticky top-24 self-start w-64">
            <AnunciosSidebar
              contexto="implementos"
              q={q || ""}
              marcaFiltro={marca || ""}
              estadoFiltro={estado || ""}
              hasFilters={hasFilters}
              total={implementos.length}
              marcasDisponiveis={marcasDisponiveis}
              estadosDisponiveis={estadosDisponiveis}
              tipo={tipo}
              precoMin={pmin ? Number(pmin) : 0}
              precoMax={pmax ? Number(pmax) : 2_000_000}
            />
          </div>

          <div className="category-content">
            {implementos.length > 0 ? (
              <>
                <p className="impl-count">{implementos.length} implemento{implementos.length !== 1 ? "s" : ""}</p>
                <div className="impl-grid">{implementos.map((item) => <TruckCard key={item.id} truck={item} />)}</div>
              </>
            ) : (
              <EmptyState
                icon={<Wrench size={48} strokeWidth={1.5} />}
                title="Nenhum implemento encontrado"
                description={
                  hasFilters
                    ? "Tente outros filtros ou veja todos os anúncios."
                    : "Nenhum implemento disponível no momento."
                }
                primaryHref="/comprar/implementos"
                primaryLabel="Ver todos os implementos"
                suggestions={[
                  { href: "/comprar/carretas",  label: "Carretas",  icon: <Container size={16} /> },
                  { href: "/comprar/caminhoes",  label: "Caminhões", icon: <Truck size={16} /> },
                  { href: "/comprar/maquinas",  label: "Máquinas",  icon: <Tractor size={16} /> },
                  { href: "/comprar/pecas",     label: "Peças",     icon: <Package size={16} /> },
                ]}
                announceHref="/painel/anuncios/novo/implemento"
                announceLabel="Anuncie seu implemento"
              />
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
      <style>{`
        .impl-page { min-height: 100vh; background: var(--bg); color: var(--text); padding-bottom: 64px; }
        .impl-cta { background: var(--surface); border-bottom: 1px solid var(--line); margin-bottom: 24px; }
        .category-layout { display: flex; gap: 32px; align-items: flex-start; }
        .category-content { flex: 1; }
        .impl-cta-inner { width: min(1280px, calc(100vw - 32px)); margin: 0 auto; padding: 28px 0 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
        .impl-title { margin: 0 0 4px; font-size: clamp(26px,3.5vw,38px); letter-spacing: -.04em; line-height: 1.05; }
        .impl-sub { margin: 0; color: var(--muted); font-size: 14px; font-weight: 600; max-width: 54ch; line-height: 1.5; }
        .impl-anuncie { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 22px; border-radius: 12px; background: var(--blue); color: #fff; font-weight: 900; font-size: 14px; white-space: nowrap; text-decoration: none; flex-shrink: 0; transition: background .14s; }
        .impl-anuncie:hover { background: var(--blue2); }
        .impl-container { width: min(1280px, calc(100vw - 32px)); margin: 0 auto; }
        .impl-count { margin: 0 0 14px; font-size: 13px; color: var(--muted); font-weight: 700; }
        .impl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
        @media (max-width: 900px) {
          .category-layout { flex-direction: column; }
          .w-64 { width: 100% !important; position: static !important; }
        }
        @media (max-width: 680px) { .impl-cta-inner { flex-direction: column; align-items: flex-start; } .impl-anuncie { width: 100%; } .impl-grid { grid-template-columns: repeat(2,1fr); gap: 10px; } }
      `}</style>
    </div>
  );
}
