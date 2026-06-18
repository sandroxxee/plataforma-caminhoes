"use client";

import Link from "next/link";
import Image from "next/image";
import { Truck, Container, Wrench, Bus, Tractor, Package, X, MapPin, Tag, Filter } from "lucide-react";
import { SalvarBusca } from "@/components/SalvarBusca";
import { MARCAS_VALIDAS } from "@/lib/constants";

type Categoria = { label: string; href: string; iconName: string };

const CATEGORIAS: Categoria[] = [
  { label: "Todos",       href: "/anuncios",    iconName: "truck" },
  { label: "Caminhões",   href: "/caminhoes",   iconName: "truck" },
  { label: "Carretas",    href: "/carretas",    iconName: "container" },
  { label: "Implementos", href: "/implementos", iconName: "wrench" },
  { label: "Ônibus",      href: "/onibus",      iconName: "bus" },
  { label: "Máquinas",    href: "/maquinas",    iconName: "tractor" },
  { label: "Peças",       href: "/pecas",       iconName: "package" },
];

function CatIcon({ name }: { name: string }) {
  const s = 16;
  if (name === "container") return <Container size={s} />;
  if (name === "wrench")    return <Wrench size={s} />;
  if (name === "bus")       return <Bus size={s} />;
  if (name === "tractor")   return <Tractor size={s} />;
  if (name === "package")   return <Package size={s} />;
  return <Truck size={s} />;
}

const MARCAS_SVG: Record<string, string> = {
  "Mercedes-Benz": "/marcas/mercedes-benz.svg",
  "Scania":        "/marcas/scania.svg",
  "Volvo":         "/marcas/volvo.svg",
  "Volkswagen":    "/marcas/volkswagen.svg",
  "Ford":          "/marcas/ford.svg",
  "Iveco":         "/marcas/iveco.svg",
  "DAF":           "/marcas/daf.svg",
  "MAN":           "/marcas/man.svg",
  "Agrale":        "/marcas/agrale.svg",
};

function MarcaIcon({ marca }: { marca: string }) {
  const src = MARCAS_SVG[marca];
  if (src) {
    return <Image src={src} alt={marca} width={20} height={20} className="asb-logo" unoptimized />;
  }
  return <span className="asb-ico-text">{marca[0]}</span>;
}

const ESTADOS = [
  { label: "Todos", value: "" },
  { label: "SC", value: "SC" }, { label: "PR", value: "PR" },
  { label: "RS", value: "RS" }, { label: "SP", value: "SP" },
  { label: "MG", value: "MG" }, { label: "MS", value: "MS" },
  { label: "MT", value: "MT" }, { label: "GO", value: "GO" },
  { label: "BA", value: "BA" }, { label: "RJ", value: "RJ" },
];

const FAIXAS = [
  { label: "Todos os preços", min: 0, max: Infinity },
  { label: "Até R$ 100k",     min: 0,       max: 100_000 },
  { label: "R$ 100k – 200k",   min: 100_000, max: 200_000 },
  { label: "R$ 200k – 400k",   min: 200_000, max: 400_000 },
  { label: "Acima de R$ 400k",  min: 400_000, max: Infinity },
];

function buildHref(q: string, faixaIdx: number, marcaFiltro: string, estadoFiltro: string, overrides: Record<string, string | number | undefined>) {
  const params: Record<string, string> = {};
  if (q)            params.q      = q;
  if (faixaIdx > 0) params.faixa  = String(faixaIdx);
  if (marcaFiltro)  params.marca  = marcaFiltro;
  if (estadoFiltro) params.estado = estadoFiltro;
  Object.entries(overrides).forEach(([k, v]) => {
    if (v === undefined || v === "" || v === 0) delete params[k];
    else params[k] = String(v);
  });
  const qs = new URLSearchParams(params).toString();
  return qs ? `/anuncios?${qs}` : "/anuncios";
}

type Props = {
  q: string; faixaIdx: number; marcaFiltro: string;
  estadoFiltro: string; hasFilters: boolean; total: number;
  categoriaAtiva?: string;
};

