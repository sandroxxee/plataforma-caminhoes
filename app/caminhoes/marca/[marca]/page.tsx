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
    </main>
  );
}
