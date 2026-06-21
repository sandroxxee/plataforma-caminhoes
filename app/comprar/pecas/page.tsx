import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { CategoryBrandsBar } from "@/components/theme/CategoryBrandsBar";
import { EmptyState } from "@/components/theme/EmptyState";
import { Package, Tractor, Container, Truck, Wrench } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Peças para Caminhão à Venda | Caminhões à Venda",
  description: "Motores, câmbios, eixos, suspensão, freios e muito mais. Negociação direta pelo WhatsApp.",
  alternates: { canonical: "/comprar/pecas" },
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
          <Link href="/comprar/pecas" className={`pec-est${!estadoFiltro ? " pec-est--on" : ""}`}>Todos</Link>
          {ESTADOS.map(uf => (
            <Link key={uf} href={`/comprar/pecas?estado=${uf}`} className={`pec-est${estadoFiltro===uf ? " pec-est--on" : ""}`}>{uf}</Link>
          ))}
        </div>
        {pecas.length > 0 ? (
          <>
            <p className="pec-count">{pecas.length} peça{pecas.length!==1?"s":""}</p>
            <div className="pec-grid">{pecas.map(item => <TruckCard key={item.id} truck={item} />)}</div>
          </>
        ) : (
          <EmptyState
            icon={<Package size={48} strokeWidth={1.5} />}
            title="Nenhuma peça encontrada"
            description={estadoFiltro ? `Nenhuma peça disponível em ${estadoFiltro} no momento.` : "Nenhuma peça disponível no momento."}
            primaryHref="/comprar/pecas"
            primaryLabel="Ver todas as peças"
            suggestions={[
              { href: "/comprar/caminhoes", label: "Caminhões", icon: <Truck size={16} /> },
              { href: "/comprar/carretas", label: "Carretas", icon: <Container size={16} /> },
              { href: "/comprar/implementos", label: "Implementos", icon: <Wrench size={16} /> },
              { href: "/comprar/maquinas", label: "Máquinas", icon: <Tractor size={16} /> },
            ]}
            announceHref="/painel/anuncios/novo/peca"
            announceLabel="Anuncie sua peça"
          />
        )}
      </div>
      <SiteFooter />
      <style>{`
        .pec-page{min-height:100vh;background:var(--bg);color:var(--text);padding-bottom:64px}
        .pec-cta{background:#fff;border-bottom:1px solid rgba(148,163,184,0.12);box-shadow:0 4px 12px rgba(0,0,0,0.02)}
        .pec-cta-inner{width:min(1280px,calc(100vw - 32px));margin:0 auto;padding:32px 0 28px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
        .pec-title{margin:0 0 6px;font-size:clamp(28px,4vw,42px);font-weight:800;letter-spacing:-.04em;line-height:1.05;color:#0f172a}
        .pec-sub{margin:0;color:#64748b;font-size:15px;font-weight:600;max-width:54ch;line-height:1.6}
        .pec-anuncie{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 24px;border-radius:14px;background:var(--blue);color:#fff;font-weight:800;font-size:14px;white-space:nowrap;text-decoration:none;flex-shrink:0;transition:all .14s;box-shadow:0 4px 12px rgba(24,119,242,0.2)}
        .pec-anuncie:hover{background:var(--blue2);transform:translateY(-1px)}
        .pec-container{width:min(1280px,calc(100vw - 32px));margin:0 auto;padding-top:24px}
        .pec-estados{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
        .pec-est{display:inline-flex;align-items:center;justify-content:center;height:32px;padding:0 14px;border-radius:999px;border:1px solid rgba(148,163,184,0.15);background:#fff;color:#64748b;font-size:12px;font-weight:800;text-decoration:none;transition:all .12s}
        .pec-est:hover,.pec-est--on{border-color:var(--blue);color:var(--blue);background:var(--blueSoft);transform:translateY(-1px)}
        .pec-count{margin:0 0 16px;font-size:14px;color:#64748b;font-weight:700}
        .pec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
        @media(max-width:680px){.pec-cta-inner{flex-direction:column;align-items:flex-start;padding:24px 0}.pec-anuncie{width:100%}.pec-grid{grid-template-columns:repeat(2,1fr);gap:12px}}
      `}</style>
    </div>
  );
}
