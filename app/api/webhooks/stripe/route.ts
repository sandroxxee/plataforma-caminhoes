import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Webhook secret ou assinatura ausente." }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[stripe-webhook] Erro ao verificar assinatura:", err?.message);
    return NextResponse.json({ error: `Signature verification failed: ${err?.message}` }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.client_reference_id;
        const planId = session.metadata?.plan_id;
        const subscriptionId = session.subscription;

        if (!userId || !planId) {
          console.warn("[stripe-webhook] Metadata do plano ou usuário ausente na sessão.");
          break;
        }

        // Criar ou atualizar a assinatura no Supabase
        const { error } = await supabase.from("subscriptions").insert({
          user_id: userId,
          plan_id: planId,
          status: "active",
          starts_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias de validade
          stripe_subscription_id: subscriptionId,
          auto_renew: true,
        });

        if (error) throw error;
        console.log(`[stripe-webhook] Assinatura criada com sucesso para o usuário ${userId}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;

        // Atualizar assinatura para cancelada
        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "canceled", auto_renew: false })
          .eq("stripe_subscription_id", subscription.id);

        if (error) throw error;
        console.log(`[stripe-webhook] Assinatura ${subscription.id} atualizada para cancelada.`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[stripe-webhook] Erro ao atualizar Supabase:", err?.message);
    return NextResponse.json({ error: "Erro ao atualizar base de dados." }, { status: 500 });
  }
}
