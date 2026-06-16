import { NextResponse, NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from("trucks")
    .select("*")
    .eq("id", id)
    .eq("status", "aprovado")
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Caminhon nao encontrado" }, { status: 404 })
  }

  return NextResponse.json({ success: true, data })
}
