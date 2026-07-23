import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { AdminLayout } from "@/components/AdminLayout";
import SegurancaClient from "./SegurancaClient";

export const dynamic = "force-dynamic";

export default async function AdminSegurancaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/painel");

  const supabaseAdmin = createServiceClient();

  // Buscar sessões de usuários/admins
  const { data: sessões } = await supabaseAdmin
    .from("user_sessions")
    .select("*, perfis(id, email, nome, role)")
    .order("ultimo_acesso", { ascending: false })
    .limit(100);

  // Buscar logs de auditoria (o que editou/mexeu)
  const { data: logsAuditoria } = await supabaseAdmin
    .from("audit_logs")
    .select("*, perfis(id, email, nome, role)")
    .order("created_at", { ascending: false })
    .limit(100);

  // Buscar alertas de segurança multidispositivo
  const { data: alertasSeguranca } = await supabaseAdmin
    .from("admin_security_alerts")
    .select("*, perfis(id, email, nome)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <AdminLayout
      title="Segurança & Auditoria"
      subtitle="Monitoramento de últimos acessos, navegadores, localização, tempo online e registro de edições no sistema."
      badge="Segurança"
    >
      <SegurancaClient
        initialSessions={sessões || []}
        initialAuditLogs={logsAuditoria || []}
        initialAlerts={alertasSeguranca || []}
      />
    </AdminLayout>
  );
}
