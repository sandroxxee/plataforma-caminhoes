"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, Search, Truck, Container, Wrench, Bus, Tractor, Package } from "lucide-react";
import { SalvarBusca } from "@/components/SalvarBusca";
import { MARCAS_VALIDAS } from "@/lib/constants";

const CATEGORIAS = [
  { label: "Todos",       href: "/anuncios",     icon: <Truck size={16} /> },
  { label: "Caminhões",   href: "/caminhoes",    icon: <Truck size={16} /> },
  { label: "Carretas",    href: "/carretas",     icon: <Container size={16} /> },
  { label: "Implementos", href: "/implementos",  icon: <Wrench size={16} /> },
  { label: "Ônibus",      href: "/onibus",       icon: <Bus size={16} /> },
  { label: "Máquinas",    href: "/maquinas",     icon: <Tractor size={16} /> },
  { label: "Peças",       href: "/pecas",        icon: <Package size={16} /> },
];

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
  return qs ? `/anuncios?${qs}` : "/anuncios";
}

type Props = {
  q:            string;
  faixaIdx:     number;
  marcaFiltro:  string;
  estadoFiltro: string;
  hasFilters:   boolean;
  total:        number;
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
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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

  const SidebarContent = () => (
    <div className="sb-content">

      {/* Categorias */}
      <div className="sb-section">
        <p className="sb-label">Categorias</p>
        <nav className="sb-cat-list">
          {CATEGORIAS.map((c) => {
            const active = c.href.replace("/", "") === categoriaAtiva || (c.href === "/anuncios" && categoriaAtiva === "anuncios");
            return (
              <Link key={c.href} href={c.href} className={`sb-cat-item${active ? " active" : ""}`} onClick={() => setDrawerOpen(false)}>
                <span className="sb-cat-icon">{c.icon}</span>
                {c.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sb-divider" />

      {/* Marcas */}
      <div className="sb-section">
        <p className="sb-label">Marcas</p>
        <nav className="sb-brand-list">
          <Link
            href={buildHref(q, faixaIdx, "", estadoFiltro, { marca: undefined })}
            className={`sb-brand-item${!marcaFiltro ? " active" : ""}`}
            onClick={() => setDrawerOpen(false)}
          >
            <span className="sb-brand-icon sb-brand-all">★</span>
            Todas
          </Link>
          {MARCAS_VALIDAS.map((m) => (
            <Link
              key={m}
              href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { marca: m })}
              className={`sb-brand-item${marcaFiltro === m ? " active" : ""}`}
              onClick={() => setDrawerOpen(false)}
            >
              {MARCAS_LOGOS[m] ? (
                <Image src={MARCAS_LOGOS[m]} alt={m} width={22} height={22} className="sb-brand-logo" unoptimized />
              ) : (
                <span className="sb-brand-icon">{m[0]}</span>
              )}
              {m}
            </Link>
          ))}
        </nav>
      </div>

      <div className="sb-divider" />

      {/* Estado */}
      <div className="sb-section">
        <p className="sb-label">Estado</p>
        <div className="sb-chips">
          {ESTADOS.map((e) => (
            <Link
              key={e.value || "todos"}
              href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { estado: e.value || undefined })}
              className={`sb-chip${estadoFiltro === e.value ? " active" : ""}`}
              onClick={() => setDrawerOpen(false)}
            >
              {e.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="sb-divider" />

      {/* Preço */}
      <div className="sb-section">
        <p className="sb-label">Faixa de preço</p>
        <nav className="sb-price-list">
          {FAIXAS.map((f, idx) => (
            <Link
              key={idx}
              href={buildHref(q, faixaIdx, marcaFiltro, estadoFiltro, { faixa: idx === 0 ? undefined : idx })}
              className={`sb-price-item${faixaIdx === idx ? " active" : ""}`}
              onClick={() => setDrawerOpen(false)}
            >
              {f.label}
            </Link>
          ))}
        </nav>
      </div>

      {hasFilters && (
        <>
          <div className="sb-divider" />
          <div className="sb-section">
            <SalvarBusca marca={marcaFiltro || undefined} estado={estadoFiltro || undefined} precoMax={precoMaxAtivo} />
            <Link href="/anuncios" className="sb-clear">
              <X size={13} /> Limpar filtros
            </Link>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* ── TOPBAR MOBILE ── */}
      <div className="sb-mobile-bar">
        <div className="sb-search-wrap">
          <Search size={15} className="sb-search-icon" />
          <input
            type="search" className="sb-search"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {search && <button className="sb-search-clear" onClick={() => handleSearch("")}><X size={13} /></button>}
        </div>
        <button className="sb-drawer-btn" onClick={() => setDrawerOpen(true)}>
          <SlidersHorizontal size={15} />
          Filtros
          {activeCount > 0 && <span className="sb-badge">{activeCount}</span>}
        </button>
      </div>

      {/* ── TOPBAR DESKTOP: só busca + contador ── */}
      <div className="sb-desktop-bar">
        <div className="sb-search-wrap">
          <Search size={15} className="sb-search-icon" />
          <input
            type="search" className="sb-search"
            placeholder="Buscar por modelo, marca ou cidade..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {search && <button className="sb-search-clear" onClick={() => handleSearch("")}><X size={13} /></button>}
        </div>
        <p className="sb-count">
          <strong>{total}</strong> {total === 1 ? "anúncio" : "anúncios"}
          {hasFilters && <span className="sb-filtered"> encontrados</span>}
          {hasFilters && <Link href="/anuncios" className="sb-clear-inline"><X size={11} />Limpar</Link>}
        </p>
      </div>

      {/* ── DRAWER MOBILE ── */}
      {drawerOpen && <div className="sb-overlay" onClick={() => setDrawerOpen(false)} />}
      <div className={`sb-drawer${drawerOpen ? " open" : ""}`}>
        <div className="sb-drawer-head">
          <span className="sb-drawer-title">Filtros</span>
          <button className="sb-drawer-close" onClick={() => setDrawerOpen(false)}><X size={18} /></button>
        </div>
        <div className="sb-drawer-body"><SidebarContent /></div>
      </div>

      <style>{`
        /* ── MOBILE BAR ── */
        .sb-mobile-bar {
          display: none; gap: 8px; align-items: center; margin-bottom: 16px;
        }
        /* ── DESKTOP BAR ── */
        .sb-desktop-bar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 16px; flex-wrap: wrap;
        }
        .sb-search-wrap {
          position: relative; display: flex; align-items: center; flex: 1; max-width: 480px;
        }
        .sb-search-icon { position: absolute; left: 13px; color: var(--muted); pointer-events: none; }
        .sb-search {
          width: 100%; height: 42px; padding: 0 38px 0 38px;
          border-radius: 12px; border: 1.5px solid var(--line);
          background: var(--surface); color: var(--text);
          font-size: 14px; font-weight: 700; outline: none;
          transition: border-color .15s;
        }
        .sb-search:focus { border-color: var(--blue); }
        .sb-search::placeholder { color: var(--muted); font-weight: 600; }
        .sb-search-clear {
          position: absolute; right: 10px;
          width: 22px; height: 22px; border-radius: 999px;
          border: none; background: var(--soft); color: var(--muted); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .sb-count { margin: 0; font-size: 14px; font-weight: 700; color: var(--muted); white-space: nowrap; }
        .sb-count strong { color: var(--text); font-size: 16px; }
        .sb-filtered { color: var(--blue); }
        .sb-clear-inline {
          display: inline-flex; align-items: center; gap: 4px;
          margin-left: 10px; height: 28px; padding: 0 10px; border-radius: 999px;
          border: 1.5px solid rgba(239,68,68,.3); background: rgba(239,68,68,.07);
          color: #f87171; font-size: 11px; font-weight: 800; text-decoration: none;
          transition: background .14s;
        }
        .sb-clear-inline:hover { background: rgba(239,68,68,.14); }

        /* ── SIDEBAR CONTENT ── */
        .sb-content { display: flex; flex-direction: column; }
        .sb-section { padding: 14px 16px; }
        .sb-divider { height: 1px; background: var(--line); margin: 0; }
        .sb-label {
          margin: 0 0 10px; font-size: 10px; font-weight: 900;
          text-transform: uppercase; letter-spacing: .08em; color: var(--muted);
        }

        /* Categorias */
        .sb-cat-list { display: flex; flex-direction: column; gap: 2px; }
        .sb-cat-item {
          display: flex; align-items: center; gap: 10px;
          height: 38px; padding: 0 10px; border-radius: 10px;
          font-size: 13px; font-weight: 800; color: var(--text);
          text-decoration: none; transition: background .13s, color .13s;
        }
        .sb-cat-item:hover { background: var(--soft); color: var(--blue); }
        .sb-cat-item.active { background: var(--blueSoft); color: var(--blue); }
        .sb-cat-icon { display: flex; align-items: center; color: var(--muted); flex-shrink: 0; }
        .sb-cat-item.active .sb-cat-icon { color: var(--blue); }

        /* Marcas */
        .sb-brand-list { display: flex; flex-direction: column; gap: 2px; }
        .sb-brand-item {
          display: flex; align-items: center; gap: 10px;
          height: 36px; padding: 0 10px; border-radius: 10px;
          font-size: 13px; font-weight: 800; color: var(--text);
          text-decoration: none; transition: background .13s, color .13s;
        }
        .sb-brand-item:hover { background: var(--soft); }
        .sb-brand-item.active { background: var(--blueSoft); color: var(--blue); }
        .sb-brand-logo { border-radius: 4px; object-fit: contain; }
        .sb-brand-icon {
          width: 22px; height: 22px; border-radius: 6px;
          background: var(--soft); display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 900; color: var(--muted); flex-shrink: 0;
        }
        .sb-brand-all { font-size: 13px; }

        /* Estado chips */
        .sb-chips { display: flex; gap: 5px; flex-wrap: wrap; }
        .sb-chip {
          display: inline-flex; align-items: center; height: 28px; padding: 0 10px;
          border-radius: 999px; border: 1.5px solid var(--line);
          background: var(--soft); color: var(--muted);
          font-size: 11px; font-weight: 800; text-decoration: none;
          transition: .13s;
        }
        .sb-chip:hover { border-color: var(--blue); color: var(--blue); }
        .sb-chip.active { border-color: var(--blue); background: var(--blueSoft); color: var(--blue); }

        /* Preço */
        .sb-price-list { display: flex; flex-direction: column; gap: 2px; }
        .sb-price-item {
          display: flex; align-items: center;
          height: 34px; padding: 0 10px; border-radius: 10px;
          font-size: 13px; font-weight: 700; color: var(--text);
          text-decoration: none; transition: background .13s, color .13s;
        }
        .sb-price-item:hover { background: var(--soft); color: var(--blue); }
        .sb-price-item.active { background: var(--blueSoft); color: var(--blue); font-weight: 900; }

        /* Limpar */
        .sb-clear {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 8px;
          height: 34px; padding: 0 14px; border-radius: 999px;
          border: 1.5px solid rgba(239,68,68,.3); background: rgba(239,68,68,.07);
          color: #f87171; font-size: 12px; font-weight: 800; text-decoration: none;
          transition: background .14s;
        }
        .sb-clear:hover { background: rgba(239,68,68,.14); }

        /* DRAWER btn */
        .sb-drawer-btn {
          display: inline-flex; align-items: center; gap: 6px;
          height: 42px; padding: 0 14px; border-radius: 12px;
          border: 1.5px solid var(--line); background: var(--surface);
          color: var(--text); font-size: 13px; font-weight: 800; cursor: pointer;
          white-space: nowrap; transition: border-color .14s;
        }
        .sb-drawer-btn:hover { border-color: var(--blue); color: var(--blue); }
        .sb-badge {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 18px; height: 18px; border-radius: 999px;
          background: var(--blue); color: #fff; font-size: 11px; font-weight: 900; padding: 0 4px;
        }

        /* OVERLAY */
        .sb-overlay {
          position: fixed; inset: 0; z-index: 199;
          background: rgba(0,0,0,.45); backdrop-filter: blur(2px);
        }

        /* DRAWER */
        .sb-drawer {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: min(320px, 85vw); z-index: 200;
          background: var(--surface); border-right: 1px solid var(--line);
          box-shadow: var(--shadow3);
          transform: translateX(-100%); transition: transform .28s ease;
          display: flex; flex-direction: column; overflow: hidden;
        }
        .sb-drawer.open { transform: translateX(0); }
        .sb-drawer-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 16px; border-bottom: 1px solid var(--line); flex-shrink: 0;
        }
        .sb-drawer-title { font-size: 16px; font-weight: 900; }
        .sb-drawer-close {
          width: 36px; height: 36px; border-radius: 50%;
          border: none; background: var(--soft); color: var(--text);
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .sb-drawer-body { overflow-y: auto; flex: 1; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .sb-mobile-bar  { display: flex; }
          .sb-desktop-bar { display: none; }
        }
      `}</style>
    </>
  );
}
