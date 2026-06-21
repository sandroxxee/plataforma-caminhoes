import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { term } = await req.json();
    if (!term || term.trim().length < 2) return NextResponse.json({ ok: true });

    const supabase = await createClient();
    const clean = term.trim().toLowerCase().slice(0, 80);

    // Upsert: incrementa contador se já existe
    const { data: existing } = await supabase
      .from("search_logs")
      .select("id, count")
      .eq("term", clean)
      .single();

    if (existing) {
      await (supabase.from("search_logs") as any).update({ count: existing.count + 1, updated_at: new Date().toISOString() }).eq("id", existing.id);
    } else {
      await (supabase.from("search_logs") as any).insert({ term: clean, count: 1 });
    }
  } catch (error) {
    console.error("Error logging search term:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("search_logs")
    .select("term, count")
    .order("count", { ascending: false })
    .limit(8);

  return NextResponse.json(data || []);
}
