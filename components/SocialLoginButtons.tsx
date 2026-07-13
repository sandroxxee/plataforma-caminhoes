"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SocialLoginButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleLoginSocial(provider: "google" | "facebook") {
    setLoading(provider);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        alert(`Erro ao iniciar login social: ${error.message}`);
        setLoading(null);
      }
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.dividerRow}>
        <div style={styles.line}></div>
        <span style={styles.dividerText}>ou entre com</span>
        <div style={styles.line}></div>
      </div>

      <div style={styles.buttonRow}>
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleLoginSocial("google")}
          disabled={loading !== null}
          style={styles.googleBtn}
        >
          <svg style={styles.icon} viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.091 14.982 0 12 0 7.354 0 3.307 2.673 1.398 6.564l3.868 3.201z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.275c0-.818-.073-1.609-.21-2.373H12v4.582h6.458a5.534 5.534 0 0 1-2.4 3.627v3.018h3.868c2.264-2.082 3.564-5.145 3.564-8.854z"
            />
            <path
              fill="#FBBC05"
              d="M5.266 14.235L1.398 17.436A11.97 11.97 0 0 0 12 24c2.982 0 5.642-1.091 7.918-2.982l-3.868-3.018a7.078 7.078 0 0 1-10.784-3.765z"
            />
            <path
              fill="#34A853"
              d="M12 24c-2.982 0-5.642-1.091-7.918-2.982l3.868-3.018a7.078 7.078 0 0 1 10.784-3.765l3.868 3.201A11.97 11.97 0 0 0 12 24z"
            />
          </svg>
          <span>{loading === "google" ? "Carregando..." : "Google"}</span>
        </button>

        {/* Facebook Button */}
        <button
          type="button"
          onClick={() => handleLoginSocial("facebook")}
          disabled={loading !== null}
          style={styles.facebookBtn}
        >
          <svg style={styles.icon} viewBox="0 0 24 24" fill="#ffffff">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
          </svg>
          <span>{loading === "facebook" ? "Carregando..." : "Facebook"}</span>
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    width: "100%",
    marginTop: 18,
    marginBottom: 4,
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    background: "var(--line)",
    opacity: 0.8,
  },
  dividerText: {
    fontSize: 12,
    color: "var(--muted)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  buttonRow: {
    display: "flex",
    gap: 12,
  },
  googleBtn: {
    flex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    borderRadius: 12,
    border: "1px solid var(--line)",
    background: "var(--surface)",
    color: "var(--text)",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
    transition: "background 0.15s, border-color 0.15s",
  },
  facebookBtn: {
    flex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    borderRadius: 12,
    border: 0,
    background: "#1877F2",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(24,119,242,0.15)",
    transition: "opacity 0.15s",
  },
  icon: {
    width: 18,
    height: 18,
    flexShrink: 0,
  },
};
