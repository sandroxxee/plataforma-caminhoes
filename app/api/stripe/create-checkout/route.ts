import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
    }

    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Plano ID ausente." }, { status: 400 });
    }

    // Busca o plano no banco
    const { data: plan, error } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (error || !plan || !plan.stripe_price_id) {
      return NextResponse.json({ error: "Plano inválido ou sem configuração Stripe." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Cria a sessão de checkout no Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      success_url: `${siteUrl}/painel?checkout_success=true`,
      cancel_url: `${siteUrl}/planos?checkout_canceled=true`,
      client_reference_id: user.id,
      metadata: { plan_id: plan.id },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error("[stripe-checkout] Erro ao criar sessão:", err?.message);
    return NextResponse.json({ error: err?.message || "Erro interno no checkout." }, { status: 500 });
  }
}
