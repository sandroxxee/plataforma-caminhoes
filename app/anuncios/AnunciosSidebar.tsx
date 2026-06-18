"use client";

import Link from "next/link";
import Image from "next/image";
import { Truck, Container, Wrench, Bus, Tractor, Package, X, MapPin, Tag, Filter, ChevronRight } from "lucide-react";
import { SalvarBusca } from "@/components/SalvarBusca";
import { MARCAS_VALIDAS } from "@/lib/constants";

type Categoria = { label: string; href: string; iconName: string };

const CATEGORIAS: Categoria[] = [
  { label: "Todos os Anúncios", href: "/anuncios",    iconName: "truck" },
  { label: "Caminhões",       href: "/caminhoes",   iconName: "truck" },
  { label: "Carretas",        href: "/carretas",    iconName: "container" },
  { label: "Implementos",     href: "/implementos", iconName: "wrench" },
  { label: "Ônibus",          href: "/onibus",      iconName: "bus" },
  { label: "Máquinas",        href: "/maquinas",    iconName: "tractor" },
  { label: "Peças",           href: "/pecas",       iconName: "package" },
];

function CatIcon({ name }: { name: string }) {
  const s = 18;
  if (name === "container") return <Container size={s} />;
  if (name === "wrench")    return <Wrench size={s} />;
  if (name === "bus")       return <Bus size={s} />;
  if (name === "tractor")   return <Tractor size={s} />;
  if (name === "package")   return <Package size={s} />;
  return <Truck size={s} />;
}

// URLs reais para garantir que os ícones apareçam enquanto você não sobe os seus 3D
const MARCAS_SVG: Record<string, string> = {
  "Mercedes-Benz": "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
  "Scania":        "https://upload.wikimedia.org/wikipedia/commons/2/24/Scania_logo.svg",
  "Volvo":         "https://upload.wikimedia.org/wikipedia/commons/5/58/Volvo-PB.svg",
  "Volkswagen":    "https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg",
  "Ford":          "https://upload.wikimedia.org/wikipedia/commons/a/a0/Ford_Motor_Company_Logo.svg",
  "Iveco":         "https://upload.wikimedia.org/wikipedia/commons/4/45/Iveco_Logo.svg",
  "DAF":           "https://upload.wikimedia.org/wikipedia/commons/2/21/DAF_Logo.svg",
  "MAN":           "https://upload.wikimedia.org/wikipedia/commons/8/89/MAN_Logo.svg",
  "Agrale":        "https://upload.wikimedia.org/wikipedia/commons/a/a9/Agrale_logo.png",
};

