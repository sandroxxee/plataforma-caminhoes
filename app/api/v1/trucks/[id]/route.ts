import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from("trucks")
    .select("*")
    .eq("id", params.id)
    .eq("status", "aprovado")
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Caminhon nao encontrado" }, { status: 404 })
  }

  return NextResponse.json({ success: true, data })
}
