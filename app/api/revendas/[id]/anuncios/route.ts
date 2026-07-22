import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("trucks")
      .select("*")
      .eq("revenda_id", params.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
