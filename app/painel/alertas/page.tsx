import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { AlertasClient } from "./AlertasClient";

export const dynamic = "force-dynamic";

export default async function AlertasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: alertas } = await supabase
    .from("saved_searches")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <PanelLayout
      title="Alertas de busca"
      subtitle="Você recebe e-mail quando um caminhão novo corresponder aos seus filtros salvos."
    >
      <AlertasClient alertas={alertas ?? []} />
    </PanelLayout>
  );
}
