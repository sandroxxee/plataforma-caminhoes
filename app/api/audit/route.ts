import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*, perfis(email, nome)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usuario_id, acao, detalhes, ip } = body;

    if (!acao) {
      return NextResponse.json({ success: false, error: "Ação é obrigatória." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("audit_logs")
      .insert([
        {
          usuario_id: usuario_id || null,
          acao,
          detalhes: detalhes || {},
          ip: ip || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
