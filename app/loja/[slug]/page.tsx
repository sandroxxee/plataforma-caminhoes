import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicHeaderClient } from "@/components/PublicHeaderClient";
import { SiteFooter } from "@/components/SiteFooter";
import { StorefrontHeader } from "@/components/theme/StorefrontHeader";
import { TruckCard } from "@/components/theme/TruckCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const slug = params.slug.toLowerCase();

  const { data: revendas } = await supabase
    .from("revendas")
    .select("nome_fantasia, cidade, estado")
    .or(`nome_fantasia.ilike.%${slug}%,id.eq.${slug.length === 36 ? slug : "00000000-0000-0000-0000-000000000000"}`);

  if (!revendas || revendas.length === 0) {
    return { title: "Loja Não Encontrada | Caminhões à Venda" };
  }

  const r = revendas[0];
  return {
    title: `${r.nome_fantasia} - Estoque de Caminhões à Venda em ${r.cidade || "Brasil"}`,
    description: `Confira todos os caminhões, carretas e implementos disponíveis na vitrine de ${r.nome_fantasia}. Compre diretamente com a loja.`,
  };
}

export default async function LojaPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const slug = params.slug.toLowerCase();

  // 1. Buscar dados da revenda
  const { data: revendas } = await supabase
    .from("revendas")
    .select("*")
    .or(`nome_fantasia.ilike.%${slug}%,id.eq.${slug.length === 36 ? slug : "00000000-0000-0000-0000-000000000000"}`);

  if (!revendas || revendas.length === 0) {
    notFound();
  }

  const revenda = revendas[0];

  // 2. Buscar estoque de caminhões ativos da revenda
  const { data: anuncios } = await supabase
    .from("trucks")
    .select("*")
    .eq("revenda_id", revenda.id)
    .order("created_at", { ascending: false });

  // 3. Buscar avaliações da revenda
  const { data: avaliacoes } = await supabase
    .from("avaliacoes_revendas")
    .select("*")
    .eq("revenda_id", revenda.id);

  let mediaNota = 5.0;
  if (avaliacoes && avaliacoes.length > 0) {
    const soma = avaliacoes.reduce((acc: number, curr: any) => acc + curr.nota, 0);
    mediaNota = parseFloat((soma / avaliacoes.length).toFixed(1));
  }

  return (
    <div className="market-page">
      <PublicHeaderClient />

      <main className="market-container" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <StorefrontHeader
          revenda={revenda}
          totalAnuncios={(anuncios || []).length}
          mediaNota={mediaNota}
          totalAvaliacoes={(avaliacoes || []).length}
        />

        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", margin: "0 0 4px" }}>
            🚛 Veículos em Estoque ({ (anuncios || []).length })
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
            Confira as ofertas disponíveis diretamente na vitrine de {revenda.nome_fantasia}.
          </p>
        </div>

        {/* GRID DE ESTOQUE EXCLUSIVO DA LOJA */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {(anuncios || []).map((truck) => (
            <TruckCard key={truck.id} truck={truck} />
          ))}
        </div>

        {(anuncios || []).length === 0 && (
          <div style={{ padding: 48, textAlign: "center", background: "var(--surface)", borderRadius: 20, border: "1px solid var(--line)" }}>
            <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
              Esta loja ainda não possui veículos ativos cadastrados no momento.
            </p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
