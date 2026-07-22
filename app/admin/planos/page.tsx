import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { Award, CheckCircle2, Plus, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPlanosPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  const { data: planos } = await supabase.from("planos").select("*").order("preco", { ascending: true });

  const money = (val: number) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <AdminLayout
      title="Gestão de Planos de Assinatura"
      subtitle="Configure opções de anúncios individuais, destaques e planos para revendas."
      badge="Planos"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* GRID DE CARDS DE PLANOS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {(planos || []).map((p) => (
            <div key={p.id} className="admin-card" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span className="admin-badge" style={{ background: "var(--blueSoft)", color: "var(--blue)", textTransform: "uppercase", fontSize: 10 }}>
                    {p.tipo}
                  </span>
                  {p.destaque_automatico && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#f59e0b", fontSize: 11, fontWeight: 800 }}>
                      <Star size={12} fill="#f59e0b" /> Destaque Incluso
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", margin: "0 0 8px" }}>{p.nome}</h3>
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>{p.descricao || "Sem descrição informada."}</p>

                <div style={{ fontSize: 32, fontWeight: 900, color: "var(--blue)", marginBottom: 16 }}>
                  {money(Number(p.preco))}
                  <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}> / {p.duracao_dias} dias</span>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--text)" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color="#22c55e" /> Até {p.limite_anuncios} anúncios simultâneos
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color="#22c55e" /> Validade de {p.duracao_dias} dias
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}
