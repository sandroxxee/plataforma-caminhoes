"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

// ─── variant="admin" ────────────────────────────────────────────────────────
// storage: "site-theme" | default: dark | aplica data-theme em html+body
//
// ─── variant="public" (default) ─────────────────────────────────────────────
// storage: "public-theme" | default: light | aplica data-public-theme + classes body

const CONFIG = {
  admin: {
    storageKey: "site-theme",
    defaultTheme: "dark" as Theme,
    className: "theme-toggle",
    iconSize: 17,
    apply(theme: Theme) {
      document.documentElement.dataset.theme = theme;
      if (document.body) document.body.dataset.theme = theme;
      window.localStorage.setItem("site-theme", theme);
    },
    cleanup() {},
  },
  public: {
    storageKey: "public-theme",
    defaultTheme: "light" as Theme,
    className: "public-theme-toggle",
    iconSize: 15,
    apply(theme: Theme) {
      document.documentElement.setAttribute("data-public-theme", theme);
      document.body.classList.toggle("public-theme-dark", theme === "dark");
      document.body.classList.toggle("public-theme-light", theme === "light");
      window.localStorage.setItem("public-theme", theme);
    },
    cleanup() {
      document.body.classList.remove("public-theme-dark", "public-theme-light");
    },
  },
} as const;

type Variant = keyof typeof CONFIG;

interface ThemeToggleProps {
  variant?: Variant;
}

export function ThemeToggle({ variant = "public" }: ThemeToggleProps) {
  const cfg = CONFIG[variant];
  const [theme, setTheme] = useState<Theme>(cfg.defaultTheme);

  useEffect(() => {
    const saved = window.localStorage.getItem(cfg.storageKey) as Theme | null;
    const initial: Theme = saved === "dark" || saved === "light" ? saved : cfg.defaultTheme;
    setTheme(initial);
    cfg.apply(initial);
    return cfg.cleanup;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    cfg.apply(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={cfg.className}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      aria-pressed={isDark}
      title={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      onClick={toggle}
    >
      {isDark
        ? <Sun  size={cfg.iconSize} aria-hidden="true" />
        : <Moon size={cfg.iconSize} aria-hidden="true" />}
    </button>
  );
}

/** @deprecated use <ThemeToggle variant="public" /> */
export function ThemeTogglePublic() {
  return <ThemeToggle variant="public" />;
}
