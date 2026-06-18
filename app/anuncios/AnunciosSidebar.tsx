"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Truck, Container, Wrench, Bus, Tractor, Package, Filter, ChevronRight } from "lucide-react";
import { SalvarBusca } from "@/components/SalvarBusca";
import { MARCAS_VALIDAS } from "@/lib/constants";

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
};

const ESTADOS = ["SC","PR","RS","SP","MG","MS","MT","GO","BA","RJ","ES","PE","CE","PA","AM"];

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
  if (v >= 1_000_000) return `R$ ${(v/1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `R$ ${(v/1_000).toFixed(0)}k`;
  return `R$ ${v}`;
}

export function AnunciosSidebar({ q, faixaIdx, marcaFiltro, estadoFiltro, hasFilters, total, categoriaAtiva, precoMin = 0, precoMax = PRECO_MAX_ABSOLUTO }: SidebarProps) {
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

  return (
    <aside className="asb">
      <div className="asb-header">
        <div className="asb-title"><Filter size={16} /><span>Filtros</span></div>
        {hasFilters && <Link href={base} className="asb-clear">Limpar tudo</Link>}
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
                <cat.icon size={15} />
                <span>{cat.label}</span>
                {categoriaAtiva === cat.id && <span className="asb-dot" />}
              </Link>
            ))}
          </div>
        </section>

        {/* FAIXA DE PREÇO — SLIDER */}
        <section className="asb-section">
          <span className="asb-label">Faixa de Preço</span>
          <div className="price-range-display">
            <span>{fmtPreco(sliderMin)}</span>
            <span>{sliderMax >= PRECO_MAX_ABSOLUTO ? "Sem limite" : fmtPreco(sliderMax)}</span>
          </div>
          <div className="price-slider-wrap">
            <input
              type="range"
              min={0}
              max={PRECO_MAX_ABSOLUTO}
              step={10_000}
              value={sliderMin}
              className="price-slider price-slider-min"
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v < sliderMax) setSliderMin(v);
              }}
            />
            <input
              type="range"
              min={0}
              max={PRECO_MAX_ABSOLUTO}
              step={10_000}
              value={sliderMax}
              className="price-slider price-slider-max"
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v > sliderMin) setSliderMax(v);
              }}
            />
            <div
              className="price-track-fill"
              style={{
                left: `${(sliderMin / PRECO_MAX_ABSOLUTO) * 100}%`,
                right: `${100 - (sliderMax / PRECO_MAX_ABSOLUTO) * 100}%`,
              }}
            />
          </div>
          <button className="price-apply-btn" onClick={applySlider}>Aplicar faixa</button>
        </section>

        {/* MARCA */}
        <section className="asb-section">
          <span className="asb-label">Marca</span>
          <div className="asb-brands-grid">
            <Link href={getUrl({ marca: undefined })} className={`asb-brand${!marcaFiltro ? " active" : ""}`}>Todas</Link>
            {MARCAS_VALIDAS.slice(0, 14).map((m) => (
              <Link key={m} href={getUrl({ marca: m })} className={`asb-brand${marcaFiltro === m ? " active" : ""}`}>{m}</Link>
            ))}
          </div>
        </section>

        {/* ESTADO */}
        <section className="asb-section">
          <span className="asb-label">Estado</span>
          <div className="asb-list">
            <Link href={getUrl({ estado: undefined })} className={`asb-item${!estadoFiltro ? " active" : ""}`}>Brasil (Todos)</Link>
            {ESTADOS.map((uf) => (
              <Link key={uf} href={getUrl({ estado: uf })} className={`asb-item${estadoFiltro === uf ? " active" : ""}`}>
                <span>{uf}</span>
                <ChevronRight size={13} className="asb-chevron" />
              </Link>
            ))}
          </div>
        </section>

      </div>

      <div className="asb-footer">
        <SalvarBusca total={total} />
      </div>

      <style jsx>{`
        .asb { display:flex; flex-direction:column; height:100%; background:var(--surface); border-radius:var(--radius); border:1.5px solid var(--line); box-shadow:var(--shadow); overflow:hidden; }
        .asb-header { padding:16px 18px; border-bottom:1px solid var(--line); background:var(--soft); display:flex; align-items:center; justify-content:space-between; flex-shrink:0; }
        .asb-title { display:flex; align-items:center; gap:8px; font-weight:900; font-size:14px; color:var(--text); }
        .asb-clear { font-size:12px; font-weight:800; color:var(--blue); text-decoration:none; }
        .asb-clear:hover { text-decoration:underline; }
        .asb-scroll { flex:1; overflow-y:auto; }
        .asb-section { padding:16px 18px; border-bottom:1px solid var(--line); }
        .asb-label { display:block; font-size:10px; font-weight:900; color:var(--muted); text-transform:uppercase; letter-spacing:.09em; margin-bottom:10px; }
        .asb-list { display:flex; flex-direction:column; gap:2px; }
        .asb-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:10px; font-size:13px; font-weight:700; color:var(--text); text-decoration:none; transition:all .15s; }
        .asb-item:hover { background:var(--soft); color:var(--blue); }
        .asb-item.active { background:var(--blueSoft); color:var(--blue); font-weight:900; }
        .asb-dot { width:7px; height:7px; border-radius:50%; background:var(--blue); margin-left:auto; flex-shrink:0; }
        .asb-chevron { margin-left:auto; opacity:.3; }
        .asb-brands-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
        .asb-brand { display:flex; align-items:center; justify-content:center; height:34px; border:1.5px solid var(--line); border-radius:9px; font-size:11px; font-weight:800; color:var(--muted); text-decoration:none; transition:all .15s; text-align:center; }
        .asb-brand:hover, .asb-brand.active { border-color:var(--blue); color:var(--blue); background:var(--blueSoft); }
        .asb-footer { padding:14px 18px; border-top:1px solid var(--line); background:var(--soft); flex-shrink:0; }

        /* SLIDER */
        .price-range-display { display:flex; justify-content:space-between; font-size:13px; font-weight:900; color:var(--blue); margin-bottom:14px; }
        .price-slider-wrap { position:relative; height:20px; margin-bottom:14px; }
        .price-slider {
          position:absolute; width:100%; height:4px;
          -webkit-appearance:none; appearance:none;
          background:transparent; pointer-events:none; top:50%; transform:translateY(-50%);
          outline:none;
        }
        .price-slider::-webkit-slider-thumb {
          -webkit-appearance:none; appearance:none;
          width:20px; height:20px; border-radius:50%;
          background:var(--blue); border:3px solid var(--surface);
          box-shadow:0 2px 8px rgba(0,0,0,.2);
          pointer-events:all; cursor:pointer;
        }
        .price-slider::-moz-range-thumb {
          width:20px; height:20px; border-radius:50%;
          background:var(--blue); border:3px solid var(--surface);
          box-shadow:0 2px 8px rgba(0,0,0,.2);
          pointer-events:all; cursor:pointer;
        }
        .price-track-fill {
          position:absolute; top:50%; transform:translateY(-50%);
          height:4px; background:var(--blue); border-radius:4px;
          pointer-events:none;
        }
        /* track base */
        .price-slider-min { z-index:3; }
        .price-slider-max { z-index:4; }
        .price-slider-wrap::before {
          content:''; position:absolute; top:50%; transform:translateY(-50%);
          left:0; right:0; height:4px;
          background:var(--line); border-radius:4px;
        }
        .price-apply-btn {
          width:100%; height:38px; border-radius:10px; border:0;
          background:var(--blue); color:#fff; font-weight:900; font-size:13px;
          cursor:pointer; transition:background .14s;
        }
        .price-apply-btn:hover { background:var(--blue2); }
      `}</style>
    </aside>
  );
}
