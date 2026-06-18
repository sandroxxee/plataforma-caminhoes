// SISTEMA DE TEMAS
// Para adicionar um novo tema:
// 1. Crie um objeto ThemeTokens abaixo
// 2. Adicione a lista THEMES
// 3. Pronto - ThemeProvider aplica automaticamente

export type ThemeKey = "light" | "dark" | string;

export interface ThemeTokens {
  key: ThemeKey;
  label: string;
  colorScheme: "light" | "dark";
  tokens: {
    bg: string;
    surface: string;
    soft: string;
    text: string;
    muted: string;
    blue: string;
    blue2: string;
    blueSoft: string;
    wa: string;
    line: string;
    shadow: string;
    shadow2: string;
    shadow3: string;
    radius: string;
    radiusSm: string;
    accent?: string;
    accentSoft?: string;
    header?: string;
  };
}

export const THEME_LIGHT: ThemeTokens = {
  key: "light",
  label: "Claro",
  colorScheme: "light",
  tokens: {
    bg:       "#f0f2f5",
    surface:  "#ffffff",
    soft:     "#e8ebef",
    text:     "#0d1117",
    muted:    "#4b5563",
    blue:     "#1877f2",
    blue2:    "#0f5fc8",
    blueSoft: "#dbeafe",
    wa:       "#25d366",
    line:     "#d1d5db",
    shadow:   "0 2px 12px rgba(0,0,0,.07)",
    shadow2:  "0 8px 32px rgba(0,0,0,.12)",
    shadow3:  "0 16px 48px rgba(0,0,0,.16)",
    radius:   "20px",
    radiusSm: "12px",
    header:   "#ffffff",
  },
};

export const THEME_DARK: ThemeTokens = {
  key: "dark",
  label: "Escuro",
  colorScheme: "dark",
  tokens: {
    bg:       "#0a0f1a",
    surface:  "#131c2e",
    soft:     "#1a2336",
    text:     "#f0f4f8",
    muted:    "#a0aec0",
    blue:     "#4d9fff",
    blue2:    "#3b82f6",
    blueSoft: "rgba(77,159,255,.18)",
    wa:       "#25d366",
    line:     "rgba(160,174,192,.18)",
    shadow:   "0 2px 12px rgba(0,0,0,.35)",
    shadow2:  "0 8px 32px rgba(0,0,0,.48)",
    shadow3:  "0 16px 48px rgba(0,0,0,.6)",
    radius:   "20px",
    radiusSm: "12px",
    header:   "#131c2e",
  },
};

// Para ativar um novo tema, descomente e adicione a THEMES:
// export const THEME_ORANGE: ThemeTokens = {
//   key: "orange",
//   label: "Laranja",
//   colorScheme: "light",
//   tokens: { ...THEME_LIGHT.tokens, blue: "#f97316", blue2: "#ea6c0a", blueSoft: "#ffedd5", header: "#fff7ed" },
// };

export const THEMES: ThemeTokens[] = [
  THEME_LIGHT,
  THEME_DARK,
];

export const DEFAULT_THEME: ThemeKey = "light";

export function getTheme(key: ThemeKey): ThemeTokens {
  return THEMES.find((t) => t.key === key) ?? THEME_LIGHT;
}

export function themeToVars(tokens: ThemeTokens["tokens"]): string {
  const m: Record<string, string> = {
    "--bg":        tokens.bg,
    "--surface":   tokens.surface,
    "--soft":      tokens.soft,
    "--text":      tokens.text,
    "--muted":     tokens.muted,
    "--blue":      tokens.blue,
    "--blue2":     tokens.blue2,
    "--blueSoft":  tokens.blueSoft,
    "--wa":        tokens.wa,
    "--line":      tokens.line,
    "--shadow":    tokens.shadow,
    "--shadow2":   tokens.shadow2,
    "--shadow3":   tokens.shadow3,
    "--radius":    tokens.radius,
    "--radius-sm": tokens.radiusSm,
  };
  if (tokens.accent)     m["--accent"]     = tokens.accent;
  if (tokens.accentSoft) m["--accent-soft"] = tokens.accentSoft;
  if (tokens.header)     m["--header-bg"]   = tokens.header;
  return Object.entries(m).map(([k, v]) => `${k}:${v}`).join(";");
}
