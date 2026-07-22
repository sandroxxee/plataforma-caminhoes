"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function iniciarAssinaturaAction(planId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/planos");
  }

  const { data: plan, error } = await supabase
    .from("plans")
    .select("*")
    .eq("id", planId)
    .single();

  if (error || !plan || !plan.stripe_price_id) {
    throw new Error("Plano inválido ou ID de preço do Stripe ausente.");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      success_url: `${siteUrl}/painel?checkout_success=true`,
      cancel_url: `${siteUrl}/planos?checkout_canceled=true`,
      client_reference_id: user.id,
      metadata: { plan_id: plan.id },
    });
  } catch (err: any) {
    console.error("[stripe-checkout] Erro ao instanciar sessão:", err?.message);
    throw new Error("Erro na comunicação com a API do Stripe.");
  }

  if (session && session.url) {
    redirect(session.url);
  }
}
