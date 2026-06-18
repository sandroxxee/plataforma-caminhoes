"use client";

import Link from "next/link";
import { Truck, Container, Wrench, Bus, Tractor, Package, X, MapPin, Tag, Filter, ChevronRight } from "lucide-react";
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
};

const ESTADOS = ["SC","PR","RS","SP","MG","MS","MT","GO","BA","RJ","ES","PE","CE","PA","AM"];

const CATEGORIAS = [
  { id: "anuncios", label: "Todos", icon: Truck },
  { id: "caminhoes", label: "Caminhões", icon: Truck },
  { id: "carretas", label: "Carretas", icon: Container },
  { id: "implementos", label: "Implementos", icon: Wrench },
  { id: "onibus", label: "Ônibus", icon: Bus },
  { id: "maquinas", label: "Máquinas", icon: Tractor },
  { id: "pecas", label: "Peças", icon: Package },
];

export function AnunciosSidebar({ q, faixaIdx, marcaFiltro, estadoFiltro, hasFilters, total, categoriaAtiva }: SidebarProps) {
  const getUrl = (params: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams();
    if (q) searchParams.set("q", q);
    if (faixaIdx > 0) searchParams.set("faixa", String(faixaIdx));
    if (marcaFiltro) searchParams.set("marca", marcaFiltro);
    if (estadoFiltro) searchParams.set("estado", estadoFiltro);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) searchParams.delete(key);
      else searchParams.set(key, String(value));
    });
    
    const base = categoriaAtiva === "anuncios" ? "/anuncios" : `/${categoriaAtiva}`;
    return `${base}?${searchParams.toString()}`;
  };

  return (
    <div className="asb">
      <div className="asb-header">
        <div className="asb-title">
          <Filter size={18} />
          <span>Filtros</span>
        </div>
        {hasFilters && (
          <Link href={categoriaAtiva === "anuncios" ? "/anuncios" : `/${categoriaAtiva}`} className="asb-clear">
            Limpar
          </Link>
        )}
      </div>

      <div className="asb-content">
        <section className="asb-section">
          <label>Categorias</label>
          <div className="asb-list">
            {CATEGORIAS.map((cat) => (
              <Link 
                key={cat.id} 
                href={cat.id === "anuncios" ? "/anuncios" : `/${cat.id}`}
                className={`asb-item ${categoriaAtiva === cat.id ? "active" : ""}`}
              >
                <cat.icon size={16} />
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="asb-section">
          <label>Marcas Populares</label>
          <div className="asb-brands-grid">
            <Link 
              href={getUrl({ marca: undefined })}
              className={`asb-brand-item ${!marcaFiltro ? "active" : ""}`}
            >
              Todas
            </Link>
            {MARCAS_VALIDAS.slice(0, 12).map((marca) => (
              <Link 
                key={marca}
                href={getUrl({ marca })}
                className={`asb-brand-item ${marcaFiltro === marca ? "active" : ""}`}
              >
                {marca}
              </Link>
            ))}
          </div>
        </section>

        <section className="asb-section">
          <label>Localização</label>
          <div className="asb-list asb-states">
            <Link 
              href={getUrl({ estado: undefined })}
              className={`asb-item ${!estadoFiltro ? "active" : ""}`}
            >
              Brasil (Todos)
            </Link>
            {ESTADOS.map((uf) => (
              <Link 
                key={uf}
                href={getUrl({ estado: uf })}
                className={`asb-item ${estadoFiltro === uf ? "active" : ""}`}
              >
                <span>{uf}</span>
                <ChevronRight size={14} className="asb-chevron" />
              </Link>
            ))}
          </div>
        </section>

        <div className="asb-footer">
          <SalvarBusca total={total} />
        </div>
      </div>

      <style jsx>{`
        .asb { display: flex; flex-direction: column; height: 100%; }
        .asb-header {
          padding: 20px;
          border-bottom: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--soft);
        }
        .asb-title { display: flex; align-items: center; gap: 10px; font-weight: 900; font-size: 15px; }
        .asb-clear { font-size: 12px; font-weight: 800; color: var(--blue); text-decoration: none; }
        
        .asb-content { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 28px; }
        
        .asb-section label {
          display: block;
          font-size: 11px;
          font-weight: 900;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }
        
        .asb-list { display: flex; flex-direction: column; gap: 4px; }
        .asb-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
          transition: all 0.2s;
          text-decoration: none;
        }
        .asb-item:hover { background: var(--soft); color: var(--blue); }
        .asb-item.active { background: var(--blueSoft); color: var(--blue); }
        .asb-chevron { margin-left: auto; opacity: 0.3; }
        
        .asb-brands-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .asb-brand-item {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          border: 1.5px solid var(--line);
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          color: var(--muted);
          transition: all 0.2s;
          text-align: center;
        }
        .asb-brand-item:hover, .asb-brand-item.active {
          border-color: var(--blue);
          color: var(--blue);
          background: var(--blueSoft);
        }
        
        .asb-footer { padding: 20px; border-top: 1px solid var(--line); background: var(--soft); }

        @media (max-width: 900px) {
          .asb { border-radius: 0; }
        }
      `}</style>
    </div>
  );
}
