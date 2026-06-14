import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const MARCAS_VALIDAS  = ["Mercedes-Benz","Scania","Volvo","Volkswagen","Ford","Iveco","DAF","MAN","Agrale"];
const ESTADOS_VALIDOS = ["SC","PR","RS","SP","MG","MS","MT","GO","BA","RJ","ES","PE","CE","PA","AM"];
const FAIXAS = [
  { min: 0, max: Infinity },
  { min: 0, max: 100_000 },
  { min: 100_000, max: 200_000 },
  { min: 200_000, max: 400_000 },
  { min: 400_000, max: Infinity },
];

export async function GET(req: NextRequest) {
  const sp     = req.nextUrl.searchParams;
  const offset = Math.max(0, Number(sp.get("offset") ?? 0));
  const limit  = Math.min(48, Math.max(1, Number(sp.get("limit") ?? 24)));
  const marcaRaw  = sp.get("marca")  ?? "";
  const estadoRaw = sp.get("estado") ?? "";
  const faixaIdx  = Math.max(0, Math.min(FAIXAS.length - 1, Number(sp.get("faixa") ?? 0)));
  const marca  = MARCAS_VALIDAS.includes(marcaRaw)   ? marcaRaw  : "";
  const estado = ESTADOS_VALIDOS.includes(estadoRaw) ? estadoRaw : "";
  const { min, max } = FAIXAS[faixaIdx];

  const supabase = await createClient();
  let q = supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,whatsapp,destaque,views,created_at,truck_images(image_url,principal,ordem)`, { count: "exact" })
    .eq("status", "aprovado")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (marca)            q = q.eq("marca",  marca);
  if (estado)           q = q.eq("estado", estado);
  if (min > 0)          q = q.gte("preco", min);
  if (max !== Infinity) q = q.lte("preco", max);

  const { data, error, count } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ trucks: data ?? [], total: count ?? 0 });
}
