"use client";

import { useCallback, useEffect, useState } from "react";
import { type ThemeKey, DEFAULT_THEME, THEMES } from "./themes";

const STORAGE_KEY = "site-theme";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeKey>(DEFAULT_THEME);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeKey | null;
    if (saved && THEMES.find((t) => t.key === saved)) {
      applyTheme(saved);
      setThemeState(saved);
    } else {
      applyTheme(DEFAULT_THEME);
    }
  }, []);

  const setTheme = useCallback((key: ThemeKey) => {
    applyTheme(key);
    setThemeState(key);
    localStorage.setItem(STORAGE_KEY, key);
  }, []);

  return { theme, setTheme, themes: THEMES };
}

function applyTheme(key: ThemeKey) {
  const body = document.body;
  body.classList.forEach((cls) => {
    if (cls.startsWith("public-theme-")) body.classList.remove(cls);
  });
  body.classList.add(`public-theme-${key}`);
}
