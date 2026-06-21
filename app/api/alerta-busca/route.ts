import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, marca, estado, preco_max, termo } = await req.json();
    if (!email || !email.includes("@")) return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    if (!marca && !estado && !termo) return NextResponse.json({ error: "Informe ao menos um filtro" }, { status: 400 });

    const supabase = await createClient();
    const { error } = await (supabase.from("alertas_busca") as any).insert({
      email: email.toLowerCase().trim(),
      marca: marca || null,
      estado: estado || null,
      preco_max: preco_max || null,
      termo: termo || null,
      ativo: true,
    });

    if (error) {
      // duplicado = já cadastrado
      if (error.code === "23505") return NextResponse.json({ ok: true, msg: "Você já tem esse alerta cadastrado." });
      return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, msg: "Alerta criado! Você será avisado por email." });
  } catch {
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}
