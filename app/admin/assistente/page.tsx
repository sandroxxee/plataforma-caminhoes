"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Bot, Send, Sparkles, User, RefreshCw } from "lucide-react";

interface ChatMessage {
  remetente: "usuario" | "ia";
  texto: string;
}

export default function AdminAssistentePage() {
  const [mensagens, setMensagens] = useState<ChatMessage[]>([
    {
      remetente: "ia",
      texto: "Olá! Sou o Assistente IA do Caminhões à Venda (Google Gemini). Como posso ajudar você hoje? Você pode me pedir sugestões de precificação de caminhões, redação de descrições comerciais atrativas ou dicas de vendas!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userPrompt = input.trim();
    setInput("");
    setMensagens((prev) => [...prev, { remetente: "usuario", texto: userPrompt }]);
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      const data = await res.json();

      setMensagens((prev) => [
        ...prev,
        { remetente: "ia", texto: data.resposta || "Desculpe, ocorreu uma falha ao processar a resposta." },
      ]);
    } catch (err: any) {
      setMensagens((prev) => [
        ...prev,
        { remetente: "ia", texto: `Erro na comunicação com o assistente: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Assistente IA de Precificação e Vendas (Gemini)"
      subtitle="Obtenha estimativas de preços de caminhões, descrições perfeitas e inteligência de mercado."
      badge="IA Gemini"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "calc(100vh - 220px)", minHeight: 480 }}>
        
        {/* CONTAINER DO CHAT */}
        <div
          className="admin-card"
          style={{
            flex: 1,
            padding: 20,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            background: "var(--surface)",
          }}
        >
          {mensagens.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 12,
                alignSelf: m.remetente === "usuario" ? "flex-end" : "flex-start",
                maxWidth: "80%",
              }}
            >
              {m.remetente === "ia" && (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--blueSoft)",
                    color: "var(--blue)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Bot size={18} />
                </div>
              )}

              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: 16,
                  fontSize: 14,
                  lineHeight: 1.6,
                  background: m.remetente === "usuario" ? "var(--blue)" : "var(--soft)",
                  color: m.remetente === "usuario" ? "#ffffff" : "var(--text)",
                  borderTopLeftRadius: m.remetente === "ia" ? 4 : 16,
                  borderTopRightRadius: m.remetente === "usuario" ? 4 : 16,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.texto}
              </div>

              {m.remetente === "usuario" && (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--soft)",
                    color: "var(--text)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: 12, alignItems: "center", color: "var(--muted)", fontSize: 13 }}>
              <Bot size={18} />
              <span>O Assistente IA está analisando sua pergunta...</span>
            </div>
          )}
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleEnviar} style={{ display: "flex", gap: 10 }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Ex: Qual o preço sugerido para um Volvo FH 540 Globetrotter 2021 em bom estado?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px 18px",
              borderRadius: 12,
              border: "1px solid var(--line)",
              background: "var(--surface)",
              color: "var(--text)",
              fontSize: 14,
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="admin-btn admin-btn-approve"
            style={{
              padding: "0 24px",
              borderRadius: 12,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <Send size={16} /> Enviar
          </button>
        </form>

      </div>
    </AdminLayout>
  );
}
