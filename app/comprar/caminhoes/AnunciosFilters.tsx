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
  { label: "Todos",       href: "/comprar/caminhoes",    iconName: "truck" },
  { label: "Caminhões",   href: "/caminhoes",            iconName: "truck" },
  { label: "Carretas",    href: "/comprar/carretas",     iconName: "container" },
  { label: "Implementos", href: "/comprar/implementos",  iconName: "wrench" },
  { label: "Ônibus",      href: "/onibus",               iconName: "bus" },
  { label: "Máquinas",    href: "/comprar/maquinas",     iconName: "tractor" },
  { label: "Peças",       href: "/comprar/pecas",        iconName: "package" },
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
  return qs ? `/comprar/caminhoes?${qs}` : "/comprar/caminhoes";
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
          <strong>{total}</strong> {total === 1 ? "anúncio" : "anúncios"}
          {hasFilters && <span className="af-filtered"> encontrados</span>}
          {hasFilters && <Link href="/comprar/caminhoes" className="af-clear-inline"><X size={11} />Limpar</Link>}
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
                <span className="af-dico"><Star size={14} /></span>Todas
              </Link>
              {MARCAS_VALIDAS.map((m) => (
                <Link key={m} href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { marca: m })} className={`af-ditem${marcaFiltro === m ? " active" : ""}`} onClick={() => setDrawerOpen(false)}>
                  {MARCAS_LOGOS[m]
                    ? <Image src={MARCAS_LOGOS[m]} alt={m} width={28} height={28} className="af-logo" unoptimized />
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
            <p className="af-dlabel">Faixa de preço</p>
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
              <Link href="/comprar/caminhoes" className="af-dclear" onClick={() => setDrawerOpen(false)}><X size={12} />Limpar filtros</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
