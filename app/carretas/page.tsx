import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { CategoryBrandsBar } from "@/components/theme/CategoryBrandsBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Carretas à Venda | Caminhões à Venda",
  description: "Veja carretas e semirreboques à venda: graneleiras, porta-containers, pranchas, frigoríficas, tanques e muito mais. Negociação direta pelo WhatsApp.",
  alternates: { canonical: "/carretas" },
};

const ESTADOS = ["SC","PR","RS","SP","MG","MS","MT","GO","BA","RJ","ES","PE","CE","PA","AM"];

type PageProps = { searchParams: Promise<{ estado?: string; marca?: string }> };

export default async function CarretasPage({ searchParams }: PageProps) {
  const { estado, marca } = await searchParams;
  const estadoFiltro = ESTADOS.includes(estado || "") ? estado! : "";

  const supabase = await createClient();

  const { count: total } = await supabase
    .from("trucks")
    .select("*", { count: "exact", head: true })
    .eq("status", "aprovado")
    .eq("perfil", "Carretas");

  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado")
    .eq("perfil", "Carretas")
    .order("created_at", { ascending: false })
    .limit(24);

  if (estadoFiltro) query = query.eq("estado", estadoFiltro);

  const { data } = await query;
  let carretas = (data || []) as TruckCardData[];
  if (marca) carretas = carretas.filter(t => t.marca === marca);

  return (
    <div className="car-page">
      <PublicHeader />

      <div className="car-cta">
        <div className="car-cta-inner">
          <div>
            <h1 className="car-title">Carretas à Venda</h1>
            <p className="car-sub">Graneleiras, porta-containers, pranchas, frigoríficas e tanques. Contato direto pelo WhatsApp.</p>
          </div>
          <Link href="/painel/anuncios/novo/carreta" className="car-anuncie">+ Anunciar carreta</Link>
        </div>
      </div>

      <div className="car-container">

        {/* Marcas — sem label */}
        <CategoryBrandsBar categoria="carretas" labelSingular="Carretas" />

        {/* Filtro de estado — chips diretos */}
        <div className="car-estados">
          <Link href="/carretas" className={`car-est-chip${!estadoFiltro ? " car-est-chip--active" : ""}`}>Todos</Link>
          {ESTADOS.map(uf => (
            <Link
              key={uf}
              href={`/carretas?estado=${uf}`}
              className={`car-est-chip${estadoFiltro === uf ? " car-est-chip--active" : ""}`}
            >{uf}</Link>
          ))}
        </div>

        {carretas.length > 0 ? (
          <>
            <p className="car-count">{carretas.length}{!estadoFiltro && total && total > 24 ? `+ de ${total}` : ""} carreta{carretas.length !== 1 ? "s" : ""}</p>
            <div className="car-grid">
              {carretas.map((item) => <TruckCard key={item.id} truck={item} />)}
            </div>
          </>
        ) : (
          <div className="car-empty">
            <span>🚛</span>
            <strong>Nenhuma carreta encontrada</strong>
            <p>Tente outro estado ou veja todas.</p>
            <Link href="/carretas" className="car-anuncie" style={{ marginTop: 8 }}>Ver todas</Link>
          </div>
        )}
      </div>

      <SiteFooter />

      <style>{`
        .car-page { min-height: 100vh; background: var(--bg); color: var(--text); padding-bottom: 64px; }
        .car-cta { background: var(--surface); border-bottom: 1px solid var(--line); }
        .car-cta-inner {
          width: min(1280px, calc(100vw - 32px)); margin: 0 auto;
          padding: 28px 0 24px;
          display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
        }
        .car-title { margin: 0 0 4px; font-size: clamp(26px, 3.5vw, 38px); letter-spacing: -.04em; line-height: 1.05; }
        .car-sub { margin: 0; color: var(--muted); font-size: 14px; font-weight: 600; max-width: 54ch; line-height: 1.5; }
        .car-anuncie {
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 44px; padding: 0 22px; border-radius: 12px;
          background: var(--blue); color: #fff;
          font-weight: 900; font-size: 14px; white-space: nowrap;
          text-decoration: none; flex-shrink: 0; transition: background .14s;
        }
        .car-anuncie:hover { background: var(--blue2); }
        .car-container { width: min(1280px, calc(100vw - 32px)); margin: 0 auto; padding-top: 20px; }
        .car-estados { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
        .car-est-chip {
          display: inline-flex; align-items: center; justify-content: center;
          height: 30px; padding: 0 12px;
          border-radius: 999px; border: 1.5px solid var(--line);
          background: var(--surface); color: var(--muted);
          font-size: 12px; font-weight: 800; text-decoration: none;
          transition: border-color .12s, color .12s;
        }
        .car-est-chip:hover, .car-est-chip--active {
          border-color: var(--blue); color: var(--blue);
          background: var(--blueSoft);
        }
        .car-count { margin: 0 0 14px; font-size: 13px; color: var(--muted); font-weight: 700; }
        .car-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
        .car-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px; padding: 72px 24px; text-align: center; color: var(--muted);
          background: var(--surface); border-radius: 20px; border: 1px solid var(--line);
        }
        .car-empty span { font-size: 48px; }
        .car-empty strong { font-size: 18px; color: var(--text); }
        .car-empty p { margin: 0; font-size: 14px; }
        @media (max-width: 680px) {
          .car-cta-inner { flex-direction: column; align-items: flex-start; padding: 20px 0 18px; }
          .car-anuncie { width: 100%; }
          .car-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>
    </div>
  );
}
