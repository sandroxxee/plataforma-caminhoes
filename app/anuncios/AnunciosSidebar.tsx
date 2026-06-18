"use client";

import Link from "next/link";
import { Truck, Container, Wrench, Bus, Tractor, Package, Filter, ChevronRight } from "lucide-react";
import { SalvarBusca } from "@/components/SalvarBusca";
import { MARCAS_VALIDAS, FAIXAS } from "@/lib/constants";

type SidebarProps = {
  q: string;
  faixaIdx: number;
  marcaFiltro: string;
  estadoFiltro: string;
  hasFilters: boolean;
  total: number;
  categoriaAtiva: string;
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

const fmt = (n: number) =>
  n === Infinity ? "" : `R$ ${(n / 1000).toFixed(0)}k`;

const faixaLabel = (f: { min: number; max: number }, idx: number) => {
  if (idx === 0) return "Até R$ 100k";
  if (f.max === Infinity) return `Acima de ${fmt(f.min)}`;
  return `${fmt(f.min)} – ${fmt(f.max)}`;
};

export function AnunciosSidebar({ q, faixaIdx, marcaFiltro, estadoFiltro, hasFilters, total, categoriaAtiva }: SidebarProps) {
  const getUrl = (params: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (faixaIdx > 0) sp.set("faixa", String(faixaIdx));
    if (marcaFiltro) sp.set("marca", marcaFiltro);
    if (estadoFiltro) sp.set("estado", estadoFiltro);
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined) sp.delete(k);
      else sp.set(k, String(v));
    });
    const base = categoriaAtiva === "anuncios" ? "/anuncios" : `/${categoriaAtiva}`;
    return `${base}?${sp.toString()}`;
  };

  return (
    <aside className="asb">
      <div className="asb-header">
        <div className="asb-title"><Filter size={16} /><span>Filtros</span></div>
        {hasFilters && (
          <Link href={categoriaAtiva === "anuncios" ? "/anuncios" : `/${categoriaAtiva}`} className="asb-clear">Limpar</Link>
        )}
      </div>

      <div className="asb-scroll">
        <section className="asb-section">
          <span className="asb-label">Categoria</span>
          <div className="asb-list">
            {CATEGORIAS.map((cat) => (
              <Link key={cat.id} href={cat.id === "anuncios" ? "/anuncios" : `/${cat.id}`}
                className={`asb-item${categoriaAtiva === cat.id ? " active" : ""}`}>
                <cat.icon size={15} />
                <span>{cat.label}</span>
                {categoriaAtiva === cat.id && <span className="asb-dot" />}
              </Link>
            ))}
          </div>
        </section>

        <section className="asb-section">
          <span className="asb-label">Faixa de Preço</span>
          <div className="asb-list">
            <Link href={getUrl({ faixa: undefined })} className={`asb-item${faixaIdx === 0 ? " active" : ""}`}>
              Todos os preços
            </Link>
            {FAIXAS.slice(1).map((f, idx) => (
              <Link key={idx} href={getUrl({ faixa: idx + 1 })} className={`asb-item${faixaIdx === idx + 1 ? " active" : ""}`}>
                {faixaLabel(f, idx)}
              </Link>
            ))}
          </div>
        </section>

        <section className="asb-section">
          <span className="asb-label">Marca</span>
          <div className="asb-brands-grid">
            <Link href={getUrl({ marca: undefined })} className={`asb-brand${!marcaFiltro ? " active" : ""}`}>Todas</Link>
            {MARCAS_VALIDAS.slice(0, 14).map((m) => (
              <Link key={m} href={getUrl({ marca: m })} className={`asb-brand${marcaFiltro === m ? " active" : ""}`}>{m}</Link>
            ))}
          </div>
        </section>

        <section className="asb-section">
          <span className="asb-label">Estado</span>
          <div className="asb-list">
            <Link href={getUrl({ estado: undefined })} className={`asb-item${!estadoFiltro ? " active" : ""}`}>
              Brasil (Todos)
            </Link>
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
        .asb { display: flex; flex-direction: column; height: 100%; background: var(--surface); border-radius: var(--radius); border: 1.5px solid var(--line); box-shadow: var(--shadow); overflow: hidden; }
        .asb-header { padding: 16px 18px; border-bottom: 1px solid var(--line); background: var(--soft); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .asb-title { display: flex; align-items: center; gap: 8px; font-weight: 900; font-size: 14px; color: var(--text); }
        .asb-clear { font-size: 12px; font-weight: 800; color: var(--blue); text-decoration: none; }
        .asb-scroll { flex: 1; overflow-y: auto; }
        .asb-section { padding: 16px 18px; border-bottom: 1px solid var(--line); }
        .asb-label { display: block; font-size: 10px; font-weight: 900; color: var(--muted); text-transform: uppercase; letter-spacing: .09em; margin-bottom: 10px; }
        .asb-list { display: flex; flex-direction: column; gap: 2px; }
        .asb-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 10px; font-size: 13px; font-weight: 700; color: var(--text); text-decoration: none; transition: all .15s; }
        .asb-item:hover { background: var(--soft); color: var(--blue); }
        .asb-item.active { background: var(--blueSoft); color: var(--blue); font-weight: 900; }
        .asb-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--blue); margin-left: auto; flex-shrink: 0; }
        .asb-chevron { margin-left: auto; opacity: .3; }
        .asb-brands-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .asb-brand { display: flex; align-items: center; justify-content: center; height: 34px; border: 1.5px solid var(--line); border-radius: 9px; font-size: 11px; font-weight: 800; color: var(--muted); text-decoration: none; transition: all .15s; }
        .asb-brand:hover, .asb-brand.active { border-color: var(--blue); color: var(--blue); background: var(--blueSoft); }
        .asb-footer { padding: 14px 18px; border-top: 1px solid var(--line); background: var(--soft); flex-shrink: 0; }
      `}</style>
    </aside>
  );
}