function MarcaIcon({ marca }: { marca: string }) {
  const src = MARCAS_SVG[marca];
  if (src) {
    return (
      <div className="brand-icon-wrap">
        <img src={src} alt={marca} className="asb-logo-img" loading="lazy" />
      </div>
    );
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
    <aside className="asb-root">
      <div className="asb-sticky-wrap">
        <div className="asb-header">
          <Filter size={20} className="text-blue-500" />
          <span>Filtros Avançados</span>
        </div>

        <div className="asb-scroll-area">
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
                    {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="asb-section">
            <p className="asb-label">Marcas Populares</p>
            <nav className="asb-list-grid">
              <Link href={buildHref(q, faixaIdx, "", estadoFiltro, { marca: undefined })} className={`asb-brand-item${!marcaFiltro ? " active" : ""}`}>
                <span className="asb-brand-name">Todas</span>
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
            <p className="asb-label"><MapPin size={14} /> Localização</p>
            <div className="asb-chips">
              {ESTADOS.map((e) => (
                <Link key={e.value || "t"} href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { estado: e.value || undefined })} className={`asb-chip${estadoFiltro === e.value ? " active" : ""}`}>
                  {e.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="asb-section">
            <p className="asb-label"><Tag size={14} /> Faixa de Preço</p>
            <nav className="asb-list">
              {FAIXAS.map((f, idx) => (
                <Link key={idx} href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { faixa: idx === 0 ? undefined : idx })} className={`asb-item${faixaIdx === idx ? " active" : ""}`}>
                  <span className="asb-text">{f.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {hasFilters && (
          <div className="asb-footer">
            <SalvarBusca marca={marcaFiltro || undefined} estado={estadoFiltro || undefined} precoMax={precoMaxAtivo} />
            <Link href="/anuncios" className="asb-clear">
              <X size={16} /> Limpar Filtros
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .asb-root {
          width: 320px;
          flex-shrink: 0;
        }
        .asb-sticky-wrap {
          position: sticky;
          top: 100px;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: var(--shadow);
          max-height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
        }
        .asb-header {
          padding: 24px;
          background: var(--soft);
          border-bottom: 1px solid var(--line);
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 950;
          font-size: 16px;
          color: var(--text);
          letter-spacing: -0.02em;
        }
        .asb-scroll-area {
          overflow-y: auto;
          flex: 1;
        }
        .asb-scroll-area::-webkit-scrollbar { width: 4px; }
        .asb-scroll-area::-webkit-scrollbar-thumb { background: var(--line); border-radius: 10px; }
        
        .asb-section {
          padding: 24px;
          border-bottom: 1px solid var(--line);
        }
        .asb-section:last-child { border-bottom: none; }
        
        .asb-label {
          margin: 0 0 16px;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .asb-list { display: flex; flex-direction: column; gap: 6px; }
        .asb-item {
          display: flex;
          align-items: center;
          gap: 14px;
          height: 48px;
          padding: 0 16px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 750;
          color: var(--text);
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .asb-item:hover { background: var(--soft); color: var(--blue); transform: translateX(4px); }
        .asb-item.active { background: var(--blueSoft); color: var(--blue); font-weight: 900; }
        
        .asb-ico {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: var(--soft);
          color: var(--muted);
          transition: all 0.2s;
        }
        .asb-item.active .asb-ico { background: white; color: var(--blue); box-shadow: 0 4px 12px rgba(37,99,235,0.15); }
        
        .asb-list-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .asb-brand-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 8px;
          border-radius: 16px;
          border: 1.5px solid var(--line);
          background: var(--bg);
          text-decoration: none;
          transition: all 0.2s;
        }
        .asb-brand-item:hover { border-color: var(--blue); background: var(--blueSoft); transform: translateY(-2px); }
        .asb-brand-item.active { border-color: var(--blue); background: var(--blueSoft); box-shadow: 0 4px 12px rgba(37,99,235,0.08); }
        
        .brand-icon-wrap {
          width: 40px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .asb-logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: grayscale(1) opacity(0.7);
          transition: all 0.2s;
        }
        .asb-brand-item:hover .asb-logo-img, .asb-brand-item.active .asb-logo-img {
          filter: grayscale(0) opacity(1);
        }
        
        .asb-brand-name { font-size: 11px; font-weight: 800; color: var(--muted); text-align: center; }
        .asb-brand-item.active .asb-brand-name { color: var(--blue); font-weight: 900; }

        .asb-chips { display: flex; gap: 8px; flex-wrap: wrap; }
        .asb-chip {
          display: inline-flex;
          align-items: center;
          height: 32px;
          padding: 0 14px;
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
          padding: 24px;
          background: var(--soft);
          border-top: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .asb-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 48px;
          border-radius: 14px;
          border: 1.5px solid #fecaca;
          background: #fff;
          color: #ef4444;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
          transition: all 0.2s;
        }
        .asb-clear:hover { background: #fef2f2; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(239,68,68,0.1); }

        @media (max-width: 1024px) {
          .asb-root { width: 280px; }
        }
        @media (max-width: 900px) {
          .asb-root { display: none; }
        }
      `}</style>
    </aside>
  );
}
