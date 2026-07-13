import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import AdminAnunciosClient from "./AdminAnunciosClient";

export const dynamic = "force-dynamic";

type TruckImage = { image_url: string | null; principal: boolean | null; ordem: number | null };
type Truck = {
  id: string;
  titulo: string | null;
  status: string | null;
  preco: number | null;
  cidade: string | null;
  estado: string | null;
  marca: string | null;
  modelo: string | null;
  whatsapp?: string | null;
  truck_images?: TruckImage[];
};

type Parceiro = {
  id: string;
  nome: string;
  celular: string;
};

export default async function AdminAnunciosPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  // Busca os caminhões contendo o whatsapp do anúncio
  const { data: trucksData } = await supabase
    .from("trucks")
    .select(`
      id, titulo, status, preco, cidade, estado, marca, modelo, whatsapp,
      truck_images ( image_url, principal, ordem )
    `)
    .order("created_at", { ascending: false });

  // Busca todos os parceiros cadastrados ativos
  const { data: parceirosData } = await supabase
    .from("parceiros")
    .select("id, nome, celular")
    .eq("ativo", true);

  const trucks = (trucksData || []) as Truck[];
  const parceiros = (parceirosData || []) as Parceiro[];

  return (
    <AdminLayout
      title="Todos os anúncios"
      subtitle="Controle os anúncios cadastrados, marque itens em lote para estoque de parceiros ou gerencie aprovações."
      badge="Admin"
      actions={<Link href="/painel/anuncios/novo" style={{ padding: "12px 20px", borderRadius: 14, background: "#1877f2", color: "#ffffff", textDecoration: "none", fontWeight: 800, fontSize: 14, boxShadow: "0 4px 12px rgba(24,119,242,0.2)" }}>Criar anúncio</Link>}
    >
      <Suspense fallback={<div style={{ color: "#64748b", fontWeight: 700, padding: 24, textAlign: "center" }}>Carregando painel de anúncios...</div>}>
        <AdminAnunciosClient 
          initialTrucks={trucks}
          parceiros={parceiros}
        />
      </Suspense>
    </AdminLayout>
  );
}
