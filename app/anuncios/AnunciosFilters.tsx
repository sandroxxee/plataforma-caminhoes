"use client";

import Link from "next/link";
import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

const ESTADOS = [
  { label: "Todos", value: "" },
  { label: "SC", value: "SC" }, { label: "PR", value: "PR" },
  { label: "RS", value: "RS" }, { label: "SP", value: "SP" },
  { label: "MG", value: "MG" }, { label: "MS", value: "MS" },
  { label: "MT", value: "MT" }, { label: "GO", value: "GO" },
  { label: "BA", value: "BA" }, { label: "RJ", value: "RJ" },
  { label: "ES", value: "ES" },
];

const FAIXAS = [
  { label: "Todos os preços", min: 0, max: Infinity },
  { label: "Até R$100k",      min: 0,       max: 100_000 },
  { label: "R$100k–200k",    min: 100_000, max: 200_000 },
  { label: "R$200k–400k",    min: 200_000, max: 400_000 },
  { label: "Acima R$400k",   min: 400_000, max: Infinity },
];

const MARCAS = ["Mercedes-Benz", "Scania", "Volvo", "Volkswagen", "Ford", "Iveco", "DAF"];

function buildHref(faixaIdx: number, marcaFiltro: string, estadoFiltro: string, overrides: Record<string, string | number | undefined>) {
  const params: Record<string, string> = {};
  if (faixaIdx > 0)  params.faixa  = String(faixaIdx);
  if (marcaFiltro)   params.marca  = marcaFiltro;
  if (estadoFiltro)  params.estado = estadoFiltro;
  Object.entries(overrides).forEach(([k, v]) => {
    if (v === undefined || v === "" || v === 0) delete params[k];
    else params[k] = String(v);
  });
  const qs = new URLSearchParams(params).toString();
  return qs ? `/anuncios?${qs}` : "/anuncios";
}

type Props = {
  faixaIdx:     number;
  marcaFiltro:  string;
  estadoFiltro: string;
  hasFilters:   boolean;
  total:        number;
};

export function AnunciosFilters({ faixaIdx, marcaFiltro, estadoFiltro, hasFilters, total }: Props) {
  const [open, setOpen] = useState(false);
  const activeCount = (faixaIdx > 0 ? 1 : 0) + (marcaFiltro ? 1 : 0) + (estadoFiltro ? 1 : 0);

  return (
    <div className="af-root">
      {/* Barra superior: resultado + botão */}
      <div className="af-topbar">
        <p className="af-count">
          <strong>{total}</strong> {total === 1 ? "anúncio" : "anúncios"}
          {hasFilters && <span className="af-filtered"> encontrados</span>}
        </p>

        <div className="af-topbar-right">
          {hasFilters && (
            <Link href="/anuncios" className="af-clear">
              <X size={13} strokeWidth={2.5} />
              Limpar
            </Link>
          )}
          <button
            className={`af-toggle${open ? " open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="af-panel"
          >
            <SlidersHorizontal size={15} strokeWidth={2} />
            Filtros
            {activeCount > 0 && <span className="af-badge">{activeCount}</span>}
            <ChevronDown size={14} strokeWidth={2} className="af-chevron" />
          </button>
        </div>
      </div>

      {/* Painel colapsável */}
      <div id="af-panel" className={`af-panel${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="af-panel-inner">

          <div className="af-group">
            <span className="af-group-label">Marca</span>
            <div className="af-row">
              {["Todas", ...MARCAS].map((m) => {
                const val    = m === "Todas" ? "" : m;
                const active = marcaFiltro === val;
                return (
                  <Link
                    key={m}
                    href={buildHref(faixaIdx, marcaFiltro, estadoFiltro, { marca: val || undefined })}
                    className={`af-btn${active ? " active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    {m}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="af-group">
            <span className="af-group-label">Estado</span>
            <div className="af-row">
              {ESTADOS.map((e) => {
                const active = estadoFiltro === e.value;
                return (
                  <Link
                    key={e.value || "todos"}
                    href={buildHref(faixaIdx, marcaFiltro, estadoFiltro, { estado: e.value || undefined })}
                    className={`af-btn${active ? " active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    {e.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="af-group">
            <span className="af-group-label">Preço</span>
            <div className="af-row">
              {FAIXAS.map((f, idx) => (
                <Link
                  key={idx}
                  href={buildHref(faixaIdx, marcaFiltro, estadoFiltro, { faixa: idx === 0 ? undefined : idx })}
                  className={`af-btn${faixaIdx === idx ? " active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .af-root { margin-bottom: 24px; }

        /* Topbar */
        .af-topbar {
          display: flex; align-items: center;
          justify-content: space-between; gap: 12px;
          padding: 10px 0;
        }
        .af-count {
          margin: 0; font-size: 14px; font-weight: 700; color: var(--muted);
        }
        .af-count strong { color: var(--text); font-size: 16px; }
        .af-filtered { color: var(--blue); }
        .af-topbar-right { display: flex; align-items: center; gap: 8px; }

        /* Botão limpar */
        .af-clear {
          display: inline-flex; align-items: center; gap: 5px;
          height: 34px; padding: 0 12px; border-radius: 999px;
          border: 1.5px solid rgba(239,68,68,.3);
          background: rgba(239,68,68,.07);
          color: #f87171; font-size: 12px; font-weight: 800;
          text-decoration: none; white-space: nowrap;
          transition: background .15s;
        }
        .af-clear:hover { background: rgba(239,68,68,.14); }

        /* Botão toggle */
        .af-toggle {
          display: inline-flex; align-items: center; gap: 7px;
          height: 38px; padding: 0 14px; border-radius: 12px;
          border: 1.5px solid var(--line);
          background: var(--soft); color: var(--text);
          font-size: 13px; font-weight: 800; cursor: pointer;
          transition: border-color .15s, background .15s, color .15s;
          white-space: nowrap;
        }
        .af-toggle:hover,
        .af-toggle.open {
          border-color: var(--blue);
          background: var(--blueSoft);
          color: var(--blue);
        }
        .af-badge {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 18px; height: 18px; border-radius: 999px;
          background: var(--blue); color: #fff;
          font-size: 11px; font-weight: 900; padding: 0 4px;
        }
        .af-chevron {
          transition: transform .2s;
        }
        .af-toggle.open .af-chevron { transform: rotate(180deg); }

        /* Painel */
        .af-panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows .25s ease;
          overflow: hidden;
        }
        .af-panel.open { grid-template-rows: 1fr; }
        .af-panel-inner {
          overflow: hidden;
          display: grid; gap: 16px;
          padding: 16px 18px 18px;
          background: var(--surface);
          border: 1.5px solid var(--line);
          border-radius: 16px;
          margin-top: 8px;
        }

        /* Grupos */
        .af-group { display: grid; gap: 8px; }
        .af-group-label {
          font-size: 11px; font-weight: 900;
          text-transform: uppercase; letter-spacing: .06em;
          color: var(--muted);
        }
        .af-row { display: flex; gap: 6px; flex-wrap: wrap; }
        .af-btn {
          display: inline-flex; align-items: center;
          height: 32px; padding: 0 13px; border-radius: 999px;
          border: 1.5px solid var(--line);
          background: var(--soft); color: var(--muted);
          font-size: 12px; font-weight: 800;
          text-decoration: none; white-space: nowrap;
          transition: border-color .14s, color .14s, background .14s;
        }
        .af-btn:hover  { border-color: var(--blue); color: var(--blue); }
        .af-btn.active {
          border-color: var(--blue);
          background: var(--blueSoft);
          color: var(--blue);
        }
      `}</style>
    </div>
  );
}
