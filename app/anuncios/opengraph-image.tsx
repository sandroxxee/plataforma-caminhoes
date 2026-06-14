import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const alt = "Caminhões à Venda | Todos os anúncios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgAnuncios() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("trucks")
    .select("*", { count: "exact", head: true })
    .eq("status", "aprovado")
    .eq("vendido", false);

  const total = count ?? 0;

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", background: "#050d18", position: "relative", overflow: "hidden", fontFamily: "system-ui, sans-serif" }}>

        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: "linear-gradient(to bottom, #1877f2, #0ea5e9)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, rgba(24,119,242,0.18) 0%, transparent 65%)" }} />

        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#1877f2,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 24, display: "flex" }}>🚛</div>
            </div>
            <div style={{ color: "#94a3b8", fontWeight: 800, fontSize: 22, display: "flex" }}>caminhoesavenda.com</div>
          </div>

          <div style={{ color: "#fff", fontWeight: 900, fontSize: 68, lineHeight: 1.05, display: "flex", letterSpacing: -2 }}>
            Caminhões à Venda
          </div>

          {total > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20 }}>
              <div style={{ padding: "12px 28px", borderRadius: 999, background: "rgba(34,197,94,0.15)", border: "1.5px solid rgba(34,197,94,0.4)", color: "#22c55e", fontWeight: 900, fontSize: 26, display: "flex" }}>
                {total.toLocaleString("pt-BR")}+ anúncios ativos
              </div>
            </div>
          )}

          <div style={{ color: "#94a3b8", fontSize: 24, fontWeight: 700, marginTop: 20, display: "flex" }}>
            Negocie direto pelo WhatsApp. Sem interdiários.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
