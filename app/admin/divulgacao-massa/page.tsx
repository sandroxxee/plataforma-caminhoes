import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminDivulgacaoMassaClient } from "@/components/AdminDivulgacaoMassaClient";

export const dynamic = "force-dynamic";

type TruckImage = { image_url: string | null; principal: boolean | null; ordem: number | null };
type Truck = {
  id: string;
  titulo: string | null;
  marca: string | null;
  modelo: string | null;
  ano_modelo: number | null;
  ano_fabricacao: number | null;
  preco: number | null;
  cidade: string | null;
  estado: string | null;
  carroceria: string | null;
  tracao: string | null;
  status: string | null;
  created_at: string | null;
  truck_images?: TruckImage[];
};

export default async function AdminDivulgacaoMassaPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  // Buscar todos os veículos aprovados
  const { data: trucks } = await supabase
    .from("trucks")
    .select(`
      id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao, status, created_at,
      truck_images ( image_url, principal, ordem )
    `)
    .eq("status", "aprovado")
    .order("created_at", { ascending: false });

  const ads = (trucks || []) as Truck[];

  return (
    <AdminLayout
      title="Divulgação em Massa"
      subtitle="Selecione múltiplos veículos para criar ofertas unificadas ou compartilhe mídias de forma extremamente rápida."
      badge="Admin"
    >
      <AdminDivulgacaoMassaClient anuncios={ads} />
    </AdminLayout>
  );
}
