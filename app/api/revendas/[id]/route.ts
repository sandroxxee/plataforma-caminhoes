import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("revendas")
      .select("*, perfis(email, nome)")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Revenda não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("revendas")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("revendas").delete().eq("id", params.id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "Revenda removida com sucesso." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
