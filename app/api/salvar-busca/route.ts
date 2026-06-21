import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();

  const { error } = await (supabase.from("saved_searches") as any).insert({
    user_id: user.id,
    marca: body.marca ?? null,
    ano_min: body.ano_min ?? null,
    ano_max: body.ano_max ?? null,
    preco_max: body.preco_max ?? null,
    estado: body.estado ?? null,
    termo: body.termo ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { data, error } = await supabase
    .from("saved_searches")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID faltando" }, { status: 400 });

  const { error } = await supabase
    .from("saved_searches")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
