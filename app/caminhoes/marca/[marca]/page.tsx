import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData, type TruckImage } from "@/components/theme/TruckCard";
import { AlertaBusca } from "@/components/AlertaBusca";
import Link from "next/link";

export const revalidate = 3600;

// ✅ sincronizado com sitemap.ts
const MARCA_DISPLAY: Record<string, string> = {
  "mercedes-benz": "Mercedes-Benz",
  scania:          "Scania",
  volvo:           "Volvo",
  volkswagen:      "Volkswagen",
  ford:            "Ford",
  iveco:           "Iveco",
  daf:             "DAF",
  man:             "MAN",
  randon:          "Randon",
  agrale:          "Agrale",
  liebherr:        "Liebherr",
  paqueta:         "Paquetá",
  guerra:          "Guerra",
};

export async function generateStaticParams() {
  return Object.keys(MARCA_DISPLAY).map((m) => ({ marca: m }));
}

export async function generateMetadata({ params }: { params: Promise<{ marca: string }> }): Promise<Metadata> {
  const { marca } = await params;
  const display = MARCA_DISPLAY[marca];
  if (!display) return {};
  return {
    title: `Caminhões ${display} à Venda | Caminhões à Venda`,
    description: `Veja todos os caminhões ${display} à venda. Anunciantes diretos, fotos reais, preço e contato via WhatsApp.`,
    alternates: { canonical: `https://www.caminhoesavenda.com/caminhoes/marca/${marca}` },
    openGraph: {
      title: `Caminhões ${display} à Venda`,
      description: `Encontre ${display} com o melhor preço.`,
      url: `https://www.caminhoesavenda.com/caminhoes/marca/${marca}`,
      images: [{ url: `https://www.caminhoesavenda.com/api/og?marca=${encodeURIComponent(display)}`, width: 1200, height: 630 }],
    },
  };
}

type Truck = TruckCardData & { truck_images?: TruckImage[] };

export default async function MarcaPage({ params }: { params: Promise<{ marca: string }> }) {
  const { marca } = await params;
  const display = MARCA_DISPLAY[marca];
  if (!display) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, truck_images(image_url, principal, ordem)`)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .eq("marca", display)
    .order("created_at", { ascending: false });

  const trucks = (data || []) as Truck[];

  return (
    <main className="market-page">
      <PublicHeader />
      <div className="market-container">
        <nav className="seo-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Início</Link><span>›</span>
          <Link href="/anuncios">Caminhões</Link><span>›</span>
          <span>{display}</span>
        </nav>
        <div className="al-header">
          <h1 className="al-title">Caminhões {display} à Venda</h1>
          <p className="al-subtitle">{trucks.length} {trucks.length === 1 ? "anúncio" : "anúncios"} encontrados</p>
        </div>
        <div className="seo-marca-nav">
          {Object.entries(MARCA_DISPLAY).map(([slug, name]) => (
            <Link key={slug} href={`/caminhoes/marca/${slug}`} className={slug === marca ? "active" : ""}>{name}</Link>
          ))}
        </div>
        <div className="seo-alerta-row">
          <span className="seo-alerta-hint">🔔 Quer ser avisado quando sair um {display} novo?</span>
          <AlertaBusca marcaInicial={display} />
        </div>
        <Suspense fallback={null}>
          <section className="stock-grid">
            {trucks.map((truck) => <TruckCard key={truck.id} truck={truck} />)}
            {trucks.length === 0 && (
              <div className="market-empty">
                <strong>Nenhum {display} disponível agora</strong>
                <p>Novos anúncios são publicados diariamente.</p>
                <Link href="/anuncios" style={{marginTop:8,display:"inline-flex",padding:"10px 20px",borderRadius:10,background:"var(--blue)",color:"#fff",fontWeight:800}}>Ver todos</Link>
              </div>
            )}
          </section>
        </Suspense>
        <div className="seo-internal-links">
          <p className="seo-internal-title">{display} por estado:</p>
          <div className="seo-internal-row">
            {["sc","pr","rs","sp","mg","rj","go","ba"].map((uf) => (
              <Link key={uf} href={`/caminhoes/estado/${uf}`}>{display} {uf.toUpperCase()}</Link>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
      <style>{`
        .seo-breadcrumb{display:flex;gap:6px;align-items:center;padding:18px 0 0;font-size:13px;color:var(--muted);font-weight:700}
        .seo-breadcrumb a{color:var(--blue);text-decoration:none}
        .al-header{padding:12px 0}
        .al-title{margin:0 0 4px;font-size:clamp(24px,4vw,36px);letter-spacing:-.04em}
        .al-subtitle{margin:0;color:var(--muted);font-size:14px;font-weight:750}
        .seo-marca-nav{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--line)}
        .seo-marca-nav a{display:inline-flex;align-items:center;height:34px;padding:0 14px;border-radius:999px;border:1.5px solid var(--line);background:var(--soft);color:var(--muted);font-size:12px;font-weight:800;text-decoration:none;transition:.15s;white-space:nowrap}
        .seo-marca-nav a:hover,.seo-marca-nav a.active{border-color:var(--blue);background:var(--blueSoft);color:var(--blue)}
        .seo-alerta-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:24px;padding:14px 18px;background:var(--soft);border-radius:14px;border:1px solid var(--line)}
        .seo-alerta-hint{font-size:13px;font-weight:800;color:var(--muted);flex:1;min-width:200px}
        .seo-internal-links{margin-top:40px;padding-top:24px;border-top:1px solid var(--line)}
        .seo-internal-title{margin:0 0 10px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
        .seo-internal-row{display:flex;gap:8px;flex-wrap:wrap}
        .seo-internal-row a{display:inline-flex;height:30px;align-items:center;padding:0 12px;border-radius:999px;background:var(--soft);border:1px solid var(--line);font-size:12px;font-weight:800;color:var(--muted);text-decoration:none;transition:.15s}
        .seo-internal-row a:hover{color:var(--blue);border-color:var(--blue)}
      `}</style>
    </main>
  );
}
