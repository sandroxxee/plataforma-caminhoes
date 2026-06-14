import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const offset = Math.max(0, Number(searchParams.get("offset") ?? 0));
  const limit  = Math.min(48, Math.max(1, Number(searchParams.get("limit") ?? 24)));

  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, whatsapp, destaque, views, created_at, truck_images(image_url, principal, ordem)`, { count: "exact" })
    .eq("status", "aprovado")
    .eq("vendido", false)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ trucks: data ?? [], total: count ?? 0 });
}
