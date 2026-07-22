"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, DollarSign } from "lucide-react";

interface IaPriceAdvisorProps {
  marca: string;
  modelo?: string;
  ano?: number | string;
  quilometragem?: number | string;
  precoPretendido?: number | string;
}

export function IaPriceAdvisor({ marca, modelo, ano, quilometragem, precoPretendido }: IaPriceAdvisorProps) {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  const handleAnalisar = async () => {
    if (!marca || !ano) return;
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/preco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marca,
          modelo,
          ano,
          quilometragem,
          preco_pretendido: precoPretendido,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResultado(data);
      }
    } catch (e) {
      // Ignorar erros
    } finally {
      setLoading(false);
    }
  };

  const money = (val: number) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="admin-card" style={{ padding: 20, border: "1px solid var(--blueSoft)", background: "var(--surface)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--blueSoft)", color: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={16} />
          </div>
          <strong style={{ fontSize: 14, color: "var(--text)" }}>Avaliação de Preço com IA Gemini</strong>
        </div>

        <button
          type="button"
          onClick={handleAnalisar}
          disabled={loading || !marca || !ano}
          className="admin-btn admin-btn-approve"
          style={{ padding: "6px 14px", fontSize: 12, borderRadius: 8, cursor: "pointer" }}
        >
          {loading ? "Analisando..." : "Analisar Preço"}
        </button>
      </div>

      {resultado ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, padding: 12, borderRadius: 8, background: "var(--bg)", textAlign: "center" }}>
              <span style={{ fontSize: 11, color: "var(--muted)", display: "block" }}>Preço Mínimo</span>
              <strong style={{ fontSize: 14, color: "var(--text)" }}>{money(resultado.faixa_recomendada.minimo)}</strong>
            </div>

            <div style={{ flex: 1, padding: 12, borderRadius: 8, background: "var(--blueSoft)", textAlign: "center" }}>
              <span style={{ fontSize: 11, color: "var(--blue)", display: "block", fontWeight: 700 }}>Média de Mercado</span>
              <strong style={{ fontSize: 15, color: "var(--blue)", fontWeight: 900 }}>{money(resultado.faixa_recomendada.medio)}</strong>
            </div>

            <div style={{ flex: 1, padding: 12, borderRadius: 8, background: "var(--bg)", textAlign: "center" }}>
              <span style={{ fontSize: 11, color: "var(--muted)", display: "block" }}>Preço Máximo</span>
              <strong style={{ fontSize: 14, color: "var(--text)" }}>{money(resultado.faixa_recomendada.maximo)}</strong>
            </div>
          </div>

          <div style={{ fontSize: 13, color: "var(--text)", background: "var(--soft)", padding: 12, borderRadius: 8, lineHeight: 1.5 }}>
            <strong style={{ display: "block", color: "var(--blue)", marginBottom: 4 }}>💡 Recomendação Comercial:</strong>
            {resultado.analise_ia}
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
          Clique em "Analisar Preço" para receber estimativas de mercado e sugestão de preço competitivo baseadas na IA.
        </p>
      )}
    </div>
  );
}
