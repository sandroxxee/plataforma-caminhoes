import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("trucks")
      .select("id")
      .limit(1);

    if (error) {
      return NextResponse.json({
        ok: false,
        error: error.message,
        hint: error.hint ?? null,
        code: error.code ?? null,
      }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      connected: true,
      rows_returned: data?.length ?? 0,
    });
  } catch (e: unknown) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    }, { status: 500 });
  }
}
