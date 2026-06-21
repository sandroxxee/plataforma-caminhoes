"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Truck, Container, Wrench, Bus, Tractor, Package, Filter, Globe } from "lucide-react";
import { SalvarBusca } from "@/components/SalvarBusca";

type SidebarProps = {
  q: string;
  faixaIdx: number;
  marcaFiltro: string;
  estadoFiltro: string;
  hasFilters: boolean;
  total: number;
  categoriaAtiva: string;
  precoMin?: number;
  precoMax?: number;
  marcasDisponiveis?: string[];
  estadosDisponiveis?: string[];
};

const CATEGORIAS = [
  { id: "anuncios",    label: "Todos",       icon: Truck },
  { id: "caminhoes",   label: "Caminhões",   icon: Truck },
  { id: "carretas",    label: "Carretas",    icon: Container },
  { id: "implementos", label: "Implementos", icon: Wrench },
  { id: "onibus",      label: "Ônibus",      icon: Bus },
  { id: "maquinas",    label: "Máquinas",    icon: Tractor },
  { id: "pecas",       label: "Peças",       icon: Package },
];

const PRECO_MAX_ABSOLUTO = 2_000_000;

function fmtPreco(v: number) {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
  return `R$ ${v}`;
}

export function AnunciosSidebar({
  q, faixaIdx, marcaFiltro, estadoFiltro, hasFilters,
  total, categoriaAtiva,
  precoMin = 0, precoMax = PRECO_MAX_ABSOLUTO,
  marcasDisponiveis = [],
  estadosDisponiveis = [],
}: SidebarProps) {
  const router = useRouter();
  const [sliderMin, setSliderMin] = useState(precoMin);
  const [sliderMax, setSliderMax] = useState(precoMax);

  const base = categoriaAtiva === "anuncios" ? "/comprar/caminhoes" : `/${categoriaAtiva}`;

  const getUrl = (params: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (marcaFiltro) sp.set("marca", marcaFiltro);
    if (estadoFiltro) sp.set("estado", estadoFiltro);
    if (sliderMin > 0) sp.set("pmin", String(sliderMin));
    if (sliderMax < PRECO_MAX_ABSOLUTO) sp.set("pmax", String(sliderMax));
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined) sp.delete(k);
      else sp.set(k, String(v));
    });
    const qs = sp.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const applySlider = () => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (marcaFiltro) sp.set("marca", marcaFiltro);
    if (estadoFiltro) sp.set("estado", estadoFiltro);
    if (sliderMin > 0) sp.set("pmin", String(sliderMin));
    if (sliderMax < PRECO_MAX_ABSOLUTO) sp.set("pmax", String(sliderMax));
    const qs = sp.toString();
    router.push(qs ? `${base}?${qs}` : base);
  };

  const pct = (v: number) => `${(v / PRECO_MAX_ABSOLUTO) * 100}%`;

  return (
    <>
      <style>{`
        .asb {
          display:flex; flex-direction:column; height:100%;
          background:#ffffff; border-radius:24px;
          border:1px solid rgba(148,163,184,0.12);
          box-shadow:0 8px 32px rgba(15,23,42,0.04);
          overflow:hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .asb:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 50px rgba(15,23,42,0.08);
        }
        .asb-header {
          padding:18px 20px;
          border-bottom:1px solid rgba(148,163,184,0.08);
          display:flex; align-items:center; justify-content:space-between;
          flex-shrink:0;
        }
        .asb-title {
          display:flex; align-items:center; gap:10px;
          font-weight:800; font-size:14px; color:var(--text);
          letter-spacing: -0.01em;
        }
        .asb-clear { font-size:12px; font-weight:700; color:var(--blue); text-decoration:none; transition: opacity 0.2s; }
        .asb-clear:hover { opacity: 0.7; }
        .asb-scroll { flex:1; overflow-y:auto; padding: 10px 0; }
        .asb-section { padding:16px 20px; border-bottom:1px solid rgba(148,163,184,0.06); }
        .asb-section:last-child { border-bottom: none; }
        .asb-label { display:block; font-size:11px; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; margin-bottom:12px; opacity: 0.6; }
        .asb-list { display:flex; flex-direction:column; gap:4px; }
        .asb-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:12px; font-size:14px; font-weight:600; color:var(--text); text-decoration:none; transition:all .2s; }
        .asb-item:hover { background:rgba(24,119,242,0.05); color:var(--blue); }
        .asb-item.active { background:var(--blueSoft); color:var(--blue); font-weight:800; }
        .asb-dot { width:5px; height:5px; border-radius:50%; background:var(--blue); margin-left:auto; flex-shrink:0; }
        .asb-chip-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .asb-chip-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
        .asb-chip {
          display:flex; align-items:center; justify-content:center;
          height:36px; border:1px solid rgba(148,163,184,0.15); border-radius:10px;
          font-size:12px; font-weight:700; color:var(--muted);
          text-decoration:none; transition:all .2s; text-align:center; padding:0 8px;
          background: #fafafa;
        }
        .asb-chip:hover, .asb-chip.active { border-color:var(--blue); color:var(--blue); background:var(--blueSoft); box-shadow: 0 4px 12px rgba(24,119,242,0.08); }
        .asb-chip-full { grid-column:1/-1; }
        .price-range-display { display:flex; justify-content:space-between; font-size:13px; font-weight:800; color:var(--blue); margin-bottom:16px; }
        .price-slider-wrap { position:relative; height:24px; margin-bottom:16px; }
        .price-slider-track { position:absolute; top:50%; transform:translateY(-50%); left:0; right:0; height:3px; background:rgba(148,163,184,0.15); border-radius:4px; }
        .price-slider-fill { position:absolute; top:50%; transform:translateY(-50%); height:3px; background:var(--blue); border-radius:4px; pointer-events:none; }
        .price-slider { position:absolute; width:100%; height:3px; -webkit-appearance:none; appearance:none; background:transparent; pointer-events:none; top:50%; transform:translateY(-50%); outline:none; }
        .price-slider::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:#fff; border:1px solid rgba(148,163,184,0.2); box-shadow:0 3px 8px rgba(0,0,0,0.12); pointer-events:all; cursor:pointer; transition: transform 0.15s; }
        .price-slider::-webkit-slider-thumb:hover { transform: scale(1.1); }
        .price-slider::-moz-range-thumb { width:20px; height:20px; border-radius:50%; background:#fff; border:1px solid rgba(148,163,184,0.2); box-shadow:0 3px 8px rgba(0,0,0,0.12); pointer-events:all; cursor:pointer; }
        .price-slider-min { z-index:3; } .price-slider-max { z-index:4; }
        .price-apply-btn { width:100%; height:40px; border-radius:12px; border:0; background:var(--blue); color:#fff; font-weight:800; font-size:13px; cursor:pointer; transition:all .2s; }
        .price-apply-btn:hover { background:var(--blue2); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(24,119,242,0.25); }
        .asb-footer { padding:16px 20px; border-top:1px solid rgba(148,163,184,0.08); background:#fff; flex-shrink:0; }
        .asb-empty { font-size:12px; color:var(--muted); font-weight:700; }
      `}</style>

      <aside className="asb">
        <div className="asb-header">
          <div className="asb-title"><Filter size={15} /><span>Filtros</span></div>
          {hasFilters && <Link href={base} className="asb-clear">Limpar</Link>}
        </div>

        <div className="asb-scroll">

          {/* CATEGORIA */}
          <section className="asb-section">
            <span className="asb-label">Categoria</span>
            <div className="asb-list">
              {CATEGORIAS.map((cat) => (
                <Link key={cat.id}
                  href={cat.id === "anuncios" ? "/comprar/caminhoes" : `/${cat.id}`}
                  className={`asb-item${categoriaAtiva === cat.id ? " active" : ""}`}>
                  <cat.icon size={14} />
                  <span>{cat.label}</span>
                  {categoriaAtiva === cat.id && <span className="asb-dot" />}
                </Link>
              ))}
            </div>
          </section>

          {/* PREÇO */}
          <section className="asb-section">
            <span className="asb-label">Faixa de Preço</span>
            <div className="price-range-display">
              <span>{fmtPreco(sliderMin)}</span>
              <span>{sliderMax >= PRECO_MAX_ABSOLUTO ? "Sem limite" : fmtPreco(sliderMax)}</span>
            </div>
            <div className="price-slider-wrap">
              <div className="price-slider-track" />
              <div className="price-slider-fill" style={{ left: pct(sliderMin), right: `${100 - (sliderMax / PRECO_MAX_ABSOLUTO) * 100}%` }} />
              <input type="range" min={0} max={PRECO_MAX_ABSOLUTO} step={10_000} value={sliderMin}
                className="price-slider price-slider-min"
                onChange={(e) => { const v = Number(e.target.value); if (v < sliderMax) setSliderMin(v); }} />
              <input type="range" min={0} max={PRECO_MAX_ABSOLUTO} step={10_000} value={sliderMax}
                className="price-slider price-slider-max"
                onChange={(e) => { const v = Number(e.target.value); if (v > sliderMin) setSliderMax(v); }} />
            </div>
            <button className="price-apply-btn" onClick={applySlider}>Aplicar</button>
          </section>

          {/* MARCA */}
          {marcasDisponiveis.length > 0 && (
            <section className="asb-section">
              <span className="asb-label">Marca</span>
              <div className="asb-chip-grid">
                <Link href={getUrl({ marca: undefined })} className={`asb-chip asb-chip-full${!marcaFiltro ? " active" : ""}`}>Todas</Link>
                {marcasDisponiveis.map((m) => (
                  <Link key={m} href={getUrl({ marca: m })} className={`asb-chip${marcaFiltro === m ? " active" : ""}`}>{m}</Link>
                ))}
              </div>
            </section>
          )}

          {/* ESTADO */}
          {estadosDisponiveis.length > 0 && (
            <section className="asb-section">
              <span className="asb-label">Estado</span>
              <div className="asb-chip-grid-3">
                <Link href={getUrl({ estado: undefined })} className={`asb-chip asb-chip-full${!estadoFiltro ? " active" : ""}`}>
                  <Globe size={13} style={{ marginRight: 6 }} /> Todos
                </Link>
                {estadosDisponiveis.map((uf) => (
                  <Link key={uf} href={getUrl({ estado: uf })} className={`asb-chip${estadoFiltro === uf ? " active" : ""}`}>
                  {uf}
                </Link>
                ))}
              </div>
            </section>
          )}

        </div>

        <div className="asb-footer">
          <SalvarBusca total={total} />
        </div>
      </aside>
    </>
  );
}
