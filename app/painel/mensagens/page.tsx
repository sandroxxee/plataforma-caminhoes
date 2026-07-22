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
  const { data: conversations, error } = await supabase
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

  return (
    <PanelLayout
      title="Mensagens"
      subtitle="Converse em tempo real com compradores e vendedores interessados."
      badge="Chat"
    >
      <MensagensClient 
        userId={user.id} 
        initialConversations={conversations || []} 
        activeChatId={chat || null}
      />
    </PanelLayout>
  );
}
