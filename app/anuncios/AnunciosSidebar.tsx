"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Truck, Container, Wrench, Bus, Tractor, Package, Filter } from "lucide-react";
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

  const base = categoriaAtiva === "anuncios" ? "/anuncios" : `/${categoriaAtiva}`;

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
        .asb { display:flex; flex-direction:column; height:100%; background:var(--surface); border-radius:var(--radius); border:1.5px solid var(--line); box-shadow:var(--shadow); overflow:hidden; }
        .asb-header { padding:14px 16px; border-bottom:1px solid var(--line); background:var(--soft); display:flex; align-items:center; justify-content:space-between; flex-shrink:0; }
        .asb-title { display:flex; align-items:center; gap:8px; font-weight:900; font-size:13px; color:var(--text); }
        .asb-clear { font-size:12px; font-weight:800; color:var(--blue); text-decoration:none; }
        .asb-clear:hover { text-decoration:underline; }
        .asb-scroll { flex:1; overflow-y:auto; }
        .asb-section { padding:14px 16px; border-bottom:1px solid var(--line); }
        .asb-label { display:block; font-size:10px; font-weight:900; color:var(--muted); text-transform:uppercase; letter-spacing:.09em; margin-bottom:8px; }
        .asb-list { display:flex; flex-direction:column; gap:1px; }
        .asb-item { display:flex; align-items:center; gap:9px; padding:8px 10px; border-radius:9px; font-size:13px; font-weight:700; color:var(--text); text-decoration:none; transition:all .15s; }
        .asb-item:hover { background:var(--soft); color:var(--blue); }
        .asb-item.active { background:var(--blueSoft); color:var(--blue); font-weight:900; }
        .asb-dot { width:6px; height:6px; border-radius:50%; background:var(--blue); margin-left:auto; flex-shrink:0; }
        .asb-chip-grid { display:grid; grid-template-columns:1fr 1fr; gap:5px; }
        .asb-chip-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:5px; }
        .asb-chip {
          display:flex; align-items:center; justify-content:center;
          height:32px; border:1.5px solid var(--line); border-radius:8px;
          font-size:11px; font-weight:800; color:var(--muted);
          text-decoration:none; transition:all .15s; text-align:center; padding:0 4px;
        }
        .asb-chip:hover, .asb-chip.active { border-color:var(--blue); color:var(--blue); background:var(--blueSoft); }
        .asb-chip-full { grid-column:1/-1; font-size:12px; }
        .price-range-display { display:flex; justify-content:space-between; font-size:12px; font-weight:900; color:var(--blue); margin-bottom:12px; }
        .price-slider-wrap { position:relative; height:20px; margin-bottom:12px; }
        .price-slider-track { position:absolute; top:50%; transform:translateY(-50%); left:0; right:0; height:4px; background:var(--line); border-radius:4px; }
        .price-slider-fill { position:absolute; top:50%; transform:translateY(-50%); height:4px; background:var(--blue); border-radius:4px; pointer-events:none; }
        .price-slider { position:absolute; width:100%; height:4px; -webkit-appearance:none; appearance:none; background:transparent; pointer-events:none; top:50%; transform:translateY(-50%); outline:none; }
        .price-slider::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:var(--blue); border:3px solid var(--surface); box-shadow:0 1px 6px rgba(0,0,0,.2); pointer-events:all; cursor:pointer; }
        .price-slider::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:var(--blue); border:3px solid var(--surface); box-shadow:0 1px 6px rgba(0,0,0,.2); pointer-events:all; cursor:pointer; }
        .price-slider-min { z-index:3; } .price-slider-max { z-index:4; }
        .price-apply-btn { width:100%; height:36px; border-radius:9px; border:0; background:var(--blue); color:#fff; font-weight:900; font-size:12px; cursor:pointer; transition:opacity .14s; }
        .price-apply-btn:hover { opacity:.85; }
        .asb-footer { padding:12px 16px; border-top:1px solid var(--line); background:var(--soft); flex-shrink:0; }
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
                  href={cat.id === "anuncios" ? "/anuncios" : `/${cat.id}`}
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
                  🇧🇷 Todos
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
