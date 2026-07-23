import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { MensagensClient } from "./MensagensClient";

export const dynamic = "force-dynamic";

export default async function MensagensPage({ searchParams }: { searchParams: Promise<{ chat?: string }> }) {
  const { chat } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Busca conversas onde o usuário é comprador ou vendedor
  const { data: rawConversations } = await supabase
    .from("conversations")
    .select(`
      id,
      created_at,
      last_message_at,
      ad_id,
      buyer_id,
      seller_id,
      trucks (
        titulo,
        preco,
        perfil
      )
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false });

  const conversations = (rawConversations || []).map((c: any) => {
    const truckObj = Array.isArray(c.trucks) ? c.trucks[0] : c.trucks;
    return {
      id: String(c.id),
      created_at: String(c.created_at),
      last_message_at: String(c.last_message_at),
      ad_id: String(c.ad_id),
      buyer_id: String(c.buyer_id),
      seller_id: String(c.seller_id),
      trucks: truckObj ? {
        titulo: String(truckObj.titulo || "Veículo"),
        preco: Number(truckObj.preco || 0),
        perfil: String(truckObj.perfil || ""),
      } : null,
    };
  });

  return (
    <PanelLayout
      title="Mensagens"
      subtitle="Converse em tempo real com compradores e vendedores interessados."
      badge="Chat"
    >
      <MensagensClient 
        userId={user.id} 
        initialConversations={conversations} 
        activeChatId={chat || null}
      />
    </PanelLayout>
  );
}
