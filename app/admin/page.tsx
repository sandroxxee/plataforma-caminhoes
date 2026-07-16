import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { Clock, CheckCircle, Building2, Users, ArrowUpRight, Sparkles, Plus, Image, Palette, Send, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  // Buscar contagens reativas
  const { count: totalTrucks } = await supabase.from("trucks").select("*", { count: "exact", head: true });
  const { count: pendentesCount } = await supabase.from("trucks").select("*", { count: "exact", head: true }).eq("status", "pendente");
  const { count: aprovadosCount } = await supabase.from("trucks").select("*", { count: "exact", head: true }).eq("status", "aprovado");
  const { count: parceirosCount } = await supabase.from("parceiros").select("*", { count: "exact", head: true });
  const { count: usuariosCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });

  // Buscar últimos 5 caminhões cadastrados
  const { data: ultimosCaminhoes } = await supabase
    .from("trucks")
    .select("id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const money = (value: number | null) => {
    if (!value) return "Sob consulta";
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const statusLabel = (status: string | null) => {
    if (status === "aprovado") return "Aprovado";
    if (status === "reprovado") return "Reprovado";
    return "Pendente";
  };

  return (
    <AdminLayout
      title="Painel Geral"
      subtitle="Visão geral e controle de métricas da plataforma."
      badge="Dashboard"
      actions={
        <Link href="/painel/anuncios/novo" className="admin-btn admin-btn-approve" style={{ gap: 8, height: 42, padding: "0 18px", borderRadius: 12 }}>
          <Plus size={16} /> Criar Anúncio
        </Link>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* CARDS DE KPIS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          
          {/* Card: Pendentes */}
          <Link href="/admin/pendentes" style={{ textDecoration: "none" }}>
            <div className="admin-card" style={{ display: "block", padding: 20, cursor: "pointer", border: (pendentesCount ?? 0) > 0 ? "1px solid #f59e0b" : "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 13, textTransform: "uppercase" }}>Aprovações Pendentes</span>
                <Clock size={20} style={{ color: "#f59e0b" }} />
              </div>
              <strong style={{ display: "block", fontSize: 32, fontWeight: 900, color: "var(--text)", marginTop: 12 }}>{pendentesCount ?? 0}</strong>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#f59e0b", fontWeight: 800, marginTop: 8 }}>
                Ver fila de aprovação <ArrowUpRight size={13} />
              </span>
            </div>
          </Link>

          {/* Card: Aprovados */}
          <Link href="/admin/anuncios" style={{ textDecoration: "none" }}>
            <div className="admin-card" style={{ display: "block", padding: 20, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 13, textTransform: "uppercase" }}>Anúncios Ativos</span>
                <CheckCircle size={20} style={{ color: "#22c55e" }} />
              </div>
              <strong style={{ display: "block", fontSize: 32, fontWeight: 900, color: "var(--text)", marginTop: 12 }}>{aprovadosCount ?? 0}</strong>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--blue)", fontWeight: 800, marginTop: 8 }}>
                Todos os anúncios ({totalTrucks ?? 0}) <ArrowUpRight size={13} />
              </span>
            </div>
          </Link>

          {/* Card: Parceiros */}
          <Link href="/admin/parceiros" style={{ textDecoration: "none" }}>
            <div className="admin-card" style={{ display: "block", padding: 20, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 13, textTransform: "uppercase" }}>Parceiros / Lojas</span>
                <Building2 size={20} style={{ color: "var(--blue)" }} />
              </div>
              <strong style={{ display: "block", fontSize: 32, fontWeight: 900, color: "var(--text)", marginTop: 12 }}>{parceirosCount ?? 0}</strong>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--blue)", fontWeight: 800, marginTop: 8 }}>
                Gerenciar parceiros <ArrowUpRight size={13} />
              </span>
            </div>
          </Link>

          {/* Card: Usuários */}
          <Link href="/admin/usuarios" style={{ textDecoration: "none" }}>
            <div className="admin-card" style={{ display: "block", padding: 20, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 13, textTransform: "uppercase" }}>Usuários Cadastrados</span>
                <Users size={20} style={{ color: "var(--muted)" }} />
              </div>
              <strong style={{ display: "block", fontSize: 32, fontWeight: 900, color: "var(--text)", marginTop: 12 }}>{usuariosCount ?? 0}</strong>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--blue)", fontWeight: 800, marginTop: 8 }}>
                Ver lista de usuários <ArrowUpRight size={13} />
              </span>
            </div>
          </Link>

        </div>

        {/* SEÇÃO PRINCIPAL EM DUAS COLUNAS */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          
          {/* Coluna Esquerda: Últimos Cadastros */}
          <div style={{ flex: 1.3, minWidth: 400, display: "flex", flexDirection: "column", gap: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", margin: "0 0 4px" }}>
              🚛 Últimos Veículos Cadastrados
            </h3>
            
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Veículo</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {(ultimosCaminhoes || []).map((t) => {
                    const status = t.status;
                    const statusColor = status === "aprovado" ? "#22c55e" : status === "reprovado" ? "#ef4444" : "#f59e0b";
                    const statusBg = status === "aprovado" ? "rgba(34,197,94,0.1)" : status === "reprovado" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)";

                    return (
                      <tr key={t.id}>
                        <td>
                          <strong>{t.marca} {t.modelo || t.titulo}</strong>
                          <span style={{ display: "block", fontSize: 11, color: "var(--muted)", marginTop: 2, fontWeight: 700 }}>
                            Ano: {t.ano_modelo || t.ano_fabricacao || "-"}
                          </span>
                        </td>
                        <td style={{ color: "var(--blue)", fontWeight: 800 }}>{money(t.preco)}</td>
                        <td>
                          <span className="admin-badge" style={{ background: statusBg, color: statusColor, padding: "4px 10px", fontSize: 10 }}>
                            {statusLabel(status)}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", color: "var(--muted)", fontSize: 12 }}>{formatDate(t.created_at)}</td>
                      </tr>
                    );
                  })}
                  {(ultimosCaminhoes || []).length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: 24, color: "var(--muted)", fontSize: 13 }}>
                        Nenhum caminhão cadastrado na base.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coluna Direita: Atalhos e Ações Rápidas */}
          <div style={{ flex: 0.9, minWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", margin: "0 0 4px" }}>
              ⚡ Atalhos e Ações Rápidas
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              
              <Link href="/admin/divulgacao-massa" style={{ textDecoration: "none" }}>
                <div className="admin-card" style={{ display: "flex", padding: 16, cursor: "pointer", alignItems: "center", justifyItems: "center", gridTemplateColumns: "auto 1fr" }}>
                  <div style={{ display: "flex", width: 40, height: 40, borderRadius: 10, background: "var(--blueSoft)", color: "var(--blue)", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                    <Send size={18} />
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text)", fontSize: 14 }}>Divulgação em Lote</strong>
                    <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>Gerar posts e copiar links</span>
                  </div>
                </div>
              </Link>

              <Link href="/admin/ferramentas-fotos" style={{ textDecoration: "none" }}>
                <div className="admin-card" style={{ display: "flex", padding: 16, cursor: "pointer", alignItems: "center", justifyItems: "center", gridTemplateColumns: "auto 1fr" }}>
                  <div style={{ display: "flex", width: 40, height: 40, borderRadius: 10, background: "rgba(124,58,237,0.1)", color: "#7c3aed", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                    <Image size={18} />
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text)", fontSize: 14 }}>Ferramentas de Fotos</strong>
                    <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>Baixar fotos soltas ou em ZIP</span>
                  </div>
                </div>
              </Link>

              <Link href="/admin/aparencia" style={{ textDecoration: "none" }}>
                <div className="admin-card" style={{ display: "flex", padding: 16, cursor: "pointer", alignItems: "center", justifyItems: "center", gridTemplateColumns: "auto 1fr" }}>
                  <div style={{ display: "flex", width: 40, height: 40, borderRadius: 10, background: "rgba(16,185,129,0.1)", color: "#10b981", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                    <Palette size={18} />
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text)", fontSize: 14 }}>Visual e Layout</strong>
                    <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>Ajustar logo, banner e cores</span>
                  </div>
                </div>
              </Link>

              <Link href="/admin/lista-transmissao" style={{ textDecoration: "none" }}>
                <div className="admin-card" style={{ display: "flex", padding: 16, cursor: "pointer", alignItems: "center", justifyItems: "center", gridTemplateColumns: "auto 1fr" }}>
                  <div style={{ display: "flex", width: 40, height: 40, borderRadius: 10, background: "var(--soft)", color: "var(--muted)", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text)", fontSize: 14 }}>Lista de Transmissão</strong>
                    <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>Ver contatos de novos cadastros</span>
                  </div>
                </div>
              </Link>

            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
