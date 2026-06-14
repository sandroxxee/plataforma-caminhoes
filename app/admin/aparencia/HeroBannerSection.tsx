"use client";

import { useState } from "react";
import { HeroBannerUpload } from "./HeroBannerUpload";
import type { CSSProperties } from "react";

type Props = { currentUrl: string };

export function HeroBannerSection({ currentUrl }: Props) {
  const [url, setUrl] = useState(currentUrl);

  function handleSaved(newUrl: string) {
    setUrl(newUrl);
    // Atualiza o input hidden do form para o server action receber
    const hidden = document.getElementById("heroBannerUrl") as HTMLInputElement | null;
    if (hidden) hidden.value = newUrl;
  }

  return (
    <section style={s.section}>
      <h2 style={s.title}>Imagem da capa</h2>
      <p style={s.desc}>Envie uma foto para o banner principal da home. Recorte e ajuste o zoom antes de salvar.</p>
      <HeroBannerUpload currentUrl={url} onSaved={handleSaved} />
    </section>
  );
}

const s: Record<string, CSSProperties> = {
  section: { padding: 22, borderRadius: 26, background: "#ffffff", border: "1px solid #d8dee9", boxShadow: "0 8px 22px rgba(15,23,42,.05)", marginBottom: 0 },
  title:   { margin: "0 0 6px", fontSize: 24, letterSpacing: "-.035em", color: "#111827" },
  desc:    { margin: "0 0 16px", fontSize: 13, color: "#64748b", fontWeight: 700 },
};
