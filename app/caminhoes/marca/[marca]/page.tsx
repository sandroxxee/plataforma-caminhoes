import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData, type TruckImage } from "@/components/theme/TruckCard";
import { AlertaBusca } from "@/components/AlertaBusca";
import Link from "next/link";
import { gerarSlugComId } from "@/lib/slug";

export const revalidate = 3600;

const BASE = "https://www.caminhoesavenda.com";

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

const ESTADO_NOME: Record<string, string> = {
  AC:"Acre",AL:"Alagoas",AM:"Amazonas",AP:"Amapá",BA:"Bahia",CE:"Ceará",
  DF:"Distrito Federal",ES:"Espírito Santo",GO:"Goiás",MA:"Maranhão",
  MG:"Minas Gerais",MS:"Mato Grosso do Sul",MT:"Mato Grosso",PA:"Pará",
  PB:"Paraíba",PE:"Pernambuco",PI:"Piauí",PR:"Paraná",RJ:"Rio de Janeiro",
  RN:"Rio Grande do Norte",RO:"Rondônia",RR:"Roraima",RS:"Rio Grande do Sul",
  SC:"Santa Catarina",SE:"Sergipe",SP:"São Paulo",TO:"Tocantins",
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
    alternates: { canonical: `${BASE}/caminhoes/marca/${marca}` },
    openGraph: {
      title: `Caminhões ${display} à Venda`,
      description: `Encontre ${display} com o melhor preço.`,
      url: `${BASE}/caminhoes/marca/${marca}`,
      images: [{ url: `${BASE}/api/og?marca=${encodeURIComponent(display)}`, width: 1200, height: 630 }],
    },
  };
}

type Truck = TruckCardData & { truck_images?: TruckImage[]; estado?: string | null; preco?: number | null; modelo?: string | null; };

function TextoSEOMarca({ display, trucks }: { display: string; trucks: Truck[] }) {
  const total = trucks.length;
  if (total === 0) return null;
  const porEstado: Record<string, number> = {};
  trucks.forEach((t) => { if (t.estado) porEstado[t.estado] = (porEstado[t.estado] || 0) + 1; });
  const topEstados = Object.entries(porEstado).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([uf]) => ESTADO_NOME[uf] || uf).join(", ");
  const precos = trucks.map((t) => t.preco).filter((p): p is number => typeof p === "number" && p > 0);
  const precoMin = precos.length ? Math.min(...precos) : null;
  const precoMax = precos.length ? Math.max(...precos) : null;
  const faixaPreco = precoMin && precoMax
    ? `Os preços variam de ${precoMin.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })} a ${precoMax.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}.`
    : "";
  const modelos = [...new Set(trucks.map((t) => t.modelo).filter(Boolean))].slice(0, 5).join(", ");
  return (
    <div className="seo-text-block">
      <p>
        Encontre <strong>{total} {total === 1 ? "caminhão" : "caminhões"} {display}</strong> à venda com fotos reais, preço e contato direto pelo WhatsApp.
        {topEstados && <> Os estados com mais ofertas são <strong>{topEstados}</strong>.</>}
        {faixaPreco && <> {faixaPreco}</>}
      </p>
      {modelos && (
        <p>
          Entre os modelos disponíveis: <strong>{modelos}</strong>.
          Todos os anúncios são verificados e publicados diretamente pelo vendedor — sem intermediários.
        </p>
      )}
    </div>
  );
}

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
  const pageUrl = `${BASE}/caminhoes/marca/${marca}`;

  // CollectionPage + ItemList schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Caminhões ${display} à Venda`,
    description: `Lista de caminhões ${display} à venda no Brasil com fotos reais e contato direto.`,
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: trucks.length,
      itemListElement: trucks.slice(0, 20).map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${BASE}/anuncios/${gerarSlugComId({ id: t.id, marca: t.marca, modelo: t.modelo, ano_modelo: t.ano_modelo, ano_fabricacao: t.ano_fabricacao, cidade: t.cidade, estado: t.estado })}`,
        name: t.titulo || `${t.marca} ${t.modelo}`,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE },
      { "@type": "ListItem", position: 2, name: "Caminhões", item: `${BASE}/anuncios` },
      { "@type": "ListItem", position: 3, name: display, item: pageUrl },
    ],
  };

  return (
    <main className="market-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
        <TextoSEOMarca display={display} trucks={trucks} />
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
