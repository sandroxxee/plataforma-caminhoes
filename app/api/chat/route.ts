import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const truckId = req.nextUrl.searchParams.get("truck_id");
  const outroId = req.nextUrl.searchParams.get("outro_id");

  if (!truckId || !outroId) return NextResponse.json({ error: "Parâmetros faltando" }, { status: 400 });

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("truck_id", truckId)
    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${outroId}),and(sender_id.eq.${outroId},receiver_id.eq.${user.id})`)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { truck_id, receiver_id, content } = await req.json();
  if (!truck_id || !receiver_id || !content?.trim()) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const { data, error } = await supabase.from("chat_messages").insert({
    truck_id,
    sender_id: user.id,
    receiver_id,
    content: content.trim(),
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
