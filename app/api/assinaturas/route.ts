import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const revenda_id = searchParams.get("revenda_id");
    const status = searchParams.get("status");

    const supabase = createServiceClient();
    let query = supabase
      .from("assinaturas")
      .select("*, revendas(nome_fantasia, cnpj), planos(nome, preco, duracao_dias)")
      .order("created_at", { ascending: false });

    if (revenda_id) query = query.eq("revenda_id", revenda_id);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { revenda_id, plano_id, duracao_dias, pagamento_pix_id } = body;

    if (!revenda_id || !plano_id) {
      return NextResponse.json({ success: false, error: "revenda_id e plano_id são obrigatórios." }, { status: 400 });
    }

    const dias = duracao_dias || 30;
    const data_inicio = new Date();
    const data_fim = new Date();
    data_fim.setDate(data_fim.getDate() + dias);

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("assinaturas")
      .insert([
        {
          revenda_id,
          plano_id,
          data_inicio: data_inicio.toISOString(),
          data_fim: data_fim.toISOString(),
          status: "ativa",
          pagamento_pix_id: pagamento_pix_id || `PIX_${Date.now()}`,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
