import { Suspense } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { TruckCard, type TruckCardData, type TruckImage } from "@/components/theme/TruckCard";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Caminhões à Venda | Todos os anúncios",
  description: "Veja todos os caminhões e implementos disponíveis. Filtre por marca, estado ou faixa de preço e fale direto pelo WhatsApp.",
};

type Truck = TruckCardData & { truck_images?: TruckImage[] };

const MARCAS = ["Todas", "Mercedes-Benz", "Scania", "Volvo", "Volkswagen", "Ford", "Iveco", "DAF"];

const ESTADOS = [
  { label: "Todos", value: "" },
  { label: "SC", value: "SC" },
  { label: "PR", value: "PR" },
  { label: "RS", value: "RS" },
  { label: "SP", value: "SP" },
  { label: "MG", value: "MG" },
  { label: "MS", value: "MS" },
  { label: "MT", value: "MT" },
  { label: "GO", value: "GO" },
  { label: "BA", value: "BA" },
  { label: "RJ", value: "RJ" },
  { label: "ES", value: "ES" },
];

const FAIXAS = [
  { label: "Todos os preços", min: 0, max: Infinity },
  { label: "Até R$100k", min: 0, max: 100_000 },
  { label: "R$100k–200k", min: 100_000, max: 200_000 },
  { label: "R$200k–400k", min: 200_000, max: 400_000 },
  { label: "Acima R$400k", min: 400_000, max: Infinity },
];

type PageProps = { searchParams: Promise<{ faixa?: string; marca?: string; estado?: string }> };

export default async function AnunciosPage({ searchParams }: PageProps) {
  const { faixa, marca, estado } = await searchParams;

  const faixaIdx = Math.max(0, Math.min(FAIXAS.length - 1, Number(faixa ?? 0)));
  const { min, max } = FAIXAS[faixaIdx];
  const marcaFiltro = MARCAS.includes(marca || "") && marca !== "Todas" ? marca : "";
  const estadoFiltro = ESTADOS.find((e) => e.value === estado)?.value || "";

  const supabase = await createClient();
  let query = supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, truck_images(image_url, principal, ordem)`)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .order("created_at", { ascending: false });

  if (min > 0) query = query.gte("preco", min) as typeof query;
  if (max !== Infinity) query = query.lte("preco", max) as typeof query;
  if (marcaFiltro) query = query.eq("marca", marcaFiltro) as typeof query;
  if (estadoFiltro) query = query.eq("estado", estadoFiltro) as typeof query;

  const { data } = await query;
  const trucks = (data || []) as Truck[];

  function buildHref(overrides: Record<string, string | number | undefined>) {
    const params: Record<string, string> = {};
    if (faixaIdx > 0) params.faixa = String(faixaIdx);
    if (marcaFiltro) params.marca = marcaFiltro;
    if (estadoFiltro) params.estado = estadoFiltro;
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === undefined || v === "" || v === 0) delete params[k];
      else params[k] = String(v);
    });
    const qs = new URLSearchParams(params).toString();
    return qs ? `/anuncios?${qs}` : "/anuncios";
  }

  const hasFilters = faixaIdx > 0 || !!marcaFiltro || !!estadoFiltro;

  return (
    <main className="market-page">
      <PublicHeader />
      <div className="market-container">

        <div className="al-header">
          <h1 className="al-title">Caminhões à Venda</h1>
          <p className="al-subtitle">{trucks.length} {trucks.length === 1 ? "anúncio encontrado" : "anúncios encontrados"}</p>
        </div>

        {/* Filtros */}
        <div className="al-filters-wrap">
          <div className="al-filter-group">
            <span className="al-filter-label">Marca</span>
            <div className="al-filter-row">
              {MARCAS.map((m) => {
                const active = m === "Todas" ? !marcaFiltro : marcaFiltro === m;
                const href = m === "Todas" ? buildHref({ marca: undefined }) : buildHref({ marca: m });
                return <Link key={m} href={href} className={`al-filter-btn${active ? " active" : ""}`}>{m}</Link>;
              })}
            </div>
          </div>

          <div className="al-filter-group">
            <span className="al-filter-label">Estado</span>
            <div className="al-filter-row">
              {ESTADOS.map((e) => {
                const active = estadoFiltro === e.value;
                const href = buildHref({ estado: e.value || undefined });
                return <Link key={e.value || "todos"} href={href} className={`al-filter-btn${active ? " active" : ""}`}>{e.label}</Link>;
              })}
            </div>
          </div>

          <div className="al-filter-group">
            <span className="al-filter-label">Preço</span>
            <div className="al-filter-row">
              {FAIXAS.map((f, idx) => {
                const active = faixaIdx === idx;
                const href = buildHref({ faixa: idx === 0 ? undefined : idx });
                return <Link key={idx} href={href} className={`al-filter-btn${active ? " active" : ""}`}>{f.label}</Link>;
              })}
            </div>
          </div>

          {hasFilters && (
            <Link href="/anuncios" className="al-clear-btn">✕ Limpar filtros</Link>
          )}
        </div>

        <Suspense fallback={null}>
          <section className="stock-grid">
            {trucks.map((truck) => (
              <TruckCard key={truck.id} truck={truck} />
            ))}

            {trucks.length === 0 && (
              <div className="market-empty">
                <strong>Nenhum anúncio encontrado</strong>
                <p>Tente outros filtros ou veja todos os caminhões.</p>
                <Link href="/anuncios" style={{ marginTop: 8, display: "inline-flex", padding: "10px 20px", borderRadius: 10, background: "var(--blue)", color: "#fff", fontWeight: 800 }}>Ver todos</Link>
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

        .al-filters-wrap { display: grid; gap: 14px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--line); }
        .al-filter-group { display: grid; gap: 7px; }
        .al-filter-label { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
        .al-filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .al-filter-btn { display: inline-flex; align-items: center; height: 34px; padding: 0 14px; border-radius: 999px; border: 1.5px solid var(--line); background: var(--soft); color: var(--muted); font-size: 12px; font-weight: 800; text-decoration: none; transition: border-color .15s, color .15s, background .15s; white-space: nowrap; }
        .al-filter-btn:hover { border-color: var(--blue); color: var(--blue); }
        .al-filter-btn.active { border-color: var(--blue); background: var(--blueSoft); color: var(--blue); }
        .al-clear-btn { display: inline-flex; align-self: start; align-items: center; height: 32px; padding: 0 14px; border-radius: 999px; border: 1.5px solid rgba(239,68,68,.35); background: rgba(239,68,68,.07); color: #f87171; font-size: 12px; font-weight: 800; text-decoration: none; transition: background .15s; }
        .al-clear-btn:hover { background: rgba(239,68,68,.14); }
      `}</style>
    </main>
  );
}
