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

const ESTADOS: Record<string, string> = {
  sc: "Santa Catarina", pr: "Paraná", rs: "Rio Grande do Sul",
  sp: "São Paulo", rj: "Rio de Janeiro", mg: "Minas Gerais",
  es: "Espírito Santo", ba: "Bahia", go: "Goiás",
  ms: "Mato Grosso do Sul", mt: "Mato Grosso", df: "Distrito Federal",
  pe: "Pernambuco", ce: "Ceará", pa: "Pará",
};

const MARCAS_LINK = ["mercedes-benz","scania","volvo","volkswagen","ford","iveco"];
const MARCA_DISPLAY: Record<string,string> = { "mercedes-benz":"Mercedes-Benz",scania:"Scania",volvo:"Volvo",volkswagen:"Volkswagen",ford:"Ford",iveco:"Iveco" };

export async function generateStaticParams() {
  return Object.keys(ESTADOS).map((uf) => ({ uf }));
}

export async function generateMetadata({ params }: { params: Promise<{ uf: string }> }): Promise<Metadata> {
  const { uf } = await params;
  const estado = ESTADOS[uf];
  if (!estado) return {};
  return {
    title: `Caminhões à Venda em ${estado} | Caminhões à Venda`,
    description: `Anunciantes de caminhões em ${estado}. Veja fotos, preços e entre em contato pelo WhatsApp com o vendedor.`,
    alternates: { canonical: `https://www.caminhoesavenda.com/caminhoes/estado/${uf}` },
    openGraph: {
      title: `Caminhões à Venda em ${estado}`,
      description: `Compre ou venda caminhões em ${estado}. Preços, fotos e contato direto.`,
      url: `https://www.caminhoesavenda.com/caminhoes/estado/${uf}`,
      images: [{ url: `https://www.caminhoesavenda.com/api/og?estado=${encodeURIComponent(estado)}`, width: 1200, height: 630 }],
    },
  };
}

type Truck = TruckCardData & { truck_images?: TruckImage[] };

export default async function EstadoPage({ params }: { params: Promise<{ uf: string }> }) {
  const { uf } = await params;
  const estado = ESTADOS[uf];
  if (!estado) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, truck_images(image_url, principal, ordem)`)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .eq("estado", uf.toUpperCase())
    .order("created_at", { ascending: false });

  const trucks = (data || []) as Truck[];

  return (
    <main className="market-page">
      <PublicHeader />
      <div className="market-container">
        <nav className="seo-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Início</Link><span>›</span>
          <Link href="/anuncios">Caminhões</Link><span>›</span>
          <span>{estado}</span>
        </nav>
        <div className="al-header">
          <h1 className="al-title">Caminhões à Venda em {estado}</h1>
          <p className="al-subtitle">{trucks.length} {trucks.length === 1 ? "anúncio" : "anúncios"} encontrados</p>
        </div>

        <div className="seo-marca-nav">
          {Object.entries(ESTADOS).map(([slug, nome]) => (
            <Link key={slug} href={`/caminhoes/estado/${slug}`} className={slug === uf ? "active" : ""}>{nome}</Link>
          ))}
        </div>

        <div className="seo-alerta-row">
          <span className="seo-alerta-hint">🔔 Quer ser avisado quando sair um caminhão novo em {estado}?</span>
          <AlertaBusca estadoInicial={uf.toUpperCase()} />
        </div>

        <Suspense fallback={null}>
          <section className="stock-grid">
            {trucks.map((truck) => <TruckCard key={truck.id} truck={truck} />)}
            {trucks.length === 0 && (
              <div className="market-empty">
                <strong>Nenhum anúncio em {estado} agora</strong>
                <p>Novos anúncios são publicados diariamente.</p>
                <Link href="/anuncios" style={{ marginTop:8,display:"inline-flex",padding:"10px 20px",borderRadius:10,background:"var(--blue)",color:"#fff",fontWeight:800 }}>Ver todos</Link>
              </div>
            )}
          </section>
        </Suspense>

        <div className="seo-internal-links">
          <p className="seo-internal-title">Buscar por marca em {estado}:</p>
          <div className="seo-internal-row">
            {MARCAS_LINK.map((slug) => (
              <Link key={slug} href={`/caminhoes/${slug}`}>{MARCA_DISPLAY[slug]} {uf.toUpperCase()}</Link>
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
