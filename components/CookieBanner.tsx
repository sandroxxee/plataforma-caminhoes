"use client";
import { useState, useEffect } from "react";

const COOKIE_KEY = "cv_cookies_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_KEY);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept(type: "all" | "essential") {
    try {
      localStorage.setItem(COOKIE_KEY, type);
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div role="dialog" aria-label="Aviso de cookies" style={styles.overlay}>
      <div style={styles.banner}>
        <div style={styles.icon} aria-hidden="true">🍪</div>

        <div style={styles.content}>
          <strong style={styles.title}>Usamos cookies</strong>
          <p style={styles.text}>
            Usamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo.
            Você pode aceitar todos ou apenas os essenciais para o site funcionar.
          </p>
        </div>

        <div style={styles.actions}>
          <button
            onClick={() => accept("essential")}
            style={styles.btnSecondary}
          >
            Só essenciais
          </button>
          <button
            onClick={() => accept("all")}
            style={styles.btnPrimary}
          >
            Aceitar todos
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cv-slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .cv-cookie-banner {
          animation: cv-slide-up .35s cubic-bezier(.22,1,.36,1) both;
        }
        @media (max-width: 600px) {
          .cv-cookie-inner {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
          }
          .cv-cookie-actions {
            width: 100%;
            flex-direction: row !important;
          }
          .cv-cookie-actions button {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    padding: "0 0 16px",
    display: "flex",
    justifyContent: "center",
    pointerEvents: "none",
  },
  banner: {
    pointerEvents: "all",
    display: "flex",
    alignItems: "center",
    gap: 16,
    background: "#1a1f26",
    border: "1px solid #2d333b",
    borderRadius: 20,
    boxShadow: "0 8px 40px rgba(0,0,0,.45)",
    padding: "16px 20px",
    maxWidth: 780,
    width: "calc(100% - 32px)",
    animation: "cv-slide-up .35s cubic-bezier(.22,1,.36,1) both",
  },
  icon: {
    fontSize: 28,
    flexShrink: 0,
    lineHeight: 1,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    display: "block",
    fontSize: 15,
    color: "#f0f2f5",
    marginBottom: 4,
    fontWeight: 900,
  },
  text: {
    margin: 0,
    fontSize: 13,
    color: "#8b949e",
    fontWeight: 700,
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    gap: 8,
    flexShrink: 0,
  },
  btnSecondary: {
    padding: "10px 16px",
    borderRadius: 12,
    border: "1px solid #2d333b",
    background: "transparent",
    color: "#8b949e",
    fontWeight: 900,
    fontSize: 13,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  btnPrimary: {
    padding: "10px 18px",
    borderRadius: 12,
    border: "none",
    background: "#1877f2",
    color: "#fff",
    fontWeight: 900,
    fontSize: 13,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};
