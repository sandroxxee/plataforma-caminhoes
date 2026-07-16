import React from "react";

interface StepIndicatorProps {
  steps?: string[];
  activeIndex: number;
}

export function StepIndicator({ 
  steps = ["📝 Dados", "🖼️ Fotos", "📞 Contato", "✅ Enviar"], 
  activeIndex 
}: StepIndicatorProps) {
  return (
    <div style={{ 
      display: "flex", 
      gap: "0.5rem", 
      marginBottom: "20px", 
      background: "var(--soft)", 
      padding: "0.5rem",
      borderRadius: "16px",
      border: "1px solid var(--line)",
      flexWrap: "wrap"
    }}>
      {steps.map((label, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div key={idx} style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.2rem",
            borderRadius: "10px",
            background: isActive ? "var(--blue, #2563eb)" : "transparent",
            color: isActive ? "#fff" : "var(--muted)",
            fontWeight: isActive ? 800 : 700,
            fontSize: "0.85rem",
            justifyContent: "center",
            minWidth: "80px"
          }}>
            <span style={{ 
              background: isActive ? "rgba(255,255,255,0.2)" : "var(--line)", 
              padding: "0 0.6rem", 
              borderRadius: "999px", 
              color: isActive ? "#fff" : "var(--muted)",
              fontWeight: "bold"
            }}>
              {idx + 1}
            </span>
            {label}
          </div>
        );
      })}
    </div>
  );
}
