import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ favoritos: [] });

  const { data } = await supabase
    .from("favoritos")
    .select("truck_id")
    .eq("user_id", user.id);

  return NextResponse.json({ favoritos: (data || []).map((f) => f.truck_id) });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { truck_id } = await req.json();
  if (!truck_id) return NextResponse.json({ error: "truck_id obrigatório" }, { status: 400 });

  const { error } = await supabase
    .from("favoritos")
    .insert({ user_id: user.id, truck_id });

  if (error?.code === "23505") {
    // Já existe — remove (toggle)
    await supabase.from("favoritos").delete()
      .eq("user_id", user.id).eq("truck_id", truck_id);
    return NextResponse.json({ action: "removed" });
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ action: "added" });
}
