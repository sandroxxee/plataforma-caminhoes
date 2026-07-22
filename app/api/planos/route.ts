import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from("planos").select("*").order("preco", { ascending: true });
    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, descricao, preco, tipo, limite_anuncios, duracao_dias, destaque_automatico } = body;

    if (!nome) {
      return NextResponse.json({ success: false, error: "Nome do plano é obrigatório." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("planos")
      .insert([
        {
          nome,
          descricao: descricao || null,
          preco: preco || 0,
          tipo: tipo || "assinatura",
          limite_anuncios: limite_anuncios || 5,
          duracao_dias: duracao_dias || 30,
          destaque_automatico: destaque_automatico || false,
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
