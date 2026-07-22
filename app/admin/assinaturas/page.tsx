import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { CreditCard, Calendar, QrCode, RefreshCw } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAssinaturasPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  const { data: assinaturas } = await supabase
    .from("assinaturas")
    .select("*, revendas(nome_fantasia, cnpj), planos(nome, preco, duracao_dias)")
    .order("created_at", { ascending: false });

  const formatDate = (str: string) => new Date(str).toLocaleDateString("pt-BR");
  const money = (val: number) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <AdminLayout
      title="Gestão de Assinaturas e Pagamentos PIX"
      subtitle="Monitore expirações de planos, renovações e comprovantes de pagamento."
      badge="Assinaturas"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        
        {/* TABELA DE ASSINATURAS */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Revenda</th>
                <th>Plano</th>
                <th>Valor</th>
                <th>Vigência</th>
                <th>ID Transação PIX</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(assinaturas || []).map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong>{a.revendas?.nome_fantasia || "Revenda Não Identificada"}</strong>
                  </td>
                  <td>{a.planos?.nome || "Plano Padrão"}</td>
                  <td style={{ color: "var(--blue)", fontWeight: 800 }}>
                    {money(Number(a.planos?.preco || 0))}
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {formatDate(a.data_inicio)} até <strong>{formatDate(a.data_fim)}</strong>
                  </td>
                  <td style={{ fontSize: 11, fontFamily: "monospace", color: "var(--muted)" }}>
                    {a.pagamento_pix_id || "PIX_GERADO_AUTOMATICO"}
                  </td>
                  <td>
                    <span
                      className="admin-badge"
                      style={{
                        background: a.status === "ativa" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        color: a.status === "ativa" ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(assinaturas || []).length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>
                    Nenhuma assinatura ativa no momento.
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
