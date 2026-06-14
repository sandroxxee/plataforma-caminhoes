"use client";

import { useState } from "react";
import { Bell, BellOff, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  marca?: string;
  anoMin?: number;
  anoMax?: number;
  precoMax?: number;
  estado?: string;
  termoBusca?: string;
};

export function SalvarBusca({ marca, anoMin, anoMax, precoMax, estado, termoBusca }: Props) {
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState("");

  const temFiltro = !!(marca || anoMin || anoMax || precoMax || estado || termoBusca);

  async function salvarBusca() {
    setSalvando(true);
    setErro("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setErro("Faça login para salvar a busca.");
      setSalvando(false);
      return;
    }

    const { error } = await supabase.from("saved_searches").insert({
      user_id: user.id,
      marca: marca ?? null,
      ano_min: anoMin ?? null,
      ano_max: anoMax ?? null,
      preco_max: precoMax ?? null,
      estado: estado ?? null,
      termo: termoBusca ?? null,
    });

    if (error) {
      setErro("Erro ao salvar. Tente novamente.");
    } else {
      setSalvo(true);
      setTimeout(() => setSalvo(false), 4000);
    }
    setSalvando(false);
  }

  if (!temFiltro) return null;

  return (
    <div className="salvar-busca">
      {salvo ? (
        <div className="salvo-ok">
          <CheckCircle size={15} />
          <span>Alerta criado! Você receberá e-mail quando aparecer algo novo.</span>
        </div>
      ) : (
        <>
          <div className="salvar-info">
            <Bell size={15} />
            <span>
              Salvar alerta:
              {marca && <strong> {marca}</strong>}
              {anoMin && anoMax && <strong> {anoMin}–{anoMax}</strong>}
              {precoMax && <strong> até R${precoMax.toLocaleString("pt-BR")}</strong>}
              {estado && <strong> {estado}</strong>}
            </span>
          </div>
          {erro && <span className="salvar-erro">{erro}</span>}
          <button onClick={salvarBusca} disabled={salvando} className="salvar-btn">
            {salvando ? <Loader2 size={14} className="spin" /> : <BellOff size={14} />}
            {salvando ? "Salvando..." : "Criar alerta"}
          </button>
        </>
      )}

      <style>{`
        .salvar-busca {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #1a2535;
          border: 1.5px solid #2563eb33;
          border-radius: 10px;
          flex-wrap: wrap;
        }
        .salvar-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #93c5fd;
          flex: 1;
        }
        .salvar-info strong { color: #fff; }
        .salvar-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s;
        }
        .salvar-btn:hover:not(:disabled) { background: #1d4ed8; }
        .salvar-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .salvo-ok {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4ade80;
          font-size: 13px;
          font-weight: 600;
        }
        .salvar-erro { color: #f87171; font-size: 12px; }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
