"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";

const LS_KEY = "cv_search_history";
const MAX_HISTORY = 6;

function getHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function saveHistory(term: string) {
  const h = [term, ...getHistory().filter((t) => t !== term)].slice(0, MAX_HISTORY);
  localStorage.setItem(LS_KEY, JSON.stringify(h));
}

type Props = { placeholder?: string; target?: string; initialValue?: string };

export function SearchBar({ placeholder = "Buscar caminhões, implementos, marcas...", target = "/anuncios", initialValue = "" }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [popular, setPopular] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // carrega buscas populares uma vez
  useEffect(() => {
    fetch("/api/search-log")
      .then((r) => r.json())
      .then((d: { term: string }[]) => setPopular(d.map((x) => x.term)))
      .catch(() => {});
    setHistory(getHistory());
  }, []);

  // autocomplete com debounce
  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}`);
        setSuggestions(await r.json());
      } catch { setSuggestions([]); }
      setLoading(false);
    }, 220);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setValue(v);
    fetchSuggestions(v);
    setOpen(true);
  }

  function go(term: string) {
    const clean = term.trim();
    if (clean) {
      saveHistory(clean);
      setHistory(getHistory());
      fetch("/api/search-log", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ term: clean }) }).catch(() => {});
    }
    router.push(clean ? `${target}?busca=${encodeURIComponent(clean)}` : target);
    setOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    go(value);
  }

  // fecha ao clicar fora
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const showSuggestions = open && suggestions.length > 0;
  const showEmpty = open && value.length < 2 && (history.length > 0 || popular.length > 0);

  return (
    <div ref={wrapRef} className="sb-wrap">
      <form className="sb-form search-top" onSubmit={handleSubmit}>
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          name="busca"
          value={value}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          aria-label="Buscar"
        />
        {loading && <span className="sb-spin" aria-hidden="true" />}
      </form>

      {(showSuggestions || showEmpty) && (
        <div className="sb-dropdown" role="listbox">
          {showEmpty && history.length > 0 && (
            <>
              <p className="sb-group">Buscas recentes</p>
              {history.map((t) => (
                <button key={t} className="sb-item sb-history" onMouseDown={() => { setValue(t); go(t); }}>
                  <span className="sb-icon">🕐</span> {t}
                </button>
              ))}
            </>
          )}
          {showEmpty && popular.length > 0 && (
            <>
              <p className="sb-group">Mais buscados</p>
              {popular.map((t) => (
                <button key={t} className="sb-item sb-popular" onMouseDown={() => { setValue(t); go(t); }}>
                  <span className="sb-icon">🔥</span> {t}
                </button>
              ))}
            </>
          )}
          {showSuggestions && suggestions.map((s) => (
            <button key={s} className="sb-item" role="option" onMouseDown={() => { setValue(s); go(s); }}>
              <span className="sb-icon"><Search size={13} /></span> {s}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .sb-wrap { position: relative; flex: 1; max-width: 520px; }
        .sb-form { width: 100%; display: flex; align-items: center; gap: 8px; padding: 0 16px; }
        .sb-spin {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid var(--line); border-top-color: var(--blue);
          animation: sb-rotate .6s linear infinite; flex-shrink: 0;
        }
        @keyframes sb-rotate { to { transform: rotate(360deg); } }
        .sb-dropdown {
          position: absolute; top: calc(100% + 6px); left: 0; right: 0;
          background: var(--surface); border: 1px solid var(--line);
          border-radius: 16px; box-shadow: var(--shadow3);
          overflow: hidden; z-index: 200;
          display: flex; flex-direction: column;
        }
        .sb-group {
          margin: 0; padding: 8px 16px 4px;
          font-size: 10px; font-weight: 900; text-transform: uppercase;
          letter-spacing: .08em; color: var(--muted);
        }
        .sb-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; background: transparent; border: 0;
          text-align: left; cursor: pointer; font-size: 14px; font-weight: 600;
          color: var(--text); transition: background .12s;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sb-item:hover { background: var(--soft); }
        .sb-icon { display: flex; align-items: center; color: var(--muted); flex-shrink: 0; font-size: 14px; }
        .sb-history .sb-icon { color: var(--muted); }
        .sb-popular .sb-icon { color: #f97316; }
      `}</style>
    </div>
  );
}
