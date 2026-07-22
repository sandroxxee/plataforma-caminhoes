"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Bell, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminNotificacoesPage() {
  const [titulo, setTitulo] = useState("");
  const [corpo, setCorpo] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !corpo) return;

    setLoading(true);
    setMensagem(null);

    try {
      const res = await fetch("/api/notificacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, corpo }),
      });
      const data = await res.json();

      if (data.success) {
        setMensagem({ tipo: "sucesso", texto: "Notificação disparada com sucesso para os dispositivos cadastrados!" });
        setTitulo("");
        setCorpo("");
      } else {
        setMensagem({ tipo: "erro", texto: data.error || "Falha ao enviar notificação." });
      }
    } catch (err: any) {
      setMensagem({ tipo: "erro", texto: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Central de Notificações Push (Expo Mobile)"
      subtitle="Dispare avisos, promoções e alertas para os aplicativos móveis das revendas."
      badge="Push Notifications"
    >
      <div style={{ maxWidth: 640 }}>
        
        {mensagem && (
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 14,
              background: mensagem.tipo === "sucesso" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color: mensagem.tipo === "sucesso" ? "#22c55e" : "#ef4444",
              border: `1px solid ${mensagem.tipo === "sucesso" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            }}
          >
            {mensagem.tipo === "sucesso" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{mensagem.texto}</span>
          </div>
        )}

        <form onSubmit={handleEnviar} className="admin-card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>
              Título da Notificação *
            </label>
            <input
              type="text"
              className="admin-input"
              placeholder="Ex: 🚛 Novo caminhão Volvo cadastrado em promoção!"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--bg)", color: "var(--text)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>
              Conteúdo da Mensagem *
            </label>
            <textarea
              className="admin-input"
              rows={4}
              placeholder="Digite a mensagem completa que aparecerá na tela do celular..."
              value={corpo}
              onChange={(e) => setCorpo(e.target.value)}
              required
              style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--bg)", color: "var(--text)", fontFamily: "inherit" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-approve"
            style={{ padding: "12px 24px", borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Send size={16} /> {loading ? "Disparando..." : "Enviar Notificação Push"}
          </button>
        </form>

      </div>
    </AdminLayout>
  );
}
