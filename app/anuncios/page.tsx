import { Suspense } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { getCardTitle, getLocation, formatMoney, type TruckCardData, type TruckImage } from "@/components/theme/TruckCard";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Caminhões à Venda | Todos os anúncios",
  description: "Veja todos os caminhões e implementos disponíveis. Filtre por faixa de preço e fale direto pelo WhatsApp.",
};

type Truck = TruckCardData & { truck_images?: TruckImage[] };

const FAIXAS = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "Até R$100k", min: 0, max: 100_000 },
  { label: "R$100k–200k", min: 100_000, max: 200_000 },
  { label: "R$200k–400k", min: 200_000, max: 400_000 },
  { label: "Acima R$400k", min: 400_000, max: Infinity },
];

function getMainImage(truck: Truck) {
  const imgs = truck.truck_images || [];
  return imgs.find((i) => i.principal)?.image_url || imgs[0]?.image_url || "";
}

type PageProps = { searchParams: Promise<{ faixa?: string }> };

export default async function AnunciosPage({ searchParams }: PageProps) {
  const { faixa } = await searchParams;
  const faixaIdx = Math.max(0, Math.min(FAIXAS.length - 1, Number(faixa ?? 0)));
  const { min, max } = FAIXAS[faixaIdx];

  const supabase = await createClient();
  let query = supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, truck_images(image_url, principal, ordem)`)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .order("created_at", { ascending: false });

  if (min > 0) query = query.gte("preco", min) as typeof query;
  if (max !== Infinity) query = query.lte("preco", max) as typeof query;

  const { data } = await query;
  const trucks = (data || []) as Truck[];

  return (
    <main className="market-page">
      <PublicHeader />
      <div className="market-container">

        <div className="al-header">
          <h1 className="al-title">Caminhões à Venda</h1>
          <p className="al-subtitle">{trucks.length} {trucks.length === 1 ? "anúncio encontrado" : "anúncios encontrados"}</p>
        </div>

        {/* Filtro de faixa de preço */}
        <div className="al-filters">
          {FAIXAS.map((f, idx) => (
            <Link
              key={idx}
              href={idx === 0 ? "/anuncios" : `/anuncios?faixa=${idx}`}
              className={`al-filter-btn${faixaIdx === idx ? " active" : ""}`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <Suspense fallback={null}>
          <section className="al-grid">
            {trucks.map((truck) => {
              const image = getMainImage(truck);
              const title = getCardTitle(truck);
              const location = getLocation(truck);
              const year = truck.ano_modelo || truck.ano_fabricacao;

              return (
                <Link key={truck.id} href={`/anuncios/${truck.id}`} className="al-card">
                  <div className="al-photo">
                    {image ? (
                      <img src={image} alt={title} loading="lazy" decoding="async" />
                    ) : (
                      <div className="al-photo-empty">🚛</div>
                    )}
                  </div>
                  <div className="al-body">
                    <strong className="al-car-title">{title}</strong>
                    {year && <span className="al-year">{year}</span>}
                    <span className="al-location">📍 {location}</span>
                    <strong className="al-price">{formatMoney(truck.preco)}</strong>
                  </div>
                </Link>
              );
            })}

            {trucks.length === 0 && (
              <div className="al-empty">
                <p>Nenhum anúncio nesta faixa de preço.</p>
                <Link href="/anuncios" className="al-empty-link">Ver todos</Link>
              </div>
            )}
          </section>
        </Suspense>
      </div>

      <SiteFooter />

      <style>{`
        .al-header { padding: 28px 0 12px; }
        .al-title { margin: 0 0 4px; font-size: clamp(26px, 4vw, 38px); letter-spacing: -.04em; line-height: 1; }
        .al-subtitle { margin: 0; color: var(--muted); font-size: 14px; font-weight: 750; }

        /* Filtros */
        .al-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--line);
        }
        .al-filter-btn {
          display: inline-flex;
          align-items: center;
          height: 36px;
          padding: 0 16px;
          border-radius: 999px;
          border: 1.5px solid var(--line);
          background: var(--soft);
          color: var(--muted);
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          transition: border-color .15s, color .15s, background .15s;
          white-space: nowrap;
        }
        .al-filter-btn:hover { border-color: var(--blue); color: var(--blue); }
        .al-filter-btn.active { border-color: var(--blue); background: var(--blueSoft); color: var(--blue); }

        /* Grid */
        .al-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }

        /* Card */
        .al-card {
          border-radius: 18px;
          border: 1.5px solid var(--line);
          background: var(--card);
          text-decoration: none;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: border-color .18s, box-shadow .18s, transform .18s;
        }
        .al-card:hover {
          border-color: var(--blue);
          box-shadow: 0 10px 32px rgba(0,0,0,.1);
          transform: translateY(-2px);
        }
        .al-photo { height: 180px; background: var(--soft); overflow: hidden; }
        .al-photo img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .35s; }
        .al-card:hover .al-photo img { transform: scale(1.05); }
        .al-photo-empty { width: 100%; height: 100%; display: grid; place-items: center; font-size: 40px; opacity: .3; }
        .al-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .al-car-title { font-size: 15px; font-weight: 950; color: var(--text); line-height: 1.2; letter-spacing: -.02em; }
        .al-year { font-size: 12px; color: var(--muted); font-weight: 750; }
        .al-location { font-size: 12px; color: var(--muted); font-weight: 750; margin-top: 2px; }
        .al-price { font-size: 18px; font-weight: 950; color: var(--blue); letter-spacing: -.03em; margin-top: auto; padding-top: 8px; }

        /* Empty */
        .al-empty { grid-column: 1/-1; text-align: center; padding: 40px; color: var(--muted); }
        .al-empty-link { display: inline-flex; margin-top: 12px; padding: 10px 20px; border-radius: 10px; background: var(--blue); color: #fff; font-weight: 800; text-decoration: none; }

        @media (max-width: 560px) {
          .al-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .al-photo { height: 130px; }
          .al-body { padding: 10px 12px; }
          .al-car-title { font-size: 13px; }
          .al-price { font-size: 15px; }
          .al-filters { gap: 6px; margin-bottom: 16px; }
          .al-filter-btn { height: 32px; padding: 0 12px; font-size: 12px; }
        }
      `}</style>
    </main>
  );
}
