import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { DeveloperPanelClient } from "./DeveloperPanelClient";
import { getEnvStatusAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminDeveloperPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/painel");

  // Coleta o status inicial das variáveis de ambiente no servidor
  const envStatus = await getEnvStatusAction();

  return (
    <AdminLayout
      title="Painel do Desenvolvedor"
      subtitle="Diagnósticos, status de infraestrutura e utilitários do sistema."
      badge="Desenvolvimento"
    >
      <DeveloperPanelClient envStatus={envStatus} />
    </AdminLayout>
  );
}
