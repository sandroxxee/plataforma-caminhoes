import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData, type TruckImage } from "@/components/theme/TruckCard";
import { AnunciosFilters } from "./AnunciosFilters";
import { AnunciosSidebar } from "./AnunciosSidebar";
import { LoadMore } from "./LoadMore";
import Link from "next/link";
import { MARCAS_VALIDAS, ESTADOS_VALIDOS, FAIXAS } from "@/lib/constants";

export const revalidate = 30;

export const metadata = {
  title: "Caminhões à Venda | Todos os anúncios",
  description: "Veja todos os caminhões disponíveis. Filtre por marca, estado ou faixa de preço e fale direto pelo WhatsApp.",
};

type Truck = TruckCardData & { truck_images?: TruckImage[]; perfil?: string | null };
type PageProps = { searchParams: Promise<{ faixa?: string; marca?: string; estado?: string; q?: string }> };

export default async function AnunciosPage({ searchParams }: PageProps) {
  const { faixa, marca, estado, q } = await searchParams;

  const faixaIdx     = Math.max(0, Math.min(FAIXAS.length - 1, Number(faixa ?? 0)));
  const { min, max } = FAIXAS[faixaIdx];
  const marcaFiltro  = MARCAS_VALIDAS.includes(marca   || "") ? marca!  : "";
  const estadoFiltro = ESTADOS_VALIDOS.includes(estado || "") ? estado! : "";
  const busca        = (q || "").trim().slice(0, 100);
  const hasFilters   = faixaIdx > 0 || !!marcaFiltro || !!estadoFiltro || !!busca;

  const supabase = await createClient();

  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,perfil,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .or("perfil.is.null,perfil.not.in.(Carretas,Implementos,Peças,Máquinas)")
    .order("created_at", { ascending: false })
    .limit(24);

  if (marcaFiltro)      query = query.ilike("marca",  marcaFiltro);
  if (estadoFiltro)     query = query.eq("estado", estadoFiltro);
  if (min > 0)          query = query.gte("preco", min);
  if (max !== Infinity) query = query.lte("preco", max);
  if (busca)            query = query.or(`titulo.ilike.%${busca}%,marca.ilike.%${busca}%,modelo.ilike.%${busca}%,cidade.ilike.%${busca}%`);

  const { data } = await query;
  const trucks = (data || []) as Truck[];

  let countQ = supabase
    .from("trucks")
    .select("*", { count: "exact", head: true })
    .eq("status", "aprovado")
    .eq("vendido", false)
    .or("perfil.is.null,perfil.not.in.(Carretas,Implementos,Peças,Máquinas)");
  if (marcaFiltro)      countQ = countQ.ilike("marca",  marcaFiltro);
  if (estadoFiltro)     countQ = countQ.eq("estado", estadoFiltro);
  if (min > 0)          countQ = countQ.gte("preco", min);
  if (max !== Infinity) countQ = countQ.lte("preco", max);
  if (busca)            countQ = countQ.or(`titulo.ilike.%${busca}%,marca.ilike.%${busca}%,modelo.ilike.%${busca}%,cidade.ilike.%${busca}%`);
  const { count: total } = await countQ;

  return (
    <main className="market-page">
      <PublicHeader />

      <div className="mp-shell">
        {/* ── SIDEBAR DESKTOP ── */}
        <aside className="mp-sidebar">
          <AnunciosSidebar
            q={busca}
            faixaIdx={faixaIdx}
            marcaFiltro={marcaFiltro}
            estadoFiltro={estadoFiltro}
            hasFilters={hasFilters}
            total={total ?? trucks.length}
            categoriaAtiva="anuncios"
          />
        </aside>

        {/* ── CONTEÚDO ── */}
        <section className="mp-main">
          {/* topbar (busca + drawer mobile + contador desktop) */}
          <AnunciosFilters
            q={busca}
            faixaIdx={faixaIdx}
            marcaFiltro={marcaFiltro}
            estadoFiltro={estadoFiltro}
            hasFilters={hasFilters}
            total={total ?? trucks.length}
            categoriaAtiva="anuncios"
          />

          {trucks.length === 0 ? (
            <div className="market-empty">
              <strong>Nenhum anúncio encontrado</strong>
              <p>Tente outros filtros ou veja todos.</p>
              <Link href="/anuncios" style={{ marginTop: 8, display: "inline-flex", padding: "10px 20px", borderRadius: 10, background: "var(--blue)", color: "#fff", fontWeight: 800 }}>Ver todos</Link>
            </div>
          ) : (
            <LoadMore
              key={`${busca}-${marcaFiltro}-${estadoFiltro}-${faixaIdx}`}
              initialTrucks={trucks}
              total={total ?? trucks.length}
              pageSize={24}
              q={busca}
              marca={marcaFiltro}
              estado={estadoFiltro}
              faixa={faixaIdx}
            />
          )}
        </section>
      </div>

      <SiteFooter />

      <style>{`
        .mp-shell {
          width: min(1400px, calc(100vw - 32px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 24px;
          padding-top: 24px;
          padding-bottom: 64px;
          align-items: start;
        }
        .mp-sidebar {
          position: sticky; top: 80px;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: var(--shadow);
        }
        .mp-main { min-width: 0; }
        @media (max-width: 900px) {
          .mp-shell { grid-template-columns: 1fr; }
          .mp-sidebar { display: none; }
        }
      `}</style>
    </main>
  );
}
