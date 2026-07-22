import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const revenda_id = searchParams.get("revenda_id");

    if (!revenda_id) {
      return NextResponse.json({ success: false, error: "revenda_id é obrigatório." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("avaliacoes_revendas")
      .select("*")
      .eq("revenda_id", revenda_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    let mediaNota = 5.0;
    if (data && data.length > 0) {
      const soma = data.reduce((acc: number, curr: any) => acc + curr.nota, 0);
      mediaNota = parseFloat((soma / data.length).toFixed(1));
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      media_nota: mediaNota,
      total_avaliacoes: (data || []).length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { revenda_id, nome_comprador, nota, comentario } = body;

    if (!revenda_id || !nome_comprador || !nota) {
      return NextResponse.json({ success: false, error: "revenda_id, nome_comprador e nota são obrigatórios." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("avaliacoes_revendas")
      .insert([
        {
          revenda_id,
          nome_comprador,
          nota: Math.min(5, Math.max(1, Number(nota))),
          comentario: comentario || null,
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
