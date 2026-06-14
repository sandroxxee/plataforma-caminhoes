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
  ac: "Acre",           al: "Alagoas",         am: "Amazonas",
  ap: "Amapá",          ba: "Bahia",           ce: "Ceará",
  df: "Distrito Federal", es: "Espírito Santo", go: "Goiás",
  ma: "Maranhão",       mg: "Minas Gerais",    ms: "Mato Grosso do Sul",
  mt: "Mato Grosso",    pa: "Pará",            pb: "Paraíba",
  pe: "Pernambuco",     pi: "Piauí",           pr: "Paraná",
  rj: "Rio de Janeiro", rn: "Rio Grande do Norte", ro: "Rondônia",
  rr: "Roraima",        rs: "Rio Grande do Sul",   sc: "Santa Catarina",
  se: "Sergipe",        sp: "São Paulo",           to: "Tocantins",
};

const MARCAS_LINK: Record<string, string> = {
  "mercedes-benz": "Mercedes-Benz", scania: "Scania",
  volvo: "Volvo", volkswagen: "Volkswagen",
  ford: "Ford", iveco: "Iveco", man: "MAN", randon: "Randon",
};

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

type Truck = TruckCardData & { truck_images?: TruckImage[]; marca?: string | null; preco?: number | null; cidade?: string | null; };

function TextoSEOEstado({ estado, uf, trucks }: { estado: string; uf: string; trucks: Truck[] }) {
  const total = trucks.length;
  if (total === 0) return null;

  // Cidades com mais anuncios
  const porCidade: Record<string, number> = {};
  trucks.forEach((t) => { if (t.cidade) porCidade[t.cidade] = (porCidade[t.cidade] || 0) + 1; });
  const topCidades = Object.entries(porCidade)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([c]) => c)
    .join(", ");

  // Marcas mais anunciadas
  const porMarca: Record<string, number> = {};
  trucks.forEach((t) => { if (t.marca) porMarca[t.marca] = (porMarca[t.marca] || 0) + 1; });
  const topMarcas = Object.entries(porMarca)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([m]) => m)
    .join(", ");

  // Faixa de preco
  const precos = trucks.map((t) => t.preco).filter((p): p is number => typeof p === "number" && p > 0);
  const precoMin = precos.length ? Math.min(...precos) : null;
  const precoMax = precos.length ? Math.max(...precos) : null;
  const faixaPreco = precoMin && precoMax
    ? `Os preços anunciados variam de ${precoMin.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })} a ${precoMax.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}.`
    : "";

  return (
    <div className="seo-text-block">
      <p>
        Encontre <strong>{total} {total === 1 ? "caminhão" : "caminhões"} à venda em {estado}</strong> com fotos reais e contato direto pelo WhatsApp com o vendedor.
        {topCidades && <> As cidades com mais ofertas são <strong>{topCidades}</strong>.</>}
        {faixaPreco && <> {faixaPreco}</>}
      </p>
      {topMarcas && (
        <p>
          As marcas mais anunciadas em {estado} são <strong>{topMarcas}</strong>.
          Todos os anúncios são verificados e publicados diretamente pelo vendedor — sem intermediários.
          Use o alerta de busca abaixo para ser avisado assim que um novo caminhão aparecer em {estado}.
        </p>
      )}
    </div>
  );
}

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
        <TextoSEOEstado estado={estado} uf={uf} trucks={trucks} />
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
            {Object.entries(MARCAS_LINK).map(([slug, nome]) => (
              <Link key={slug} href={`/caminhoes/marca/${slug}`}>{nome} {uf.toUpperCase()}</Link>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
