import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { EmptyState } from "@/components/theme/EmptyState";
import Link from "next/link";

import { Truck, Container, Wrench, Tractor, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Implementos à Venda | Caminhões à Venda",
  description: "Implementos rodoviários à venda: caçambas, munks, pranchas, baús, tanques, plataformas e muito mais.",
  alternates: { canonical: "/comprar/implementos" },
};

const TIPOS = [
  { label: "Caçamba",          emoji: "🟧", valor: "Caçamba" },
  { label: "Munk",             emoji: "🏷️", valor: "Munk" },
  { label: "Prancha",          emoji: "⬛",  valor: "Prancha" },
  { label: "Baú Frigorífico",  emoji: "❄️",  valor: "Baú Frigorífico" },
  { label: "Baú Seco",         emoji: "📦", valor: "Baú Seco" },
  { label: "Tanque",           emoji: "🔵", valor: "Tanque" },
  { label: "Plataforma",       emoji: "🟦", valor: "Plataforma" },
  { label: "Graneleiro",       emoji: "🌾", valor: "Graneleiro" },
  { label: "Betoneira",        emoji: "🔄", valor: "Betoneira" },
];

const ESTADOS = ["SC","PR","RS","SP","MG","MS","MT","GO","BA","RJ","ES","PE","CE","PA","AM"];
type PageProps = { searchParams: Promise<{ tipo?: string; estado?: string }> };

