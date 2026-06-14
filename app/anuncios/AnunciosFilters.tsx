"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, Search, Truck, Container, Wrench, Bus, Tractor, Package } from "lucide-react";
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

const MARCAS_LOGOS: Record<string, string> = {
  "Mercedes-Benz": "https://img.logo.dev/mercedes-benz.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=32&format=png",
  "Scania":        "https://img.logo.dev/scania.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=32&format=png",
  "Volvo":         "https://img.logo.dev/volvotrucks.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=32&format=png",
  "Volkswagen":    "https://img.logo.dev/vw.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=32&format=png",
  "Ford":          "https://img.logo.dev/ford.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=32&format=png",
  "Iveco":         "https://img.logo.dev/iveco.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=32&format=png",
  "DAF":           "https://img.logo.dev/daf.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=32&format=png",
  "MAN":           "https://img.logo.dev/man.eu?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=32&format=png",
  "Agrale":        "https://img.logo.dev/agrale.com.br?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=32&format=png",
};

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
      {/* MOBILE BAR */}
      <div className="af-mobile-bar">
        <div className="af-search-wrap">
          <Search size={15} className="af-search-icon" />
          <input type="search" className="af-search" placeholder="Buscar..." value={search} onChange={(e) => handleSearch(e.target.value)} />
          {search && <button className="af-search-clear" onClick={() => handleSearch("")}><X size={13} /></button>}
        </div>
        <button className="af-drawer-btn" onClick={() => setDrawerOpen(true)}>
          <SlidersHorizontal size={15} />Filtros
          {activeCount > 0 && <span className="af-badge">{activeCount}</span>}
        </button>
      </div>

      {/* DESKTOP BAR */}
      <div className="af-desktop-bar">
        <div className="af-search-wrap">
          <Search size={15} className="af-search-icon" />
          <input type="search" className="af-search" placeholder="Buscar por modelo, marca ou cidade..." value={search} onChange={(e) => handleSearch(e.target.value)} />
          {search && <button className="af-search-clear" onClick={() => handleSearch("")}><X size={13} /></button>}
        </div>
        <p className="af-count">
          <strong>{total}</strong> {total === 1 ? "an\u00fancio" : "an\u00fancios"}
          {hasFilters && <span className="af-filtered"> encontrados</span>}
          {hasFilters && <Link href="/anuncios" className="af-clear-inline"><X size={11} />Limpar</Link>}
        </p>
      </div>

      {/* DRAWER OVERLAY */}
      {drawerOpen && <div className="af-overlay" onClick={() => setDrawerOpen(false)} />}

      {/* DRAWER */}
      <div className={`af-drawer${drawerOpen ? " open" : ""}`}>
        <div className="af-drawer-head">
          <span className="af-drawer-title">Filtros</span>
          <button className="af-drawer-close" onClick={() => setDrawerOpen(false)}><X size={18} /></button>
        </div>
        <div className="af-drawer-body">

          <div className="af-dsection">
            <p className="af-dlabel">Categorias</p>
            <nav className="af-dlist">
              {CATEGORIAS.map((c) => {
                const slug   = c.href.replace("/", "");
                const active = slug === categoriaAtiva;
                return (
                  <Link key={c.href} href={c.href} className={`af-ditem${active ? " active" : ""}`} onClick={() => setDrawerOpen(false)}>
                    <span className="af-dico"><CatIcon name={c.iconName} /></span>{c.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="af-ddiv" />

          <div className="af-dsection">
            <p className="af-dlabel">Marcas</p>
            <nav className="af-dlist">
              <Link href={buildHref(q, faixaIdx, "", estadoFiltro, { marca: undefined })} className={`af-ditem${!marcaFiltro ? " active" : ""}`} onClick={() => setDrawerOpen(false)}>
                <span className="af-dico af-dico-star">&#9733;</span>Todas
              </Link>
              {MARCAS_VALIDAS.map((m) => (
                <Link key={m} href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { marca: m })} className={`af-ditem${marcaFiltro === m ? " active" : ""}`} onClick={() => setDrawerOpen(false)}>
                  {MARCAS_LOGOS[m]
                    ? <Image src={MARCAS_LOGOS[m]} alt={m} width={20} height={20} className="af-logo" unoptimized />
                    : <span className="af-dico">{m[0]}</span>
                  }
                  {m}
                </Link>
              ))}
            </nav>
          </div>

          <div className="af-ddiv" />

          <div className="af-dsection">
            <p className="af-dlabel">Estado</p>
            <div className="af-chips">
              {ESTADOS.map((e) => (
                <Link key={e.value || "t"} href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { estado: e.value || undefined })} className={`af-chip${estadoFiltro === e.value ? " active" : ""}`} onClick={() => setDrawerOpen(false)}>
                  {e.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="af-ddiv" />

          <div className="af-dsection">
            <p className="af-dlabel">Faixa de pre\u00e7o</p>
            <nav className="af-dlist">
              {FAIXAS.map((f, idx) => (
                <Link key={idx} href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { faixa: idx === 0 ? undefined : idx })} className={`af-ditem af-dprice${faixaIdx === idx ? " active" : ""}`} onClick={() => setDrawerOpen(false)}>
                  {f.label}
                </Link>
              ))}
            </nav>
          </div>

          {hasFilters && (
            <div className="af-dsection">
              <SalvarBusca marca={marcaFiltro || undefined} estado={estadoFiltro || undefined} precoMax={precoMaxAtivo} />
              <Link href="/anuncios" className="af-dclear" onClick={() => setDrawerOpen(false)}><X size={12} />Limpar filtros</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .af-mobile-bar { display:none; gap:8px; align-items:center; margin-bottom:16px; }
        .af-desktop-bar { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; flex-wrap:wrap; }
        .af-search-wrap { position:relative; display:flex; align-items:center; flex:1; max-width:480px; }
        .af-search-icon { position:absolute; left:13px; color:var(--muted); pointer-events:none; }
        .af-search { width:100%; height:42px; padding:0 38px 0 38px; border-radius:12px; border:1.5px solid var(--line); background:var(--surface); color:var(--text); font-size:14px; font-weight:700; outline:none; transition:border-color .15s; }
        .af-search:focus { border-color:var(--blue); }
        .af-search::placeholder { color:var(--muted); font-weight:600; }
        .af-search-clear { position:absolute; right:10px; width:22px; height:22px; border-radius:999px; border:none; background:var(--soft); color:var(--muted); cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .af-count { margin:0; font-size:14px; font-weight:700; color:var(--muted); white-space:nowrap; }
        .af-count strong { color:var(--text); font-size:16px; }
        .af-filtered { color:var(--blue); }
        .af-clear-inline { display:inline-flex; align-items:center; gap:4px; margin-left:10px; height:28px; padding:0 10px; border-radius:999px; border:1.5px solid rgba(239,68,68,.3); background:rgba(239,68,68,.07); color:#f87171; font-size:11px; font-weight:800; text-decoration:none; }
        .af-drawer-btn { display:inline-flex; align-items:center; gap:6px; height:42px; padding:0 14px; border-radius:12px; border:1.5px solid var(--line); background:var(--surface); color:var(--text); font-size:13px; font-weight:800; cursor:pointer; white-space:nowrap; }
        .af-badge { display:inline-flex; align-items:center; justify-content:center; min-width:18px; height:18px; border-radius:999px; background:var(--blue); color:#fff; font-size:11px; font-weight:900; padding:0 4px; }
        .af-overlay { position:fixed; inset:0; z-index:199; background:rgba(0,0,0,.45); backdrop-filter:blur(2px); }
        .af-drawer { position:fixed; top:0; left:0; bottom:0; width:min(320px,85vw); z-index:200; background:var(--surface); border-right:1px solid var(--line); box-shadow:var(--shadow3); transform:translateX(-100%); transition:transform .28s ease; display:flex; flex-direction:column; overflow:hidden; }
        .af-drawer.open { transform:translateX(0); }
        .af-drawer-head { display:flex; align-items:center; justify-content:space-between; padding:16px; border-bottom:1px solid var(--line); flex-shrink:0; }
        .af-drawer-title { font-size:16px; font-weight:900; }
        .af-drawer-close { width:36px; height:36px; border-radius:50%; border:none; background:var(--soft); color:var(--text); display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .af-drawer-body { overflow-y:auto; flex:1; }
        .af-dsection { padding:14px; }
        .af-ddiv { height:1px; background:var(--line); }
        .af-dlabel { margin:0 0 8px; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:.08em; color:var(--muted); }
        .af-dlist { display:flex; flex-direction:column; gap:1px; }
        .af-ditem { display:flex; align-items:center; gap:9px; height:36px; padding:0 8px; border-radius:9px; font-size:13px; font-weight:700; color:var(--text); text-decoration:none; transition:background .12s,color .12s; }
        .af-ditem:hover { background:var(--soft); color:var(--blue); }
        .af-ditem.active { background:var(--blueSoft); color:var(--blue); font-weight:900; }
        .af-dprice { font-size:12px; }
        .af-dico { display:flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:5px; background:var(--soft); color:var(--muted); font-size:11px; flex-shrink:0; }
        .af-dico-star { font-size:13px; }
        .af-ditem.active .af-dico { background:var(--blueSoft); color:var(--blue); }
        .af-logo { border-radius:4px; object-fit:contain; flex-shrink:0; }
        .af-chips { display:flex; gap:4px; flex-wrap:wrap; }
        .af-chip { display:inline-flex; align-items:center; height:26px; padding:0 9px; border-radius:999px; border:1.5px solid var(--line); background:var(--soft); color:var(--muted); font-size:11px; font-weight:800; text-decoration:none; transition:.12s; }
        .af-chip:hover { border-color:var(--blue); color:var(--blue); }
        .af-chip.active { border-color:var(--blue); background:var(--blueSoft); color:var(--blue); }
        .af-dclear { display:inline-flex; align-items:center; gap:5px; margin-top:8px; height:32px; padding:0 12px; border-radius:999px; border:1.5px solid rgba(239,68,68,.3); background:rgba(239,68,68,.07); color:#f87171; font-size:12px; font-weight:800; text-decoration:none; }
        @media(max-width:900px){ .af-mobile-bar{ display:flex; } .af-desktop-bar{ display:none; } }
      `}</style>
    </>
  );
}
