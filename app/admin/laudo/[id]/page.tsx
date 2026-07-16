import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminLaudoComercialClient } from "@/components/AdminLaudoComercialClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLaudoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  const { data: truck } = await supabase
    .from("trucks")
    .select(`
      id, titulo, marca, modelo, ano_modelo, preco,
      cidade, estado, carroceria, tracao, whatsapp, descricao,
      truck_images ( image_url, principal, ordem )
    `)
    .eq("id", id)
    .single();

  if (!truck) notFound();

  return (
    <AdminLayout
      title="Laudo Comercial"
      subtitle={truck.titulo || "Avalia\u00e7\u00e3o mercadol\u00f3gica do ve\u00edculo"}
      badge="Admin"
      actions={
        <Link
          href="/admin/anuncios"
          className="admin-btn admin-btn-edit"
          style={{ padding: "10px 18px", borderRadius: 12, fontSize: 13 }}
        >
          ← Voltar
        </Link>
      }
    >
      <AdminLaudoComercialClient truck={truck} />
    </AdminLayout>
  );
}
