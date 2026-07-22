import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const busca = searchParams.get("busca");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const supabase = createServiceClient();
    let query = supabase
      .from("revendas")
      .select("*, perfis(email, nome)", { count: "exact" })
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }
    if (busca) {
      query = query.or(`nome_fantasia.ilike.%${busca}%,cnpj.ilike.%${busca}%,cidade.ilike.%${busca}%`);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [], total: count || 0 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome_fantasia, razao_social, cnpj, cidade, estado, telefone, whatsapp, user_id } = body;

    if (!nome_fantasia) {
      return NextResponse.json({ success: false, error: "Nome fantasia é obrigatório." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("revendas")
      .insert([
        {
          nome_fantasia,
          razao_social: razao_social || null,
          cnpj: cnpj || null,
          cidade: cidade || null,
          estado: estado || null,
          telefone: telefone || null,
          whatsapp: whatsapp || null,
          user_id: user_id || null,
          status: "pendente",
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
