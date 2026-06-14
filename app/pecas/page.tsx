import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { CategoryBrandsBar } from "@/components/theme/CategoryBrandsBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Peças para Caminhão à Venda | Caminhões à Venda",
  description: "Motores, câmbios, eixos, suspensão, freios e muito mais. Negociação direta pelo WhatsApp.",
  alternates: { canonical: "/pecas" },
};

const ESTADOS = ["SC","PR","RS","SP","MG","MS","MT","GO","BA","RJ","ES","PE","CE","PA","AM"];
type PageProps = { searchParams: Promise<{ estado?: string }> };

export default async function PecasPage({ searchParams }: PageProps) {
  const { estado } = await searchParams;
  const estadoFiltro = ESTADOS.includes(estado || "") ? estado! : "";
  const supabase = await createClient();

  let q = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado")
    .eq("perfil", "Peças")
    .order("created_at", { ascending: false })
    .limit(48);
  if (estadoFiltro) q = q.eq("estado", estadoFiltro);

  const { data } = await q;
  const pecas = (data || []) as TruckCardData[];

  return (
    <div className="pec-page">
      <PublicHeader />
      <div className="pec-cta">
        <div className="pec-cta-inner">
          <div>
            <h1 className="pec-title">Peças à Venda</h1>
            <p className="pec-sub">Motores, câmbios, eixos, suspensão, freios e muito mais. Direto pelo WhatsApp.</p>
          </div>
          <Link href="/painel/anuncios/novo/peca" className="pec-anuncie">+ Anunciar peça</Link>
        </div>
      </div>
      <div className="pec-container">
        <CategoryBrandsBar categoria="pecas" labelSingular="Peças" />
        <div className="pec-estados">
          <Link href="/pecas" className={`pec-est${!estadoFiltro ? " pec-est--on" : ""}`}>Todos</Link>
          {ESTADOS.map(uf => (
            <Link key={uf} href={`/pecas?estado=${uf}`} className={`pec-est${estadoFiltro===uf ? " pec-est--on" : ""}`}>{uf}</Link>
          ))}
        </div>
        {pecas.length > 0 ? (
          <>
            <p className="pec-count">{pecas.length} peça{pecas.length!==1?"s":""}</p>
            <div className="pec-grid">{pecas.map(item => <TruckCard key={item.id} truck={item} />)}</div>
          </>
        ) : (
          <div className="pec-empty">
            <span>🔧</span>
            <strong>Nenhuma peça encontrada</strong>
            <Link href="/pecas" className="pec-anuncie" style={{marginTop:8}}>Ver todas</Link>
          </div>
        )}
      </div>
      <SiteFooter />
      <style>{`
        .pec-page{min-height:100vh;background:var(--bg);color:var(--text);padding-bottom:64px}
        .pec-cta{background:var(--surface);border-bottom:1px solid var(--line)}
        .pec-cta-inner{width:min(1280px,calc(100vw - 32px));margin:0 auto;padding:28px 0 24px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
        .pec-title{margin:0 0 4px;font-size:clamp(26px,3.5vw,38px);letter-spacing:-.04em;line-height:1.05}
        .pec-sub{margin:0;color:var(--muted);font-size:14px;font-weight:600;max-width:54ch}
        .pec-anuncie{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 22px;border-radius:12px;background:var(--blue);color:#fff;font-weight:900;font-size:14px;white-space:nowrap;text-decoration:none;flex-shrink:0;transition:background .14s}
        .pec-anuncie:hover{background:var(--blue2)}
        .pec-container{width:min(1280px,calc(100vw - 32px));margin:0 auto;padding-top:20px}
        .pec-estados{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px}
        .pec-est{display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 12px;border-radius:999px;border:1.5px solid var(--line);background:var(--surface);color:var(--muted);font-size:12px;font-weight:800;text-decoration:none;transition:border-color .12s,color .12s}
        .pec-est:hover,.pec-est--on{border-color:var(--blue);color:var(--blue);background:var(--blueSoft)}
        .pec-count{margin:0 0 14px;font-size:13px;color:var(--muted);font-weight:700}
        .pec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}
        .pec-empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:72px 24px;text-align:center;color:var(--muted);background:var(--surface);border-radius:20px;border:1px solid var(--line)}
        .pec-empty span{font-size:48px}
        .pec-empty strong{font-size:18px;color:var(--text)}
        @media(max-width:680px){.pec-cta-inner{flex-direction:column;align-items:flex-start}.pec-anuncie{width:100%}.pec-grid{grid-template-columns:repeat(2,1fr);gap:10px}}
      `}</style>
    </div>
  );
}
