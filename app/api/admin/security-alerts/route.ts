import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  try {
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Não autenticado." }, { status: 401 });
    }

    const { data: profile } = await supabaseUser
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ success: false, error: "Acesso não autorizado." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread") === "true";

    const supabaseAdmin = createServiceClient();
    let query = supabaseAdmin
      .from("admin_security_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);

    if (unreadOnly) {
      query = query.eq("lido", false);
    }

    const { data: alerts, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data: alerts || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Não autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const { alertId, markAllRead } = body;

    const supabaseAdmin = createServiceClient();

    if (markAllRead) {
      await supabaseAdmin
        .from("admin_security_alerts")
        .update({ lido: true })
        .eq("user_id", user.id);
    } else if (alertId) {
      await supabaseAdmin
        .from("admin_security_alerts")
        .update({ lido: true })
        .eq("id", alertId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
