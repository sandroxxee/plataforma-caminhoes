"use client";

import Link from "next/link";
import Image from "next/image";
import { Truck, Container, Wrench, Bus, Tractor, Package, X } from "lucide-react";
import { SalvarBusca } from "@/components/SalvarBusca";
import { MARCAS_VALIDAS } from "@/lib/constants";

type Categoria = { label: string; href: string; iconName: string };

const CATEGORIAS: Categoria[] = [
  { label: "Todos",       href: "/anuncios",    iconName: "truck" },
  { label: "Caminh\u00f5es",   href: "/caminhoes",   iconName: "truck" },
  { label: "Carretas",    href: "/carretas",    iconName: "container" },
  { label: "Implementos", href: "/implementos", iconName: "wrench" },
  { label: "\u00d4nibus",      href: "/onibus",      iconName: "bus" },
  { label: "M\u00e1quinas",    href: "/maquinas",    iconName: "tractor" },
  { label: "Pe\u00e7as",       href: "/pecas",       iconName: "package" },
];

function CatIcon({ name }: { name: string }) {
  const s = 15;
  if (name === "container") return <Container size={s} />;
  if (name === "wrench")    return <Wrench size={s} />;
  if (name === "bus")       return <Bus size={s} />;
  if (name === "tractor")   return <Tractor size={s} />;
  if (name === "package")   return <Package size={s} />;
  return <Truck size={s} />;
}

// Mapa marca -> arquivo SVG local em /public/marcas/
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
    return <Image src={src} alt={marca} width={24} height={24} className="asb-logo" unoptimized />;
  }
  return (
    <span className="asb-ico">{marca[0]}</span>
  );
}

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
  { label: "Todos os pre\u00e7os", min: 0, max: Infinity },
  { label: "At\u00e9 R$100k",     min: 0,       max: 100_000 },
  { label: "R$100k\u2013200k",   min: 100_000, max: 200_000 },
  { label: "R$200k\u2013400k",   min: 200_000, max: 400_000 },
  { label: "Acima R$400k",  min: 400_000, max: Infinity },
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
      <div className="asb-section">
        <p className="asb-label">Categorias</p>
        <nav className="asb-list">
          {CATEGORIAS.map((c) => {
            const slug   = c.href.replace("/", "");
            const active = slug === categoriaAtiva;
            return (
              <Link key={c.href} href={c.href} className={`asb-item${active ? " active" : ""}`}>
                <span className="asb-ico"><CatIcon name={c.iconName} /></span>
                {c.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="asb-div" />

      <div className="asb-section">
        <p className="asb-label">Marcas</p>
        <nav className="asb-list">
          <Link href={buildHref(q, faixaIdx, "", estadoFiltro, { marca: undefined })} className={`asb-item${!marcaFiltro ? " active" : ""}`}>
            <span className="asb-ico asb-ico-star">&#9733;</span>Todas
          </Link>
          {MARCAS_VALIDAS.map((m) => (
            <Link key={m} href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { marca: m })} className={`asb-item${marcaFiltro === m ? " active" : ""}`}>
              <MarcaIcon marca={m} />
              {m}
            </Link>
          ))}
        </nav>
      </div>

      <div className="asb-div" />

      <div className="asb-section">
        <p className="asb-label">Estado</p>
        <div className="asb-chips">
          {ESTADOS.map((e) => (
            <Link key={e.value || "t"} href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { estado: e.value || undefined })} className={`asb-chip${estadoFiltro === e.value ? " active" : ""}`}>
              {e.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="asb-div" />

      <div className="asb-section">
        <p className="asb-label">Faixa de pre\u00e7o</p>
        <nav className="asb-list">
          {FAIXAS.map((f, idx) => (
            <Link key={idx} href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { faixa: idx === 0 ? undefined : idx })} className={`asb-item asb-price${faixaIdx === idx ? " active" : ""}`}>
              {f.label}
            </Link>
          ))}
        </nav>
      </div>

      {hasFilters && (
        <>
          <div className="asb-div" />
          <div className="asb-section">
            <SalvarBusca marca={marcaFiltro || undefined} estado={estadoFiltro || undefined} precoMax={precoMaxAtivo} />
            <Link href="/anuncios" className="asb-clear"><X size={12} />Limpar filtros</Link>
          </div>
        </>
      )}

      <style>{`
        .asb-root { display:flex; flex-direction:column; }
        .asb-section { padding:14px; }
        .asb-div { height:1px; background:var(--line); }
        .asb-label { margin:0 0 8px; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:.08em; color:var(--muted); }
        .asb-list { display:flex; flex-direction:column; gap:1px; }
        .asb-item { display:flex; align-items:center; gap:9px; height:36px; padding:0 8px; border-radius:9px; font-size:13px; font-weight:700; color:var(--text); text-decoration:none; transition:background .12s,color .12s; }
        .asb-item:hover { background:var(--soft); color:var(--blue); }
        .asb-item.active { background:var(--blueSoft); color:var(--blue); font-weight:900; }
        .asb-price { font-size:12px; }
        .asb-ico { display:flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:5px; background:var(--soft); color:var(--muted); font-size:11px; flex-shrink:0; }
        .asb-ico-star { font-size:13px; }
        .asb-item.active .asb-ico { background:var(--blueSoft); color:var(--blue); }
        .asb-logo { border-radius:4px; object-fit:contain; flex-shrink:0; }
        .asb-chips { display:flex; gap:4px; flex-wrap:wrap; }
        .asb-chip { display:inline-flex; align-items:center; height:26px; padding:0 9px; border-radius:999px; border:1.5px solid var(--line); background:var(--soft); color:var(--muted); font-size:11px; font-weight:800; text-decoration:none; transition:.12s; }
        .asb-chip:hover { border-color:var(--blue); color:var(--blue); }
        .asb-chip.active { border-color:var(--blue); background:var(--blueSoft); color:var(--blue); }
        .asb-clear { display:inline-flex; align-items:center; gap:5px; margin-top:8px; height:32px; padding:0 12px; border-radius:999px; border:1.5px solid rgba(239,68,68,.3); background:rgba(239,68,68,.07); color:#f87171; font-size:12px; font-weight:800; text-decoration:none; transition:.14s; }
        .asb-clear:hover { background:rgba(239,68,68,.14); }
      `}</style>
    </div>
  );
}