export function AnunciosSidebar({ q, faixaIdx, marcaFiltro, estadoFiltro, hasFilters, categoriaAtiva = "anuncios" }: Props) {
  const precoMaxAtivo = faixaIdx > 0 && FAIXAS[faixaIdx].max !== Infinity ? FAIXAS[faixaIdx].max : undefined;

  return (
    <div className="asb-root">
      <div className="asb-header">
        <Filter size={18} />
        <span>Filtros</span>
      </div>

      <div className="asb-section">
        <p className="asb-label">Categorias</p>
        <nav className="asb-list">
          {CATEGORIAS.map((c) => {
            const slug   = c.href.replace("/", "");
            const active = slug === categoriaAtiva;
            return (
              <Link key={c.href} href={c.href} className={`asb-item${active ? " active" : ""}`}>
                <span className="asb-ico"><CatIcon name={c.iconName} /></span>
                <span className="asb-text">{c.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="asb-section">
        <p className="asb-label">Marcas Populares</p>
        <nav className="asb-list-grid">
          <Link href={buildHref(q, faixaIdx, "", estadoFiltro, { marca: undefined })} className={`asb-brand-item${!marcaFiltro ? " active" : ""}`}>
            Todas
          </Link>
          {MARCAS_VALIDAS.slice(0, 12).map((m) => (
            <Link key={m} href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { marca: m })} className={`asb-brand-item${marcaFiltro === m ? " active" : ""}`}>
              <MarcaIcon marca={m} />
              <span className="asb-brand-name">{m}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="asb-section">
        <p className="asb-label"><MapPin size={12} /> Localização</p>
        <div className="asb-chips">
          {ESTADOS.map((e) => (
            <Link key={e.value || "t"} href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { estado: e.value || undefined })} className={`asb-chip${estadoFiltro === e.value ? " active" : ""}`}>
              {e.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="asb-section">
        <p className="asb-label"><Tag size={12} /> Preço</p>
        <nav className="asb-list">
          {FAIXAS.map((f, idx) => (
            <Link key={idx} href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { faixa: idx === 0 ? undefined : idx })} className={`asb-item${faixaIdx === idx ? " active" : ""}`}>
              <span className="asb-text">{f.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {hasFilters && (
        <div className="asb-footer">
          <SalvarBusca marca={marcaFiltro || undefined} estado={estadoFiltro || undefined} precoMax={precoMaxAtivo} />
          <Link href="/anuncios" className="asb-clear">
            <X size={14} /> Limpar Filtros
          </Link>
        </div>
      )}

      <style jsx>{`
        .asb-root {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow);
        }
        .asb-header {
          padding: 20px;
          background: var(--soft);
          border-bottom: 1px solid var(--line);
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 900;
          font-size: 15px;
          color: var(--text);
        }
        .asb-section {
          padding: 20px;
          border-bottom: 1px solid var(--line);
        }
        .asb-section:last-child { border-bottom: none; }
        .asb-label {
          margin: 0 0 14px;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .asb-list { display: flex; flex-direction: column; gap: 4px; }
        .asb-item {
          display: flex;
          align-items: center;
          gap: 12px;
          height: 42px;
          padding: 0 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
          text-decoration: none;
          transition: all 0.2s;
        }
        .asb-item:hover { background: var(--soft); color: var(--blue); }
        .asb-item.active { background: var(--blueSoft); color: var(--blue); }
        
        .asb-ico {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--soft);
          color: var(--muted);
          transition: all 0.2s;
        }
        .asb-item.active .asb-ico { background: white; color: var(--blue); box-shadow: 0 2px 8px rgba(37,99,235,0.1); }
        
        .asb-list-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .asb-brand-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 4px;
          border-radius: 12px;
          border: 1.5px solid var(--line);
          text-decoration: none;
          transition: all 0.2s;
        }
        .asb-brand-item:hover { border-color: var(--blue); background: var(--blueSoft); }
        .asb-brand-item.active { border-color: var(--blue); background: var(--blueSoft); }
        .asb-brand-name { font-size: 11px; font-weight: 800; color: var(--muted); text-align: center; }
        .asb-brand-item.active .asb-brand-name { color: var(--blue); }
        .asb-ico-text { font-size: 14px; font-weight: 900; color: var(--muted); }

        .asb-chips { display: flex; gap: 6px; flex-wrap: wrap; }
        .asb-chip {
          display: inline-flex;
          align-items: center;
          height: 30px;
          padding: 0 12px;
          border-radius: 99px;
          border: 1.5px solid var(--line);
          background: var(--bg);
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.2s;
        }
        .asb-chip:hover { border-color: var(--blue); color: var(--blue); }
        .asb-chip.active { border-color: var(--blue); background: var(--blue); color: white; }

        .asb-footer {
          padding: 20px;
          background: var(--soft);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .asb-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 42px;
          border-radius: 12px;
          border: 1.5px solid #fecaca;
          background: #fff;
          color: #ef4444;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          transition: all 0.2s;
        }
        .asb-clear:hover { background: #fef2f2; transform: translateY(-1px); }
      `}</style>
    </div>
  );
}
