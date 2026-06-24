import type { CSSProperties } from "react";

export const styles: Record<string, CSSProperties> = {
  wrapper: { display: "grid", gridTemplateColumns: "420px minmax(0, 1fr)", gap: 20, alignItems: "start" },
  formCard: { padding: 18, borderRadius: 22, background: "#1f2327", border: "1px solid #343a40", boxShadow: "0 16px 34px rgba(0,0,0,.18)" },
  formTitle: { margin: 0, color: "#f4f4f5", fontSize: 22 },
  helpText: { margin: "8px 0 16px", color: "#a7afb7", lineHeight: 1.45 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  label: { display: "grid", gap: 7, marginTop: 12, color: "#cbd5df", fontWeight: 800, fontSize: 13 },
  input: { width: "100%", border: "1px solid #343a40", background: "#111315", color: "#f4f4f5", borderRadius: 12, padding: 12, font: "inherit" },
  textarea: { width: "100%", minHeight: 105, border: "1px solid #343a40", background: "#111315", color: "#f4f4f5", borderRadius: 12, padding: 12, font: "inherit", resize: "vertical" },
  checkCard: { marginTop: 14, padding: 14, borderRadius: 16, background: "#15191d", border: "1px solid #343a40" },
  checkTitle: { display: "block", marginBottom: 10, color: "#f4f4f5" },
  checkGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  checkItem: { color: "#cbd5df", fontSize: 13, fontWeight: 800 },
  printButton: { width: "100%", marginTop: 16, border: 0, borderRadius: 14, padding: "14px 16px", background: "#f59e0b", color: "#1f1300", fontWeight: 900, cursor: "pointer", fontSize: 15 },
  sheet: { background: "#ffffff", color: "#151515", borderRadius: 18, overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.35)" },
  sheetHeader: { display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", padding: 26, background: "linear-gradient(135deg,#070707,#1d1d1d 62%,#563006)", color: "#ffffff" },
  brand: { color: "#f5a623", textTransform: "uppercase", letterSpacing: ".08em", fontSize: 13 },
  title: { margin: "8px 0 6px", fontSize: 30, lineHeight: 1.05, letterSpacing: "-.035em" },
  subtitle: { margin: 0, color: "#d6d6d6", lineHeight: 1.45 },
  badge: { border: "1px solid rgba(255,255,255,.25)", color: "#ffd38a", padding: "12px 14px", borderRadius: 14, fontWeight: 900, textAlign: "right" },
  sheetBody: { padding: 26 },
  valueBox: { display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", padding: 18, borderRadius: 16, border: "2px solid #d89b32", background: "#fff8eb", marginBottom: 20 },
  valueLabel: { display: "block", fontSize: 13, color: "#654000", fontWeight: 900, textTransform: "uppercase" },
  valueText: { margin: "6px 0 0", color: "#5b5b5b", lineHeight: 1.4 },
  value: { color: "#b75d00", fontSize: 34, whiteSpace: "nowrap" },
  sectionTitle: { margin: "22px 0 12px", fontSize: 19, color: "#111111" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  infoBox: { minHeight: 70, padding: 12, borderRadius: 12, background: "#f5f5f5", border: "1px solid #dddddd" },
  infoLabel: { display: "block", color: "#666666", fontWeight: 900, fontSize: 11, textTransform: "uppercase", marginBottom: 5 },
  infoValue: { display: "block", color: "#1f1f1f", lineHeight: 1.25 },
  photoChecklist: { display: "flex", gap: 8, flexWrap: "wrap" },
  checkedPill: { padding: "8px 10px", borderRadius: 999, background: "#dcfce7", color: "#14532d", border: "1px solid #86efac", fontWeight: 900, fontSize: 12 },
  uncheckedPill: { padding: "8px 10px", borderRadius: 999, background: "#f3f4f6", color: "#6b7280", border: "1px solid #d1d5db", fontWeight: 900, fontSize: 12 },
  documentBox: { minHeight: 140, display: "grid", placeItems: "center", padding: 16, borderRadius: 14, background: "#fafafa", border: "2px dashed #b9b9b9", color: "#666666", textAlign: "center" },
  documentImage: { maxWidth: "100%", maxHeight: 430, borderRadius: 10, objectFit: "contain" },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  figure: { margin: 0, borderRadius: 14, overflow: "hidden", border: "1px solid #dddddd", background: "#f7f7f7" },
  photo: { width: "100%", height: 175, objectFit: "cover", display: "block" },
  caption: { padding: 8, color: "#666666", fontWeight: 800, fontSize: 12, textAlign: "center" },
  emptyPhoto: { padding: 18, borderRadius: 12, border: "1px dashed #cccccc", color: "#777777" },
  paragraph: { color: "#252525", lineHeight: 1.65, fontSize: 15, margin: 0 },
  notice: { margin: "14px 0 0", padding: 14, borderRadius: 14, background: "#fff8eb", border: "1px solid #efd39f", color: "#4a3922", lineHeight: 1.55 },
  signatureGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 34, alignItems: "end" },
  signatureBox: { height: 88, borderRadius: 12, border: "1px dashed #999999", display: "grid", placeItems: "center", color: "#333333", fontFamily: "cursive", fontSize: 24, marginBottom: 8 },
  blankSignature: { height: 88, marginBottom: 8 },
  signatureLine: { borderTop: "1px solid #333333", paddingTop: 8, textAlign: "center", color: "#333333", fontSize: 13, lineHeight: 1.35 },
  footer: { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 22, paddingTop: 12, borderTop: "1px solid #dddddd", color: "#555555", fontSize: 12, fontWeight: 800 },
};

export const motivos = ["Financiamento", "Venda particular", "Troca", "Consórcio", "Inventário", "Garantia", "Avaliação mercadológica"];
export const fotosObrigatorias = ["Frente", "Traseira", "Lateral esquerda", "Lateral direita", "Interior", "Motor", "Pneus", "Documento", "Implemento", "Foto adicional"];

export function money(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function today() {
  return new Date().toLocaleDateString("pt-BR");
}
