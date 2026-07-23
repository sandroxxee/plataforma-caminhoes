import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug: rawSlug } = await params;
    const slug = rawSlug.toLowerCase();
    const supabase = createServiceClient();

    // 1. Buscar revenda pelo nome fantasia ou ID aproximado
    const { data: revendas, error: revendaErr } = await supabase
      .from("revendas")
      .select("*, perfis(email, nome)")
      .or(`nome_fantasia.ilike.%${slug}%,id.eq.${slug.length === 36 ? slug : "00000000-0000-0000-0000-000000000000"}`);

    if (revendaErr || !revendas || revendas.length === 0) {
      return NextResponse.json({ success: false, error: "Loja não encontrada." }, { status: 404 });
    }

    const revenda = revendas[0];

    // 2. Buscar anúncios ativos da revenda
    const { data: anuncios } = await supabase
      .from("trucks")
      .select("*")
      .eq("revenda_id", revenda.id)
      .order("created_at", { ascending: false });

    // 3. Buscar avaliações da revenda
    const { data: avaliacoes } = await supabase
      .from("avaliacoes_revendas")
      .select("*")
      .eq("revenda_id", revenda.id)
      .order("created_at", { ascending: false });

    let mediaNota = 5.0;
    if (avaliacoes && avaliacoes.length > 0) {
      const soma = avaliacoes.reduce((acc: number, curr: any) => acc + curr.nota, 0);
      mediaNota = parseFloat((soma / avaliacoes.length).toFixed(1));
    }

    return NextResponse.json({
      success: true,
      revenda,
      anuncios: anuncios || [],
      avaliacoes: avaliacoes || [],
      media_nota: mediaNota,
      total_avaliacoes: (avaliacoes || []).length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
