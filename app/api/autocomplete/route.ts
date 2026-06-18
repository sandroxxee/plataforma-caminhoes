import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  const supabase = await createClient();

  // Busca marcas + modelos + titulos distintos que contenham o termo
  const { data } = await supabase
    .from("trucks")
    .select("marca, modelo, titulo")
    .eq("status", "aprovado")
    .or(`marca.ilike.%${q}%,modelo.ilike.%${q}%,titulo.ilike.%${q}%`)
    .limit(40);

  if (!data) return NextResponse.json([]);

  // Monta sugestões únicas priorizando marca+modelo
  const set = new Set<string>();
  const suggestions: string[] = [];

  for (const row of data) {
    const combo = [row.marca, row.modelo].filter(Boolean).join(" ");
    if (combo && !set.has(combo)) { set.add(combo); suggestions.push(combo); }
  }
  for (const row of data) {
    if (row.titulo && !set.has(row.titulo)) { set.add(row.titulo); suggestions.push(row.titulo); }
  }

  return NextResponse.json(suggestions.slice(0, 8));
}
