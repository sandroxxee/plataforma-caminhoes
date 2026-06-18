import { createClient } from "@/lib/supabase/server";
import { MapaAnuncios } from "@/components/MapaAnuncios";

export const revalidate = 300; // 5 min

export default async function MapaPage() {
  const supabase = await createClient();

  const { data: trucks } = await supabase
    .from("trucks")
    .select("id, titulo, preco, cidade, estado, imagens, slug")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false })
    .limit(500);

  const trucksFormatados = (trucks ?? []).map((t) => ({
    id: t.id,
    titulo: t.titulo ?? "",
    preco: t.preco ?? null,
    cidade: t.cidade ?? "",
    estado: t.estado ?? "",
    imagem: Array.isArray(t.imagens) ? t.imagens[0] : null,
    slug: t.slug ?? null,
  }));

  return (
    <div className="mapa-page">
      <div className="mapa-page-header">
        <h1>Mapa de caminhões</h1>
        <p>{trucksFormatados.length} anúncios ativos no Brasil</p>
      </div>

      <MapaAnuncios trucks={trucksFormatados} />

      <style>{`
        .mapa-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .mapa-page-header h1 {
          margin: 0 0 4px;
          font-size: 28px;
          font-weight: 900;
          color: #f4f4f5;
        }
        .mapa-page-header p {
          margin: 0;
          color: #6b7280;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}
