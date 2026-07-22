import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { BarChart3, Eye, MessageSquare, TrendingUp, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMetricasPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  // Buscar total de visualizações e cliques
  const { data: trucksData } = await supabase.from("trucks").select("id, titulo, marca, modelo, visualizacoes, cliques_whatsapp, preco").order("visualizacoes", { ascending: false }).limit(10);
  
  let totalViews = 0;
  let totalCliques = 0;
  (trucksData || []).forEach((t: any) => {
    totalViews += t.visualizacoes || 0;
    totalCliques += t.cliques_whatsapp || 0;
  });

  const taxaConversao = totalViews > 0 ? ((totalCliques / totalViews) * 100).toFixed(2) : "0.00";
  const money = (val: number) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <AdminLayout
      title="Métricas e Relatórios de Desempenho"
      subtitle="Analise dados de conversão, cliques no WhatsApp e tráfego orgânico."
      badge="Analytics"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* CARDS DE MÉTRICAS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          
          <div className="admin-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 12, textTransform: "uppercase" }}>Visualizações Totais</span>
              <Eye size={20} style={{ color: "var(--blue)" }} />
            </div>
            <strong style={{ display: "block", fontSize: 32, fontWeight: 900, color: "var(--text)", marginTop: 12 }}>{totalViews}</strong>
          </div>

          <div className="admin-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 12, textTransform: "uppercase" }}>Cliques WhatsApp</span>
              <MessageSquare size={20} style={{ color: "#25d366" }} />
            </div>
            <strong style={{ display: "block", fontSize: 32, fontWeight: 900, color: "var(--text)", marginTop: 12 }}>{totalCliques}</strong>
          </div>

          <div className="admin-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 12, textTransform: "uppercase" }}>Taxa de Conversão</span>
              <TrendingUp size={20} style={{ color: "#f59e0b" }} />
            </div>
            <strong style={{ display: "block", fontSize: 32, fontWeight: 900, color: "var(--text)", marginTop: 12 }}>{taxaConversao}%</strong>
          </div>

        </div>

        {/* TABELA DE TOP ANÚNCIOS MAIS ACESSADOS */}
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 800, textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>
            🔥 Anúncios Mais Visualizados
          </h3>
          
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Anúncio</th>
                  <th>Preço</th>
                  <th>Visualizações</th>
                  <th>Cliques WhatsApp</th>
                  <th style={{ textAlign: "right" }}>Conversão</th>
                </tr>
              </thead>
              <tbody>
                {(trucksData || []).map((t: any) => {
                  const views = t.visualizacoes || 0;
                  const cliques = t.cliques_whatsapp || 0;
                  const conv = views > 0 ? ((cliques / views) * 100).toFixed(1) : "0.0";

                  return (
                    <tr key={t.id}>
                      <td><strong>{t.marca} {t.modelo || t.titulo}</strong></td>
                      <td style={{ color: "var(--blue)", fontWeight: 800 }}>{money(Number(t.preco || 0))}</td>
                      <td>{views}</td>
                      <td style={{ color: "#25d366", fontWeight: 800 }}>{cliques}</td>
                      <td style={{ textAlign: "right", fontWeight: 800 }}>{conv}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
