import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData, type TruckImage } from "@/components/theme/TruckCard";
import { AnunciosFilters } from "./AnunciosFilters";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: "Caminhões à Venda | Todos os anúncios",
  description: "Veja todos os caminhões e implementos disponíveis. Filtre por marca, estado ou faixa de preço e fale direto pelo WhatsApp.",
};

const FAIXAS = [
  { min: 0,       max: Infinity },
  { min: 0,       max: 100_000 },
  { min: 100_000, max: 200_000 },
  { min: 200_000, max: 400_000 },
  { min: 400_000, max: Infinity },
];

const MARCAS_VALIDAS = ["Mercedes-Benz", "Scania", "Volvo", "Volkswagen", "Ford", "Iveco", "DAF"];
const ESTADOS_VALIDOS = ["SC","PR","RS","SP","MG","MS","MT","GO","BA","RJ","ES"];

type Truck = TruckCardData & { truck_images?: TruckImage[] };
type PageProps = { searchParams: Promise<{ faixa?: string; marca?: string; estado?: string }> };

export default async function AnunciosPage({ searchParams }: PageProps) {
  const { faixa, marca, estado } = await searchParams;

  const faixaIdx    = Math.max(0, Math.min(FAIXAS.length - 1, Number(faixa ?? 0)));
  const { min, max } = FAIXAS[faixaIdx];
  const marcaFiltro  = MARCAS_VALIDAS.includes(marca  || "") ? marca!  : "";
  const estadoFiltro = ESTADOS_VALIDOS.includes(estado || "") ? estado! : "";
  const hasFilters   = faixaIdx > 0 || !!marcaFiltro || !!estadoFiltro;

  const supabase = await createClient();
  const { data } = await supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .order("created_at", { ascending: false })
    .limit(300);

  let trucks = (data || []) as Truck[];
  if (min > 0)          trucks = trucks.filter((t) => (t.preco ?? 0) >= min);
  if (max !== Infinity) trucks = trucks.filter((t) => (t.preco ?? 0) <= max);
  if (marcaFiltro)      trucks = trucks.filter((t) => t.marca  === marcaFiltro);
  if (estadoFiltro)     trucks = trucks.filter((t) => t.estado === estadoFiltro);

  return (
    <main className="market-page">
      <PublicHeader />

      <div className="market-container">
        <div className="al-header">
          <h1 className="al-title">Caminhões à Venda</h1>
        </div>

        <AnunciosFilters
          faixaIdx={faixaIdx}
          marcaFiltro={marcaFiltro}
          estadoFiltro={estadoFiltro}
          hasFilters={hasFilters}
          total={trucks.length}
        />

        <section className="stock-grid" aria-label="Lista de anúncios">
          {trucks.map((truck) => (
            <TruckCard key={truck.id} truck={truck} />
          ))}
          {trucks.length === 0 && (
            <div className="market-empty">
              <strong>Nenhum anúncio encontrado</strong>
              <p>Tente outros filtros ou veja todos os caminhões.</p>
              <Link
                href="/anuncios"
                style={{ marginTop: 8, display: "inline-flex", padding: "10px 20px", borderRadius: 10, background: "var(--blue)", color: "#fff", fontWeight: 800 }}
              >
                Ver todos
              </Link>
            </div>
          )}
        </section>
      </div>

      <SiteFooter />

      <style>{`
        .al-header { padding: 28px 0 4px; }
        .al-title {
          margin: 0; font-size: clamp(26px,4vw,38px);
          letter-spacing: -.04em; line-height: 1;
        }
      `}</style>
    </main>
  );
}
