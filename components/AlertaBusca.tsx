"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

const MARCAS = ["Mercedes-Benz", "Scania", "Volvo", "Volkswagen", "Ford", "Iveco", "DAF"];
const ESTADOS = [
  { label: "Qualquer estado", value: "" },
  { label: "SC", value: "SC" }, { label: "PR", value: "PR" }, { label: "RS", value: "RS" },
  { label: "SP", value: "SP" }, { label: "MG", value: "MG" }, { label: "RJ", value: "RJ" },
  { label: "BA", value: "BA" }, { label: "GO", value: "GO" }, { label: "MS", value: "MS" },
];

type Props = { marcaInicial?: string; estadoInicial?: string };

export function AlertaBusca({ marcaInicial = "", estadoInicial = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [marca, setMarca] = useState(marcaInicial);
  const [estado, setEstado] = useState(estadoInicial);
  const [precoMax, setPrecoMax] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const r = await fetch("/api/alerta-busca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, marca: marca || undefined, estado: estado || undefined, preco_max: precoMax ? Number(precoMax) : undefined }),
      });
      const d = await r.json();
      setMsg(d.msg || d.error || "Alerta criado!");
      if (d.ok) { setEmail(""); setTimeout(() => setOpen(false), 2200); }
    } catch { setMsg("Erro de conexão."); }
    setLoading(false);
  }

  return (
    <>
      <button className="alerta-trigger" onClick={() => setOpen(true)} aria-label="Criar alerta">
        <Bell size={15} />
        <span>Alerta de busca</span>
      </button>

      {open && (
        <div className="alerta-overlay" role="dialog" aria-modal="true" aria-label="Criar alerta de busca">
          <div className="alerta-modal">
            <button className="alerta-close" onClick={() => setOpen(false)} aria-label="Fechar">×</button>
            <h2 className="alerta-title">🔔 Alerta de busca</h2>
            <p className="alerta-sub">Receba um email quando sair um caminhão novo com esses filtros.</p>

            <form onSubmit={submit} className="alerta-form">
              <label className="alerta-label">
                Email *
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="alerta-input" />
              </label>

              <div className="alerta-row">
                <label className="alerta-label">
                  Marca
                  <select value={marca} onChange={(e) => setMarca(e.target.value)} className="alerta-input">
                    <option value="">Qualquer marca</option>
                    {MARCAS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </label>
                <label className="alerta-label">
                  Estado
                  <select value={estado} onChange={(e) => setEstado(e.target.value)} className="alerta-input">
                    {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
                  </select>
                </label>
              </div>

              <label className="alerta-label">
                Preço máximo (R$)
                <input type="number" min="0" step="1000" value={precoMax} onChange={(e) => setPrecoMax(e.target.value)} placeholder="Ex: 300000" className="alerta-input" />
              </label>

              {msg && <p className={`alerta-msg ${msg.includes("rro") ? "error" : "ok"}`}>{msg}</p>}

              <button type="submit" disabled={loading} className="alerta-submit">
                {loading ? "Salvando..." : "🔔 Criar alerta"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .alerta-trigger { display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid var(--line);background:var(--soft);color:var(--muted);font-size:12px;font-weight:800;cursor:pointer;transition:.15s; }
        .alerta-trigger:hover { border-color:var(--blue);color:var(--blue); }
        .alerta-overlay { position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:900;display:flex;align-items:center;justify-content:center;padding:16px; }
        .alerta-modal { background:var(--surface);border-radius:20px;padding:28px;width:100%;max-width:440px;position:relative;box-shadow:var(--shadow3); }
        .alerta-close { position:absolute;top:14px;right:16px;background:none;border:0;font-size:22px;color:var(--muted);cursor:pointer;line-height:1; }
        .alerta-title { margin:0 0 4px;font-size:20px;font-weight:950;letter-spacing:-.03em; }
        .alerta-sub { margin:0 0 20px;color:var(--muted);font-size:13px;font-weight:700; }
        .alerta-form { display:flex;flex-direction:column;gap:14px; }
        .alerta-row { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
        .alerta-label { display:flex;flex-direction:column;gap:5px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;color:var(--muted); }
        .alerta-input { height:42px;border-radius:10px;border:1.5px solid var(--line);background:var(--soft);padding:0 12px;font-size:14px;font-weight:700;color:var(--text);outline:none;transition:.15s;width:100%;box-sizing:border-box; }
        .alerta-input:focus { border-color:var(--blue); }
        .alerta-msg { padding:10px 14px;border-radius:10px;font-size:13px;font-weight:800;margin:0; }
        .alerta-msg.ok { background:#dcfce7;color:#15803d; }
        .alerta-msg.error { background:#fee2e2;color:#dc2626; }
        .alerta-submit { height:48px;border-radius:12px;background:var(--blue);color:#fff;font-weight:950;font-size:15px;border:0;cursor:pointer;transition:.15s; }
        .alerta-submit:hover { opacity:.9; }
        .alerta-submit:disabled { opacity:.5;cursor:not-allowed; }
        @media(max-width:480px) { .alerta-row { grid-template-columns:1fr; } }
      `}</style>
    </>
  );
}