export default async function ImplementosPage({ searchParams }: PageProps) {
  const { tipo, estado } = await searchParams;
  const estadoFiltro = ESTADOS.includes(estado || "") ? estado! : "";
  const tipoFiltro = TIPOS.find(t => t.valor === tipo) ? tipo! : "";

  const supabase = await createClient();
  let query = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`)
    .eq("status", "aprovado").eq("perfil", "Implementos")
    .order("created_at", { ascending: false }).limit(48);
  if (estadoFiltro) query = query.eq("estado", estadoFiltro);
  if (tipoFiltro)   query = query.eq("carroceria", tipoFiltro);

  const { data } = await query;
  const implementos = (data || []) as TruckCardData[];

  return (
    <div className="impl-page">
      <PublicHeader />
      <div className="impl-cta">
        <div className="impl-cta-inner">
          <div>
            <h1 className="impl-title">Implementos à Venda</h1>
            <p className="impl-sub">Caçambas, munks, pranchas, baús, tanques e muito mais. Contato direto pelo WhatsApp.</p>
          </div>
          <Link href="/painel/anuncios/novo/implemento" className="impl-anuncie">+ Anunciar implemento</Link>
        </div>
      </div>

      <div className="impl-container">
        {/* Chips de tipo — sem label */}
        <div className="impl-tipos-grid">
          <Link href="/comprar/implementos" className={`impl-tipo-chip${!tipoFiltro ? " impl-tipo-chip--active" : ""}`}>
            <span aria-hidden="true">📦</span> Todos
          </Link>
          {TIPOS.map((tipo) => (
            <Link
              key={tipo.valor}
              href={`/comprar/implementos?tipo=${encodeURIComponent(tipo.valor)}`}
              className={`impl-tipo-chip${tipoFiltro === tipo.valor ? " impl-tipo-chip--active" : ""}`}
            >
              <span aria-hidden="true">{tipo.emoji}</span> {tipo.label}
            </Link>
          ))}
        </div>

        {/* Filtro estado */}
        <div className="impl-estados">
          <Link href={tipoFiltro ? `/comprar/implementos?tipo=${encodeURIComponent(tipoFiltro)}` : "/comprar/implementos"} className={`impl-est-chip${!estadoFiltro ? " impl-est-chip--active" : ""}`}>Todos</Link>
          {ESTADOS.map(uf => (
            <Link key={uf} href={`/comprar/implementos?${tipoFiltro ? `tipo=${encodeURIComponent(tipoFiltro)}&` : ""}estado=${uf}`} className={`impl-est-chip${estadoFiltro === uf ? " impl-est-chip--active" : ""}`}>{uf}</Link>
          ))}
        </div>

        {implementos.length > 0 ? (
          <>
            <p className="impl-count">{implementos.length} implemento{implementos.length !== 1 ? "s" : ""}</p>
            <div className="impl-grid">{implementos.map((item) => <TruckCard key={item.id} truck={item} />)}</div>
          </>
        ) : (
          <EmptyState
            icon={<Wrench size={48} strokeWidth={1.5} />}
            title="Nenhum implemento encontrado"
            description={
              tipoFiltro || estadoFiltro
                ? `Nenhum ${tipoFiltro || "implemento"} encontrado${estadoFiltro ? ` em ${estadoFiltro}` : ""}.`
                : "Nenhum implemento disponível no momento."
            }
            primaryHref="/comprar/implementos"
            primaryLabel="Ver todos os implementos"
            suggestions={[
              { href: "/comprar/carretas",  label: "Carretas",  icon: <Container size={16} /> },
              { href: "/comprar/caminhoes",  label: "Caminhões", icon: <Truck size={16} /> },
              { href: "/comprar/maquinas",  label: "Máquinas",  icon: <Tractor size={16} /> },
              { href: "/comprar/pecas",     label: "Peças",     icon: <Package size={16} /> },
            ]}
            announceHref="/painel/anuncios/novo/implemento"
            announceLabel="Anuncie seu implemento"
          />
        )}
      </div>
      <SiteFooter />
      <style>{`
        .impl-page { min-height: 100vh; background: var(--bg); color: var(--text); padding-bottom: 64px; }
        .impl-cta { background: var(--surface); border-bottom: 1px solid var(--line); }
        .impl-cta-inner { width: min(1280px, calc(100vw - 32px)); margin: 0 auto; padding: 28px 0 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
        .impl-title { margin: 0 0 4px; font-size: clamp(26px,3.5vw,38px); letter-spacing: -.04em; line-height: 1.05; }
        .impl-sub { margin: 0; color: var(--muted); font-size: 14px; font-weight: 600; max-width: 54ch; line-height: 1.5; }
        .impl-anuncie { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 22px; border-radius: 12px; background: var(--blue); color: #fff; font-weight: 900; font-size: 14px; white-space: nowrap; text-decoration: none; flex-shrink: 0; transition: background .14s; }
        .impl-anuncie:hover { background: var(--blue2); }
        .impl-container { width: min(1280px, calc(100vw - 32px)); margin: 0 auto; padding-top: 20px; }
        .impl-tipos-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
        .impl-tipo-chip { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 12px; border-radius: 999px; border: 1.5px solid var(--line); background: var(--surface); color: var(--text); font-size: 12px; font-weight: 800; text-decoration: none; transition: border-color .12s, color .12s; }
        .impl-tipo-chip:hover, .impl-tipo-chip--active { border-color: var(--blue); color: var(--blue); background: var(--blueSoft); }
        .impl-estados { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
        .impl-est-chip { display: inline-flex; align-items: center; justify-content: center; height: 28px; padding: 0 10px; border-radius: 999px; border: 1.5px solid var(--line); background: var(--surface); color: var(--muted); font-size: 11px; font-weight: 800; text-decoration: none; transition: border-color .12s, color .12s; }
        .impl-est-chip:hover, .impl-est-chip--active { border-color: var(--blue); color: var(--blue); background: var(--blueSoft); }
        .impl-count { margin: 0 0 14px; font-size: 13px; color: var(--muted); font-weight: 700; }
        .impl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
        @media (max-width: 680px) { .impl-cta-inner { flex-direction: column; align-items: flex-start; } .impl-anuncie { width: 100%; } .impl-grid { grid-template-columns: repeat(2,1fr); gap: 10px; } }
      `}</style>
    </div>
  );
}
