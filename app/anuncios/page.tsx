import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData, type TruckImage } from "@/components/theme/TruckCard";
import { AnunciosFilters } from "./AnunciosFilters";
import { CategoryBrandsBar } from "@/components/theme/CategoryBrandsBar";
import { LoadMore } from "./LoadMore";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: "Caminhões à Venda | Todos os anúncios",
  description: "Veja todos os caminhões disponíveis. Filtre por marca, estado ou faixa de preço e fale direto pelo WhatsApp.",
};

const FAIXAS = [
  { min: 0, max: Infinity },
  { min: 0, max: 100_000 },
  { min: 100_000, max: 200_000 },
  { min: 200_000, max: 400_000 },
  { min: 400_000, max: Infinity },
];

const MARCAS_VALIDAS  = ["Mercedes-Benz","Scania","Volvo","Volkswagen","Ford","Iveco","DAF","MAN","Agrale"];
const ESTADOS_VALIDOS = ["SC","PR","RS","SP","MG","MS","MT","GO","BA","RJ","ES","PE","CE","PA","AM"];

type Truck = TruckCardData & { truck_images?: TruckImage[]; perfil?: string | null };
type PageProps = { searchParams: Promise<{ faixa?: string; marca?: string; estado?: string }> };

export default async function AnunciosPage({ searchParams }: PageProps) {
  const { faixa, marca, estado } = await searchParams;

  const faixaIdx     = Math.max(0, Math.min(FAIXAS.length - 1, Number(faixa ?? 0)));
  const { min, max } = FAIXAS[faixaIdx];
  const marcaFiltro  = MARCAS_VALIDAS.includes(marca   || "") ? marca!  : "";
  const estadoFiltro = ESTADOS_VALIDOS.includes(estado || "") ? estado! : "";
  const hasFilters   = faixaIdx > 0 || !!marcaFiltro || !!estadoFiltro;

  const supabase = await createClient();

  let countQ = supabase
    .from("trucks")
    .select("*", { count: "exact", head: true })
    .eq("status", "aprovado");
  if (marcaFiltro)      countQ = countQ.eq("marca",  marcaFiltro);
  if (estadoFiltro)     countQ = countQ.eq("estado", estadoFiltro);
  if (min > 0)          countQ = countQ.gte("preco", min);
  if (max !== Infinity) countQ = countQ.lte("preco", max);
  const { count: total } = await countQ;

  let dataQ = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,perfil,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado")
    .order("created_at", { ascending: false })
    .limit(24);
  if (marcaFiltro)      dataQ = dataQ.eq("marca",  marcaFiltro);
  if (estadoFiltro)     dataQ = dataQ.eq("estado", estadoFiltro);
  if (min > 0)          dataQ = dataQ.gte("preco", min);
  if (max !== Infinity) dataQ = dataQ.lte("preco", max);

  const { data } = await dataQ;
  const trucks = (data || []) as Truck[];

  return (
    <main className="market-page">
      <PublicHeader />
      <div className="market-container">
        <div className="al-header">
          <h1 className="al-title">Caminhões à Venda</h1>
        </div>
        <CategoryBrandsBar categoria="caminhoes" labelSingular="Caminhões" />
        <AnunciosFilters
          faixaIdx={faixaIdx}
          marcaFiltro={marcaFiltro}
          estadoFiltro={estadoFiltro}
          hasFilters={hasFilters}
          total={total ?? 0}
        />
        {trucks.length === 0 ? (
          <div className="market-empty">
            <strong>Nenhum caminhão encontrado</strong>
            <p>Tente outros filtros ou veja todos.</p>
            <Link href="/anuncios" style={{ marginTop: 8, display: "inline-flex", padding: "10px 20px", borderRadius: 10, background: "var(--blue)", color: "#fff", fontWeight: 800 }}>Ver todos</Link>
          </div>
        ) : (
          <LoadMore
            initialTrucks={trucks}
            total={total ?? 0}
            pageSize={24}
            marca={marcaFiltro}
            estado={estadoFiltro}
            faixa={faixaIdx}
          />
        )}
      </div>
      <SiteFooter />
      <style>{`
        .market-page { min-height: 100vh; background: var(--bg); color: var(--text); }
        .market-container { width: min(1280px, calc(100vw - 32px)); margin: 0 auto; padding-bottom: 64px; }
        .al-header { padding: 28px 0 16px; }
        .al-title { margin: 0; font-size: clamp(26px,4vw,38px); letter-spacing: -.04em; line-height: 1; }
        .market-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 72px 24px; text-align: center; color: var(--muted); background: var(--surface); border-radius: 20px; border: 1px solid var(--line); }
        .market-empty strong { font-size: 18px; color: var(--text); }
        .market-empty p { margin: 0; font-size: 14px; }
      `}</style>
    </main>
  );
}
