import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { EditAnuncioForm } from "@/components/forms/EditAnuncioForm";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditarAnuncioPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  // Busca o anúncio
  let query = supabase
    .from("trucks")
    .select("id, user_id, marca, modelo, ano_modelo, preco, quilometragem, cidade, estado, carroceria, tracao, whatsapp, descricao, status, abaixo_fipe, video_url")
    .eq("id", id);

  // Se não for admin, só pode editar o próprio anúncio
  if (!isAdmin) {
    query = query.eq("user_id", user.id);
  }

  const { data: truck, error } = await query.single();

  if (error || !truck) {
    // Se não encontrou ou não tem permissão
    return notFound();
  }

  return (
    <PanelLayout
      title="Editar Anúncio"
      subtitle={`Editando: ${truck.marca} ${truck.modelo}`}
      role={isAdmin ? "admin" : "anunciante"}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <EditAnuncioForm truck={truck} isAdmin={isAdmin} />
      </div>
    </PanelLayout>
  );
}
