"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function DarkModeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const theme = next ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }

  if (dark === null) return <div style={{ width: 36, height: 36 }} />;

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
      className="dmt-btn"
    >
      {dark ? <Sun size={17} strokeWidth={2.5} /> : <Moon size={17} strokeWidth={2.5} />}
      <style>{`
        .dmt-btn {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 10px;
          border: 1.5px solid var(--line);
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
          transition: background .14s, border-color .14s, transform .14s;
          flex-shrink: 0;
        }
        .dmt-btn:hover {
          background: var(--soft);
          border-color: var(--blue);
          transform: scale(1.07);
        }
      `}</style>
    </button>
  );
}
