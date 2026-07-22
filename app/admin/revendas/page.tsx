import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { Building2, CheckCircle, ShieldCheck, Plus, Search, MapPin, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminRevendasPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  const { data: revendas } = await supabase
    .from("revendas")
    .select("*, perfis(email, nome)")
    .order("created_at", { ascending: false });

  return (
    <AdminLayout
      title="Gestão de Revendas e Lojas"
      subtitle="Gerencie lojistas, credenciamento e concessão do selo verificado."
      badge="Revendas"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        
        {/* BARRA SUPERIOR DE AÇÕES */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>Total de Lojas:</span>
            <strong style={{ fontSize: 18, color: "var(--text)" }}>{(revendas || []).length}</strong>
          </div>
        </div>

        {/* TABELA DE REVENDAS */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Loja / Razão Social</th>
                <th>CNPJ</th>
                <th>Localização</th>
                <th>Selo Verificado</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Contato</th>
              </tr>
            </thead>
            <tbody>
              {(revendas || []).map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.nome_fantasia}</strong>
                    {r.razao_social && (
                      <span style={{ display: "block", fontSize: 11, color: "var(--muted)" }}>{r.razao_social}</span>
                    )}
                  </td>
                  <td style={{ fontSize: 12, fontFamily: "monospace" }}>{r.cnpj || "Não informado"}</td>
                  <td style={{ fontSize: 12 }}>
                    {r.cidade ? `${r.cidade} - ${r.estado || ""}` : "Brasil"}
                  </td>
                  <td>
                    {r.selo_verificado ? (
                      <span className="admin-badge" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", gap: 4 }}>
                        <ShieldCheck size={12} /> Verificado
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>Normal</span>
                    )}
                  </td>
                  <td>
                    <span
                      className="admin-badge"
                      style={{
                        background: r.status === "ativo" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                        color: r.status === "ativo" ? "#22c55e" : "#f59e0b",
                      }}
                    >
                      {r.status || "pendente"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", fontSize: 12 }}>
                    {r.whatsapp || r.telefone || "-"}
                  </td>
                </tr>
              ))}
              {(revendas || []).length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>
                    Nenhuma revenda cadastrada na base.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
}
