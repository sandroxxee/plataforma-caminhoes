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
            <Link href={getUrl({ faixa: undefined })} className={`asb-item${faixaIdx === 0 ? " active" : ""}` }>
              Todos os preços
            </Link>
            {FAIXAS.map((f, idx) => (
              <Link key={idx} href={getUrl({ faixa: idx + 1 })} className={`asb-item${faixaIdx === idx + 1 ? " active" : ""}`}>
                {f.label}
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
    </aside>
  );
}
