"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "public-theme";
type PublicTheme = "light" | "dark";

function applyPublicTheme(theme: PublicTheme) {
  document.documentElement.setAttribute("data-public-theme", theme);
}

export function ThemeTogglePublic() {
  const [theme, setTheme] = useState<PublicTheme>("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY) as PublicTheme | null;
    const initialTheme: PublicTheme = savedTheme === "dark" ? "dark" : "light";

    setTheme(initialTheme);
    applyPublicTheme(initialTheme);
  }, []);

  function toggleTheme() {
    const nextTheme: PublicTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    applyPublicTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="public-theme-toggle"
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      aria-pressed={isDark}
      onClick={toggleTheme}
    >
      {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
      <span>{isDark ? "Claro" : "Escuro"}</span>
    </button>
  );
}
