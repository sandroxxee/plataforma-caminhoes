import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { CategoryBrandsBar } from "@/components/theme/CategoryBrandsBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Máquinas Pesadas à Venda | Caminhões à Venda",
  description: "Escavadeiras, pás-carregadeiras, motoniveladoras, rolos e muito mais. Negociação direta pelo WhatsApp.",
  alternates: { canonical: "/maquinas" },
};

const ESTADOS = ["SC","PR","RS","SP","MG","MS","MT","GO","BA","RJ","ES","PE","CE","PA","AM"];
type PageProps = { searchParams: Promise<{ estado?: string }> };

export default async function MaquinasPage({ searchParams }: PageProps) {
  const { estado } = await searchParams;
  const estadoFiltro = ESTADOS.includes(estado || "") ? estado! : "";
  const supabase = await createClient();

  let q = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado")
    .eq("perfil", "Máquinas")
    .order("created_at", { ascending: false })
    .limit(48);
  if (estadoFiltro) q = q.eq("estado", estadoFiltro);

  const { data } = await q;
  const maquinas = (data || []) as TruckCardData[];

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
        <CategoryBrandsBar categoria="maquinas" labelSingular="Máquinas" />
        <div className="maq-estados">
          <Link href="/maquinas" className={`maq-est${!estadoFiltro ? " maq-est--on" : ""}`}>Todos</Link>
          {ESTADOS.map(uf => (
            <Link key={uf} href={`/maquinas?estado=${uf}`} className={`maq-est${estadoFiltro===uf ? " maq-est--on" : ""}`}>{uf}</Link>
          ))}
        </div>
        {maquinas.length > 0 ? (
          <>
            <p className="maq-count">{maquinas.length} máquina{maquinas.length!==1?"s":""}</p>
            <div className="maq-grid">{maquinas.map(item => <TruckCard key={item.id} truck={item} />)}</div>
          </>
        ) : (
          <div className="maq-empty">
            <span>🚧</span>
            <strong>Nenhuma máquina encontrada</strong>
            <Link href="/maquinas" className="maq-anuncie" style={{marginTop:8}}>Ver todas</Link>
          </div>
        )}
      </div>
      <SiteFooter />
      <style>{`
        .maq-page{min-height:100vh;background:var(--bg);color:var(--text);padding-bottom:64px}
        .maq-cta{background:var(--surface);border-bottom:1px solid var(--line)}
        .maq-cta-inner{width:min(1280px,calc(100vw - 32px));margin:0 auto;padding:28px 0 24px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
        .maq-title{margin:0 0 4px;font-size:clamp(26px,3.5vw,38px);letter-spacing:-.04em;line-height:1.05}
        .maq-sub{margin:0;color:var(--muted);font-size:14px;font-weight:600;max-width:54ch}
        .maq-anuncie{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 22px;border-radius:12px;background:var(--blue);color:#fff;font-weight:900;font-size:14px;white-space:nowrap;text-decoration:none;flex-shrink:0;transition:background .14s}
        .maq-anuncie:hover{background:var(--blue2)}
        .maq-container{width:min(1280px,calc(100vw - 32px));margin:0 auto;padding-top:20px}
        .maq-estados{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px}
        .maq-est{display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 12px;border-radius:999px;border:1.5px solid var(--line);background:var(--surface);color:var(--muted);font-size:12px;font-weight:800;text-decoration:none;transition:border-color .12s,color .12s}
        .maq-est:hover,.maq-est--on{border-color:var(--blue);color:var(--blue);background:var(--blueSoft)}
        .maq-count{margin:0 0 14px;font-size:13px;color:var(--muted);font-weight:700}
        .maq-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}
        .maq-empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:72px 24px;text-align:center;color:var(--muted);background:var(--surface);border-radius:20px;border:1px solid var(--line)}
        .maq-empty span{font-size:48px}
        .maq-empty strong{font-size:18px;color:var(--text)}
        @media(max-width:680px){.maq-cta-inner{flex-direction:column;align-items:flex-start}.maq-anuncie{width:100%}.maq-grid{grid-template-columns:repeat(2,1fr);gap:10px}}
      `}</style>
    </div>
  );
}
