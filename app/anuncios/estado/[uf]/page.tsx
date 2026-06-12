import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData, type TruckImage } from "@/components/theme/TruckCard";
import Link from "next/link";

export const revalidate = 3600;

const ESTADOS: Record<string, string> = {
  sc: "Santa Catarina", pr: "Paraná", rs: "Rio Grande do Sul",
  sp: "São Paulo", rj: "Rio de Janeiro", mg: "Minas Gerais",
  es: "Espírito Santo", ba: "Bahia", go: "Goiás",
  ms: "Mato Grosso do Sul", mt: "Mato Grosso", df: "Distrito Federal",
  pe: "Pernambuco", ce: "Ceará", pa: "Pará",
};

export async function generateStaticParams() {
  return Object.keys(ESTADOS).map((uf) => ({ uf }));
}

export async function generateMetadata({ params }: { params: Promise<{ uf: string }> }): Promise<Metadata> {
  const { uf } = await params;
  const estado = ESTADOS[uf];
  if (!estado) return {};
  return {
    title: `Caminhões à Venda em ${estado} | Plataforma de Caminhões`,
    description: `Anunciantes de caminhões em ${estado}. Veja fotos, preços e entre em contato pelo WhatsApp com o vendedor.`,
    alternates: { canonical: `https://www.caminhoesvenda.com.br/anuncios/estado/${uf}` },
    openGraph: {
      title: `Caminhões à Venda em ${estado}`,
      description: `Compre ou venda caminhões em ${estado}. Preços, fotos e contato direto.`,
      url: `https://www.caminhoesvenda.com.br/anuncios/estado/${uf}`,
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
          <Link href="/anuncios">Caminhões</Link>
          <span>›</span>
          <span>{estado}</span>
        </nav>
        <div className="al-header">
          <h1 className="al-title">Caminhões à Venda em {estado}</h1>
          <p className="al-subtitle">{trucks.length} {trucks.length === 1 ? "anúncio" : "anúncios"} encontrados</p>
        </div>
        <div className="seo-marca-nav">
          {Object.entries(ESTADOS).map(([slug, nome]) => (
            <Link key={slug} href={`/anuncios/estado/${slug}`} className={slug === uf ? "active" : ""}>{nome}</Link>
          ))}
        </div>
        <Suspense fallback={null}>
          <section className="stock-grid">
            {trucks.map((truck) => <TruckCard key={truck.id} truck={truck} />)}
            {trucks.length === 0 && (
              <div className="market-empty">
                <strong>Nenhum anúncio em {estado} agora</strong>
                <p>Novos anúncios são publicados diariamente.</p>
                <Link href="/anuncios" style={{ marginTop: 8, display: "inline-flex", padding: "10px 20px", borderRadius: 10, background: "var(--blue)", color: "#fff", fontWeight: 800 }}>Ver todos</Link>
              </div>
            )}
          </section>
        </Suspense>
      </div>
      <SiteFooter />
      <style>{`
        .seo-breadcrumb { display: flex; gap: 6px; align-items: center; padding: 18px 0 0; font-size: 13px; color: var(--muted); font-weight: 700; }
        .seo-breadcrumb a { color: var(--blue); text-decoration: none; }
        .al-header { padding: 12px 0 12px; }
        .al-title { margin: 0 0 4px; font-size: clamp(24px, 4vw, 36px); letter-spacing: -.04em; }
        .al-subtitle { margin: 0; color: var(--muted); font-size: 14px; font-weight: 750; }
        .seo-marca-nav { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--line); }
        .seo-marca-nav a { display: inline-flex; align-items: center; height: 34px; padding: 0 14px; border-radius: 999px; border: 1.5px solid var(--line); background: var(--soft); color: var(--muted); font-size: 12px; font-weight: 800; text-decoration: none; transition: .15s; white-space: nowrap; }
        .seo-marca-nav a:hover, .seo-marca-nav a.active { border-color: var(--blue); background: var(--blueSoft); color: var(--blue); }
      `}</style>
    </main>
  );
}
