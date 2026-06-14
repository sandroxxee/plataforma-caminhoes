"use client";

import { useState } from "react";
import { Bell, Trash2, CheckCircle, AlertCircle } from "lucide-react";

type Alerta = {
  id: string;
  marca: string | null;
  ano_min: number | null;
  ano_max: number | null;
  preco_max: number | null;
  estado: string | null;
  termo: string | null;
  ativo: boolean;
  created_at: string;
};

export function AlertasClient({ alertas: inicial }: { alertas: Alerta[] }) {
  const [alertas, setAlertas] = useState(inicial);
  const [removendo, setRemovendo] = useState<string | null>(null);

  async function remover(id: string) {
    setRemovendo(id);
    await fetch(`/api/salvar-busca?id=${id}`, { method: "DELETE" });
    setAlertas((prev) => prev.filter((a) => a.id !== id));
    setRemovendo(null);
  }

  if (alertas.length === 0) {
    return (
      <div className="alertas-empty">
        <Bell size={40} strokeWidth={1.4} />
        <strong>Nenhum alerta criado</strong>
        <p>Use os filtros em <a href="/anuncios">/anuncios</a> e clique em "Criar alerta" para ser avisado quando aparecer um caminhão novo.</p>

        <style>{`
          .alertas-empty {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; gap: 12px; padding: 60px 20px;
            color: #6b7280; text-align: center;
          }
          .alertas-empty strong { color: #e8eaed; font-size: 18px; }
          .alertas-empty p { font-size: 14px; line-height: 1.6; max-width: 340px; margin: 0; }
          .alertas-empty a { color: #93c5fd; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="alertas-list">
      {alertas.map((a) => (
        <div key={a.id} className="alerta-card">
          <div className="alerta-icon">
            {a.ativo ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          </div>

          <div className="alerta-body">
            <div className="alerta-tags">
              {a.marca   && <span className="alerta-tag">{a.marca}</span>}
              {a.estado  && <span className="alerta-tag">{a.estado}</span>}
              {a.ano_min && a.ano_max && <span className="alerta-tag">{a.ano_min}–{a.ano_max}</span>}
              {a.preco_max && (
                <span className="alerta-tag">até R${a.preco_max.toLocaleString("pt-BR")}</span>
              )}
              {a.termo   && <span className="alerta-tag">"{a.termo}"</span>}
            </div>
            <small className="alerta-data">
              Criado em {new Date(a.created_at).toLocaleDateString("pt-BR")}
            </small>
          </div>

          <button
            className="alerta-remove"
            onClick={() => remover(a.id)}
            disabled={removendo === a.id}
            aria-label="Remover alerta"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}

      <style>{`
        .alertas-list { display: grid; gap: 10px; }
        .alerta-card {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px;
          background: #1f2327;
          border: 1px solid #343a40;
          border-radius: 14px;
        }
        .alerta-icon { color: #4ade80; flex-shrink: 0; }
        .alerta-body { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .alerta-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .alerta-tag {
          background: #15181b; border: 1px solid #343a40;
          border-radius: 20px; padding: 3px 10px;
          font-size: 12px; font-weight: 700; color: #93c5fd;
        }
        .alerta-data { color: #6b7280; font-size: 11px; }
        .alerta-remove {
          background: transparent; border: none;
          color: #6b7280; cursor: pointer; padding: 6px;
          border-radius: 8px; display: flex;
          transition: color 0.15s, background 0.15s;
        }
        .alerta-remove:hover { color: #f87171; background: rgba(248,113,113,.1); }
        .alerta-remove:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
