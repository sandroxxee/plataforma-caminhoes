import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { AnunciosSidebar } from "@/components/AnunciosSidebar";
import { CategoryBrandsBar } from "@/components/theme/CategoryBrandsBar";
import { EmptyState } from "@/components/theme/EmptyState";
import { Tractor, Container, Truck, Package, Wrench } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Máquinas Pesadas à Venda | Caminhões à Venda",
  description: "Escavadeiras, pás-carregadeiras, motoniveladoras, rolos e muito mais. Negociação direta pelo WhatsApp.",
  alternates: { canonical: "/comprar/maquinas" },
};

type PageProps = {
  searchParams: Promise<{
    estado?: string;
    tipo?: string;
    q?: string;
    marca?: string;
    pmin?: string;
    pmax?: string;
  }>
};

export default async function MaquinasPage({ searchParams }: PageProps) {
  const { estado, tipo, q: searchQ, marca, pmin, pmax } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado")
    .eq("perfil", "Máquinas")
    .order("created_at", { ascending: false });

  if (estado) query = query.eq("estado", estado);
  if (tipo)   query = query.eq("carroceria", tipo);
  if (searchQ) query = query.or(`titulo.ilike.%${searchQ}%,marca.ilike.%${searchQ}%,modelo.ilike.%${searchQ}%`);
  if (marca) query = query.ilike("marca", marca);
  if (pmin) query = query.gte("preco", Number(pmin));
  if (pmax) query = query.lte("preco", Number(pmax));

  const [{ data }, { data: facetData }] = await Promise.all([
    query.limit(48),
    supabase
      .from("trucks")
      .select("marca,estado")
      .eq("status", "aprovado")
      .eq("perfil", "Máquinas")
      .eq("vendido", false),
  ]);

  const maquinas = (data || []) as TruckCardData[];

  const marcasDisponiveis = [...new Set(
    (facetData || []).map((t) => t.marca).filter(Boolean)
  )].sort() as string[];

  const estadosDisponiveis = [...new Set(
    (facetData || []).map((t) => t.estado).filter(Boolean)
  )].sort() as string[];

  const hasFilters = !!(estado || tipo || searchQ || marca || pmin || pmax);

  return (
    <div className="maq-page">
      <PublicHeader />
      <div className="maq-cta">
        <div className="maq-cta-inner">
          <div>
            <h1 className="maq-title">Máquinas Pesadas à Venda</h1>
            <p className="maq-sub">Escavadeiras, pás-carregadeiras, motoniveladoras, rolos e muito mais. Direto pelo WhatsApp.</p>
          </div>
          <Link href="/painel/anuncios/novo/maquina" className="maq-anuncie">+ Anunciar máquina</Link>
        </div>
      </div>
      <div className="maq-container">
        <div className="category-layout">
          <div className="sticky top-24 self-start w-64">
            <AnunciosSidebar
              contexto="maquinas"
              q={searchQ || ""}
              marcaFiltro={marca || ""}
              estadoFiltro={estado || ""}
              hasFilters={hasFilters}
              total={maquinas.length}
              marcasDisponiveis={marcasDisponiveis}
              estadosDisponiveis={estadosDisponiveis}
              tipo={tipo}
              precoMin={pmin ? Number(pmin) : 0}
              precoMax={pmax ? Number(pmax) : 2_000_000}
            />
          </div>

          <div className="category-content">
            <CategoryBrandsBar categoria="maquinas" labelSingular="Máquinas" />
            {maquinas.length > 0 ? (
              <>
                <p className="maq-count">{maquinas.length} máquina{maquinas.length!==1?"s":""}</p>
                <div className="maq-grid">{maquinas.map(item => <TruckCard key={item.id} truck={item} />)}</div>
              </>
            ) : (
              <EmptyState
                icon={<Tractor size={48} strokeWidth={1.5} />}
                title="Nenhuma máquina encontrada"
                description={hasFilters ? "Tente outros filtros ou veja todos os anúncios." : "Nenhuma máquina disponível no momento."}
                primaryHref="/comprar/maquinas"
                primaryLabel="Ver todas as máquinas"
                suggestions={[
                  { href: "/comprar/caminhoes", label: "Caminhões", icon: <Truck size={16} /> },
                  { href: "/comprar/carretas", label: "Carretas", icon: <Container size={16} /> },
                  { href: "/comprar/implementos", label: "Implementos", icon: <Wrench size={16} /> },
                  { href: "/comprar/pecas", label: "Peças", icon: <Package size={16} /> },
                ]}
                announceHref="/painel/anuncios/novo/maquina"
                announceLabel="Anuncie sua máquina"
              />
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
      <style>{`
        .maq-page{min-height:100vh;background:var(--bg);color:var(--text);padding-bottom:64px}
        .maq-cta{background:#fff;border-bottom:1px solid rgba(148,163,184,0.12);box-shadow:0 4px 12px rgba(0,0,0,0.02);margin-bottom:24px}
        .category-layout { display: flex; gap: 32px; align-items: flex-start; }
        .category-content { flex: 1; }
        .maq-cta-inner{width:min(1280px,calc(100vw - 32px));margin:0 auto;padding:32px 0 28px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
        .maq-title{margin:0 0 6px;font-size:clamp(28px,4vw,42px);font-weight:800;letter-spacing:-.04em;line-height:1.05;color:#0f172a}
        .maq-sub{margin:0;color:#64748b;font-size:15px;font-weight:600;max-width:54ch;line-height:1.6}
        .maq-anuncie{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 24px;border-radius:14px;background:var(--blue);color:#fff;font-weight:800;font-size:14px;white-space:nowrap;text-decoration:none;flex-shrink:0;transition:all .14s;box-shadow:0 4px 12px rgba(24,119,242,0.2)}
        .maq-anuncie:hover{background:var(--blue2);transform:translateY(-1px)}
        .maq-container{width:min(1280px,calc(100vw - 32px));margin:0 auto}
        .maq-count{margin:16px 0;font-size:14px;color:#64748b;font-weight:700}
        .maq-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
        @media (max-width: 900px) {
          .category-layout { flex-direction: column; }
          .w-64 { width: 100% !important; position: static !important; }
        }
        @media(max-width:680px){.maq-cta-inner{flex-direction:column;align-items:flex-start;padding:24px 0}.maq-anuncie{width:100%}.maq-grid{grid-template-columns:repeat(2,1fr);gap:12px}}
      `}</style>
    </div>
  );
}
