import { ImageResponse } from "next/og";

export const alt = "Caminhões à Venda | Marketplace de caminhões";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgHome() {
  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", background: "#050d18", position: "relative", overflow: "hidden", fontFamily: "system-ui, sans-serif" }}>

        {/* Faixa azul lateral */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: "linear-gradient(to bottom, #1877f2, #0ea5e9)" }} />

        {/* Gradiente de fundo */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, rgba(24,119,242,0.18) 0%, transparent 65%)" }} />

        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px 0 72px" }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#1877f2,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(24,119,242,.5)" }}>
              <div style={{ fontSize: 28, display: "flex" }}>🚛</div>
            </div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 28, display: "flex", letterSpacing: -0.5 }}>
              Caminhões <span style={{ color: "#38bdf8", marginLeft: 8 }}>à Venda</span>
            </div>
          </div>

          {/* Headline */}
          <div style={{ color: "#fff", fontWeight: 900, fontSize: 72, lineHeight: 1.05, display: "flex", flexDirection: "column", letterSpacing: -2 }}>
            <span>O marketplace</span>
            <span style={{ color: "#38bdf8" }}>de caminhões</span>
            <span>do Brasil.</span>
          </div>

          {/* Sub */}
          <div style={{ color: "#94a3b8", fontSize: 26, fontWeight: 700, marginTop: 20, display: "flex" }}>
            Caminhões, carretas, implementos, máquinas e peças.
          </div>

          {/* Categorias */}
          <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
            {["Caminhões", "Carretas", "Implementos", "Máquinas", "Peças"].map((c) => (
              <div key={c} style={{ padding: "10px 20px", borderRadius: 999, border: "1.5px solid rgba(56,189,248,0.35)", background: "rgba(24,119,242,0.15)", color: "#38bdf8", fontSize: 18, fontWeight: 800, display: "flex" }}>
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
