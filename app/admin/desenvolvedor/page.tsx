import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { Terminal, ToggleLeft, ToggleRight, FileText, Database, ShieldAlert, Cpu } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDesenvolvedorPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  // Buscar feature flags e logs de auditoria
  const { data: featureFlags } = await supabase.from("feature_flags").select("*").order("nome", { ascending: true });
  const { data: auditLogs } = await supabase.from("audit_logs").select("*, perfis(email, nome)").order("created_at", { ascending: false }).limit(10);

  const formatDate = (str: string) => new Date(str).toLocaleString("pt-BR");

  return (
    <AdminLayout
      title="Painel do Desenvolvedor (Dev Tools & Audit)"
      subtitle="Controle de Feature Flags, verificação de infraestrutura e logs de auditoria."
      badge="Dev Tools"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* SEÇÃO FEATURE FLAGS */}
        <div className="admin-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <ToggleRight size={22} style={{ color: "var(--blue)" }} />
            <h3 style={{ fontSize: 16, fontWeight: 900, color: "var(--text)", margin: 0 }}>Feature Flags (Alternância de Recursos)</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(featureFlags || []).map((flag) => (
              <div key={flag.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--line)" }}>
                <div>
                  <strong style={{ display: "block", fontSize: 14, color: "var(--text)" }}>{flag.nome}</strong>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{flag.descricao || "Sem descrição"}</span>
                </div>
                <span className="admin-badge" style={{ background: flag.ativo ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: flag.ativo ? "#22c55e" : "#ef4444" }}>
                  {flag.ativo ? "ATIVO" : "INATIVO"}
                </span>
              </div>
            ))}
            {(featureFlags || []).length === 0 && (
              <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>Nenhuma feature flag cadastrada.</p>
            )}
          </div>
        </div>

        {/* LOGS DE AUDITORIA */}
        <div className="admin-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <ShieldAlert size={22} style={{ color: "#f59e0b" }} />
            <h3 style={{ fontSize: 16, fontWeight: 900, color: "var(--text)", margin: 0 }}>Logs de Auditoria Administrativa</h3>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ação</th>
                  <th>Usuário</th>
                  <th>IP</th>
                  <th style={{ textAlign: "right" }}>Data / Hora</th>
                </tr>
              </thead>
              <tbody>
                {(auditLogs || []).map((log) => (
                  <tr key={log.id}>
                    <td><strong>{log.acao}</strong></td>
                    <td style={{ fontSize: 12 }}>{log.perfis?.email || "Sistema"}</td>
                    <td style={{ fontSize: 11, fontFamily: "monospace", color: "var(--muted)" }}>{log.ip || "127.0.0.1"}</td>
                    <td style={{ textAlign: "right", fontSize: 12, color: "var(--muted)" }}>{formatDate(log.created_at)}</td>
                  </tr>
                ))}
                {(auditLogs || []).length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: 24, color: "var(--muted)", fontSize: 13 }}>
                      Nenhum log registrado até o momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
