import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dias = parseInt(searchParams.get("dias") || "30");

    const supabase = createServiceClient();

    // Data de corte
    const dataCorte = new Date();
    dataCorte.setDate(dataCorte.getDate() - dias);

    // Buscar total de visualizações e cliques
    const { data: trucksData } = await supabase.from("trucks").select("visualizacoes, cliques_whatsapp");
    const { count: totalRevendas } = await supabase.from("revendas").select("*", { count: "exact", head: true });
    const { count: totalAssinaturas } = await supabase.from("assinaturas").select("*", { count: "exact", head: true }).eq("status", "ativa");

    let totalViews = 0;
    let totalCliques = 0;

    (trucksData || []).forEach((t: any) => {
      totalViews += t.visualizacoes || 0;
      totalCliques += t.cliques_whatsapp || 0;
    });

    const taxaConversao = totalViews > 0 ? ((totalCliques / totalViews) * 100).toFixed(2) : "0.00";

    return NextResponse.json({
      success: true,
      periodo_dias: dias,
      total_views: totalViews,
      total_cliques_whatsapp: totalCliques,
      taxa_conversao_pct: parseFloat(taxaConversao),
      total_revendas: totalRevendas || 0,
      total_assinaturas_ativas: totalAssinaturas || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
