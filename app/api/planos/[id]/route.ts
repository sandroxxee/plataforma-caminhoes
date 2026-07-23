import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("planos")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();
    const { error } = await supabase.from("planos").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "Plano removido com sucesso." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
