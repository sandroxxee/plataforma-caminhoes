"use client";

import { useState, useEffect } from "react";
import { useBuscaPlaca, DadosPlaca } from "@/hooks/useBuscaPlaca";

type Props = {
  onPreenchido: (dados: Partial<DadosPlaca & { estado: string; cidade: string }>) => void;
};

function formatarPlaca(valor: string): string {
  const limpo = valor.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
  if (limpo.length > 3) return limpo.slice(0, 3) + "-" + limpo.slice(3);
  return limpo;
}

export function BuscaPlacaInput({ onPreenchido }: Props) {
  const [placa, setPlaca] = useState("");
  const { estado, buscar, resetar } = useBuscaPlaca();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatado = formatarPlaca(e.target.value);
    setPlaca(formatado);
    resetar();
  }

  function handleBuscar() {
    const placaSemHifen = placa.replace("-", "");
    buscar(placaSemHifen);
  }

  useEffect(() => {
    if (estado.status === "sucesso") {
      onPreenchido({
        marca: estado.dados.marca,
        modelo: estado.dados.modelo,
        ano: String(estado.dados.ano),
        cidade: estado.dados.municipio,
        estado: estado.dados.uf,
      });
    }
  }, [estado, onPreenchido]);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f3e8ff, #ede9fe)",
        border: "2px solid #c084fc",
        borderRadius: "12px",
        padding: "1.25rem 1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <p style={{ fontWeight: 700, color: "#7c3aed", marginBottom: "0.25rem" }}>
        🔍 Buscar dados pela placa
      </p>
      <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.85rem" }}>
        Digite a placa e clique em preencher — marca, modelo, ano e estado serão preenchidos automaticamente.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        <input
          type="text"
          value={placa}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleBuscar())}
          placeholder="ABC-1234"
          maxLength={8}
          style={{
            padding: "0.65rem 1rem",
            borderRadius: "8px",
            border: "1px solid #c084fc",
            fontSize: "1.1rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            width: "160px",
            background: "#fff",
          }}
        />

        <button
          type="button"
          onClick={handleBuscar}
          disabled={placa.replace("-", "").length < 7 || estado.status === "carregando"}
          style={{
            background: estado.status === "carregando" ? "#a78bfa" : "#7c3aed",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.65rem 1.25rem",
            fontWeight: 700,
            cursor: estado.status === "carregando" ? "not-allowed" : "pointer",
            fontSize: "0.95rem",
            transition: "background 0.2s",
          }}
        >
          {estado.status === "carregando" ? "⏳ Buscando..." : "✨ Preencher com IA"}
        </button>
      </div>

      {estado.status === "sucesso" && (
        <div style={{ marginTop: "0.85rem", color: "#16a34a", fontWeight: 600, fontSize: "0.95rem" }}>
          ✅ Preenchido: {estado.dados.marca} {estado.dados.modelo} — {estado.dados.ano} — {estado.dados.uf}
        </div>
      )}

      {estado.status === "erro" && (
        <div style={{ marginTop: "0.85rem", color: "#dc2626", fontWeight: 500, fontSize: "0.9rem" }}>
          ❌ {estado.mensagem}
        </div>
      )}
    </div>
  );
}
