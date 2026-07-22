"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function iniciarConversaAction(truckId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redireciona para o login se o comprador não estiver logado
    redirect(`/login?next=/caminhoes/${truckId}`);
  }

  // Busca o proprietário (vendedor) do veículo
  const { data: truck, error: truckError } = await supabase
    .from("trucks")
    .select("user_id")
    .eq("id", truckId)
    .single();

  if (truckError || !truck || !truck.user_id) {
    throw new Error("Veículo não encontrado.");
  }

  const sellerId = truck.user_id;

  if (user.id === sellerId) {
    throw new Error("Você é o proprietário deste anúncio e não pode iniciar um chat consigo mesmo.");
  }

  // Verifica se já existe uma conversa entre este comprador e vendedor para este veículo
  const { data: existingConv } = await supabase
    .from("conversations")
    .select("id")
    .eq("ad_id", truckId)
    .eq("buyer_id", user.id)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (existingConv) {
    redirect(`/painel/mensagens?chat=${existingConv.id}`);
  }

  // Se não existir, cria a conversa no Supabase
  const { data: newConv, error: createError } = await supabase
    .from("conversations")
    .insert({
      ad_id: truckId,
      buyer_id: user.id,
      seller_id: sellerId,
      last_message_at: new Date().toISOString()
    })
    .select("id")
    .single();

  if (createError || !newConv) {
    console.error("Erro ao criar conversa:", createError?.message);
    throw new Error("Erro técnico ao iniciar chat com o vendedor.");
  }

  redirect(`/painel/mensagens?chat=${newConv.id}`);
}
