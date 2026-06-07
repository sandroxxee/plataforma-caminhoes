"use client";

import { useState, type CSSProperties } from "react";

type AdminDivulgacaoBoxProps = {
  titulo: string;
  textoGrupo: string;
  textoCurto: string;
  linkAnuncio: string;
  facebookShareUrl: string;
};

export function AdminDivulgacaoBox({ titulo, textoGrupo, textoCurto, linkAnuncio, facebookShareUrl }: AdminDivulgacaoBoxProps) {
  const [copiado, setCopiado] = useState<string | null>(null);

  async function copiar(valor: string, label: string) {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(label);
      window.setTimeout(() => setCopiado(null), 2200);
    } catch {
      setCopiado("Nao foi possivel copiar automaticamente");
    }
  }

  return (
    <div style={styles.wrap}>
      <section style={styles.card}>
        <div style={styles.cardHead}>
          <span style={styles.badge}>Facebook</span>
          {copiado && <strong style={styles.copied}>{copiado}</strong>}
        </div>

        <h2 style={styles.title}>Texto pronto para divulgar</h2>
        <p style={styles.help}>Copie o texto, abra o Facebook e cole manualmente onde fizer sentido. Nao e disparo automatico.</p>

        <textarea readOnly value={textoGrupo} style={styles.textarea} aria-label={`Texto de divulgacao para ${titulo}`} />

        <div style={styles.actions}>
          <button type="button" onClick={() => copiar(textoGrupo, "Texto copiado")} style={styles.primary}>Copiar texto</button>
          <button type="button" onClick={() => copiar(linkAnuncio, "Link copiado")} style={styles.secondary}>Copiar link</button>
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" style={styles.secondary}>Abrir Facebook</a>
          <a href={facebookShareUrl} target="_blank" rel="noreferrer" style={styles.secondary}>Compartilhar link</a>
        </div>
      </section>

      <section style={styles.cardSoft}>
        <h2 style={styles.title}>Versao curta</h2>
        <p style={styles.help}>Boa para status, pagina, comentario ou chamada rapida.</p>
        <textarea readOnly value={textoCurto} style={styles.smallTextarea} aria-label={`Texto curto de divulgacao para ${titulo}`} />
        <div style={styles.actions}>
          <button type="button" onClick={() => copiar(textoCurto, "Texto curto copiado")} style={styles.primary}>Copiar versao curta</button>
          <a href={linkAnuncio} target="_blank" rel="noreferrer" style={styles.secondary}>Abrir anuncio</a>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: "grid", gap: 18 },
  card: { padding: 22, borderRadius: 24, background: "#1f2327", border: "1px solid #343a40", boxShadow: "0 16px 34px rgba(0,0,0,.18)" },
  cardSoft: { padding: 22, borderRadius: 24, background: "#171a1d", border: "1px solid #2b3035" },
  cardHead: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 },
  badge: { padding: "7px 11px", borderRadius: 999, background: "#12351f", color: "#bbf7d0", fontWeight: 900, fontSize: 12 },
  copied: { color: "#22c55e", fontSize: 13 },
  title: { margin: "0 0 8px", color: "#f4f4f5", fontSize: 22 },
  help: { margin: "0 0 14px", color: "#a7afb7", lineHeight: 1.5 },
  textarea: { width: "100%", minHeight: 230, resize: "vertical", borderRadius: 18, border: "1px solid #343a40", background: "#101214", color: "#e8eaed", padding: 16, font: "inherit", lineHeight: 1.55, outline: "none" },
  smallTextarea: { width: "100%", minHeight: 150, resize: "vertical", borderRadius: 18, border: "1px solid #343a40", background: "#101214", color: "#e8eaed", padding: 16, font: "inherit", lineHeight: 1.55, outline: "none" },
  actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 },
  primary: { border: 0, padding: "12px 16px", borderRadius: 13, background: "#22c55e", color: "#06140b", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" },
  secondary: { padding: "12px 16px", borderRadius: 13, background: "#2a2f34", border: "1px solid #343a40", color: "#e8eaed", textDecoration: "none", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" },
};
