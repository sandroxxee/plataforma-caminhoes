"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, Search, Truck, Container, Wrench, Bus, Tractor, Package, Star } from "lucide-react";
import { SalvarBusca } from "@/components/SalvarBusca";
import { MARCAS_VALIDAS } from "@/lib/constants";

type Categoria = { label: string; href: string; iconName: string };

const CATEGORIAS: Categoria[] = [
  { label: "Todos",       href: "/caminhoes",    iconName: "truck" },
  { label: "Caminhões",   href: "/caminhoes",    iconName: "truck" },
  { label: "Carretas",    href: "/carretas",     iconName: "container" },
  { label: "Implementos", href: "/implementos",  iconName: "wrench" },
  { label: "Ônibus",      href: "/onibus",               iconName: "bus" },
  { label: "Máquinas",    href: "/maquinas",     iconName: "tractor" },
  { label: "Peças",       href: "/pecas",        iconName: "package" },
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

const MARCAS_LOGOS: Record<string, string> = {
  "Mercedes-Benz": "/Gemini_Generated_Image_sdthoysdthoysdth__2_-removebg-preview.png",
  "Scania":        "/scania-removebg-preview.png",
  "Volvo":         "/volvo-removebg-preview.png",
  "Volkswagen":    "/volkswagen-removebg-preview.png",
  "Ford":          "/ford-removebg-preview.png",
  "Iveco":         "/iveco-removebg-preview.png",
  "DAF":           "/daf-removebg-preview.png",
  "MAN":           "",
  "Agrale":        "/agrale-removebg-preview.png",
  "Foton":         "/foton-removebg-preview.png",
};

const ESTADOS = [
  { label: "Todos", value: "" },
  { label: "SC", value: "SC" }, { label: "PR", value: "PR" },
  { label: "RS", value: "RS" }, { label: "SP", value: "SP" },
  { label: "MG", value: "MG" }, { label: "MS", value: "MS" },
  { label: "MT", value: "MT" }, { label: "GO", value: "GO" },
  { label: "BA", value: "BA" }, { label: "RJ", value: "RJ" },
  { label: "ES", value: "ES" }, { label: "PE", value: "PE" },
  { label: "CE", value: "CE" }, { label: "PA", value: "PA" },
  { label: "AM", value: "AM" },
];

const FAIXAS = [
  { label: "Todos os preços", min: 0, max: Infinity },
  { label: "Até R$100k",     min: 0,       max: 100_000 },
  { label: "R$100k–200k",   min: 100_000, max: 200_000 },
  { label: "R$200k–400k",   min: 200_000, max: 400_000 },
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
  return qs ? `/caminhoes?${qs}` : "/caminhoes";
}

type Props = {
  q: string; faixaIdx: number; marcaFiltro: string;
  estadoFiltro: string; hasFilters: boolean; total: number;
  categoriaAtiva?: string;
};

export function AnunciosFilters({ q, faixaIdx, marcaFiltro, estadoFiltro, hasFilters, total, categoriaAtiva = "anuncios" }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch]         = useState(q);
  const router                      = useRouter();
  const debounceRef                 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeCount = (faixaIdx > 0 ? 1 : 0) + (marcaFiltro ? 1 : 0) + (estadoFiltro ? 1 : 0) + (q ? 1 : 0);

  useEffect(() => { setSearch(q); }, [q]);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  function handleSearch(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.push(buildHref(value.trim(), faixaIdx, marcaFiltro, estadoFiltro, {}));
    }, 500);
  }

  const precoMaxAtivo = faixaIdx > 0 && FAIXAS[faixaIdx].max !== Infinity ? FAIXAS[faixaIdx].max : undefined;

  return (
    <>
      <style>{`
        .af-mobile-bar { display:none; gap:10px; align-items:center; margin-bottom:20px; }
        .af-desktop-bar { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:20px; flex-wrap:wrap; }
        .af-search-wrap { position:relative; display:flex; align-items:center; flex:1; max-width:520px; }
        .af-search-icon { position:absolute; left:16px; color:var(--muted); pointer-events:none; opacity: 0.6; }
        .af-search {
          width:100%; height:46px; padding:0 44px;
          border-radius:14px; border:1px solid rgba(148,163,184,0.15);
          background:#ffffff; color:var(--text); font-size:14px; font-weight:700;
          outline:none; transition:all .2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .af-search:focus { border-color:var(--blue); box-shadow: 0 4px 16px rgba(24,119,242,0.1); background:#fff; }
        .af-search::placeholder { color:var(--muted); font-weight:600; opacity: 0.5; }
        .af-search-clear { position:absolute; right:12px; width:24px; height:24px; border-radius:999px; border:none; background:var(--soft); color:var(--muted); cursor:pointer; display:flex; align-items:center; justify-content:center; transition: .2s; }
        .af-search-clear:hover { background: #e2e8f0; color: var(--text); }
        .af-count { margin:0; font-size:14px; font-weight:700; color:var(--muted); white-space:nowrap; }
        .af-count strong { color:var(--text); font-size:16px; font-weight:900; }
        .af-filtered { color:var(--blue); margin-left: 4px; }
        .af-clear-inline { display:inline-flex; align-items:center; gap:6px; margin-left:12px; height:32px; padding:0 12px; border-radius:999px; border:1px solid rgba(239,68,68,0.15); background:rgba(239,68,68,0.05); color:#ef4444; font-size:12px; font-weight:800; text-decoration:none; transition: .2s; }
        .af-clear-inline:hover { background: rgba(239,68,68,0.1); transform: translateY(-1px); }
        .af-drawer-btn {
          display:inline-flex; align-items:center; gap:8px; height:46px; padding:0 18px;
          border-radius:14px; border:1px solid rgba(148,163,184,0.15);
          background:#ffffff; color:var(--text); font-size:14px; font-weight:800;
          cursor:pointer; white-space:nowrap; transition: .2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .af-drawer-btn:hover { border-color: var(--blue); color: var(--blue); transform: translateY(-1px); }
        .af-badge { display:inline-flex; align-items:center; justify-content:center; min-width:20px; height:20px; border-radius:999px; background:var(--blue); color:#fff; font-size:11px; font-weight:900; padding:0 5px; }
        .af-overlay { position:fixed; inset:0; z-index:199; background:rgba(15,23,42,0.4); backdrop-filter:blur(4px); transition: opacity .3s; }
        .af-drawer {
          position:fixed; top:0; left:0; bottom:0; width:min(340px,85vw);
          z-index:200; background:#ffffff;
          border-right:1px solid rgba(148,163,184,0.1);
          box-shadow: 20px 0 60px rgba(0,0,0,0.08);
          transform:translateX(-100%); transition:transform .4s cubic-bezier(0.16, 1, 0.3, 1);
          display:flex; flex-direction:column; overflow:hidden;
        }
        .af-drawer.open { transform:translateX(0); }
        .af-drawer-head { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid rgba(148,163,184,0.08); flex-shrink:0; background: #fff; }
        .af-drawer-title { font-size:18px; font-weight:800; letter-spacing: -0.02em; color: var(--text); }
        .af-drawer-close { width:44px; height:44px; border-radius:14px; border:none; background:var(--soft); color:var(--text); display:flex; align-items:center; justify-content:center; cursor:pointer; transition: .2s; }
        .af-drawer-close:hover { background: #e2e8f0; transform: rotate(90deg); }
        .af-drawer-body { overflow-y:auto; flex:1; padding: 10px 0 40px; }
        .af-dsection { padding:20px 24px; }
        .af-ddiv { height:1px; background:rgba(148,163,184,0.06); margin: 0 24px; }
        .af-dlabel { margin:0 0 16px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.12em; color:var(--muted); opacity: 0.5; }
        .af-dlist { display:flex; flex-direction:column; gap:4px; }
        .af-ditem { display:flex; align-items:center; gap:12px; height:48px; padding:0 14px; border-radius:14px; font-size:15px; font-weight:700; color:var(--text); text-decoration:none; transition: all .2s; border: 1px solid transparent; }
        .af-ditem:hover { background:rgba(24,119,242,0.05); color:var(--blue); }
        .af-ditem.active { background:var(--blueSoft); color:var(--blue); font-weight:800; }
        .af-dprice { font-size:14px; }
        .af-dico { display:flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:10px; background:#fff; border: 1px solid rgba(148,163,184,0.1); color:var(--muted); flex-shrink:0; box-shadow: 0 2px 6px rgba(0,0,0,0.04); transition: all 0.2s; }
        .af-ditem.active .af-dico { background:var(--blue); color:#fff; border-color: var(--blue); transform: scale(1.05); box-shadow: 0 4px 12px rgba(24,119,242,0.3); }
        .af-logo { border-radius:8px; object-fit:contain; flex-shrink:0; background: #fff; padding: 3px; border: 1px solid rgba(148,163,184,0.08); }
        .af-chips { display:flex; gap:10px; flex-wrap:wrap; }
        .af-chip { display:inline-flex; align-items:center; height:36px; padding:0 16px; border-radius:12px; border:1px solid rgba(148,163,184,0.15); background:#fff; color:var(--muted); font-size:13px; font-weight:800; text-decoration:none; transition:.2s; }
        .af-chip:hover { border-color:var(--blue); color:var(--blue); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .af-chip.active { border-color:var(--blue); background:var(--blue); color:#fff; box-shadow: 0 8px 20px rgba(24,119,242,0.25); }
        .af-dclear { display:inline-flex; align-items:center; gap:10px; width: 100%; justify-content: center; height:50px; border-radius:16px; border:1px solid rgba(239,68,68,0.2); background:rgba(239,68,68,0.04); color:#ef4444; font-size:14px; font-weight:900; text-decoration:none; transition: all .2s; }
        .af-dclear:hover { background: rgba(239,68,68,0.08); transform: translateY(-1px); border-color: #ef4444; }
        @media(max-width:900px){ .af-mobile-bar{ display:flex; } .af-desktop-bar{ display:none; } }
      `}</style>

      {/* MOBILE BAR */}
      <div className="af-mobile-bar">
        <div className="af-search-wrap">
          <Search size={15} className="af-search-icon" />
          <input type="search" className="af-search" placeholder="Buscar..." value={search} onChange={(e) => handleSearch(e.target.value)} />
          {search && <button className="af-search-clear" onClick={() => handleSearch("")}><X size={13} /></button>}
        </div>
      </div>

      {/* DESKTOP BAR */}
      <div className="af-desktop-bar">
        <div className="af-search-wrap">
          <Search size={15} className="af-search-icon" />
          <input type="search" className="af-search" placeholder="Buscar por modelo, marca ou cidade..." value={search} onChange={(e) => handleSearch(e.target.value)} />
          {search && <button className="af-search-clear" onClick={() => handleSearch("")}><X size={13} /></button>}
        </div>
        {hasFilters && (
          <p className="af-count">
            <Link href="/caminhoes" className="af-clear-inline" style={{ marginLeft: 0 }}><X size={11} />Limpar filtros</Link>
          </p>
        )}
      </div>
    </>
  );
}
