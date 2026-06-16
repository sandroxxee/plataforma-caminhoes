import { NextResponse, NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  let query = supabase
    .from("trucks")
    .select("*", { count: "exact" })
    .eq("status", "aprovado")
    .limit(parseInt(searchParams.get("limit") || "20"))
    .offset(parseInt(searchParams.get("offset") || "0"))

  if (searchParams.get("marca")) query = query.eq("marca", searchParams.get("marca")!)
  if (searchParams.get("modelo")) query = query.eq("modelo", searchParams.get("modelo")!)
  if (searchParams.get("ano")) query = query.eq("ano", searchParams.get("ano")!)
  if (searchParams.get("estado")) query = query.eq("estado", searchParams.get("estado")!)
  if (searchParams.get("cidade")) query = query.eq("cidade", searchParams.get("cidade")!)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json(
      { error: "Falha ao buscar caminhones", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    data,
    pagination: { total: count, limit: 20, offset: 0 },
  })
}import { NextResponse, NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  let query = supabase
    .from("trucks")
    .select("*", { count: "exact" })
    .eq("status", "aprovado")
    .limit(parseInt(searchParams.get("limit") || "20"))
    .offset(parseInt(searchParams.get("offset") || "0"))

  if (searchParams.get("marca")) query = query.eq("marca", searchParams.get("marca")!)
  if (searchParams.get("modelo")) query = query.eq("modelo", searchParams.get("modelo")!)
  if (searchParams.get("ano")) query = query.eq("ano", searchParams.get("ano")!)
  if (searchParams.get("estado")) query = query.eq("estado", searchParams.get("estado")!)
  if (searchParams.get("cidade")) query = query.eq("cidade", searchParams.get("cidade")!)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json(
      { error: "Falha ao buscar caminhones", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    data,
    pagination: { total: count, limit: 20, offset: 0 },
  })
}
