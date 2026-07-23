"use me";
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, X, ExternalLink, RefreshCw } from "lucide-react";

interface SecurityAlert {
  id: string;
  titulo: string;
  mensagem: string;
  navegador: string | null;
  cidade: string | null;
  ip: string | null;
  created_at: string;
}

export function AdminSecurityTracker() {
  const [activeAlerts, setActiveAlerts] = useState<SecurityAlert[]>([]);
  const [sessionToken, setSessionToken] = useState<string>("");

  useEffect(() => {
    // 1. Gerar/obter token único de sessão no sessionStorage
    let token = sessionStorage.getItem("admin_session_token");
    if (!token) {
      token = "sess_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      sessionStorage.setItem("admin_session_token", token);
    }
    setSessionToken(token);

    // 2. Registrar sessão e enviar heartbeat a cada 30 segundos
    const registerSession = async (isHeartbeat = false) => {
      try {
        await fetch("/api/admin/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionToken: token, isHeartbeat })
        });
      } catch (err) {
        console.error("Falha ao atualizar sessão:", err);
      }
    };

    // Registrar no carregamento inicial
    registerSession(false);

    // Heartbeat a cada 30 segundos
    const heartbeatInterval = setInterval(() => {
      registerSession(true);
    }, 30000);

    // 3. Verificar se há alertas de novos logins de admin em outros dispositivos a cada 10 segundos
    const checkAlerts = async () => {
      try {
        const res = await fetch("/api/admin/security-alerts?unread=true");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.length > 0) {
            // Filtrar alertas criados nos últimos 15 minutos que não foram gerados por este token
            const unread = json.data as SecurityAlert[];
            setActiveAlerts(unread);
          }
        }
      } catch {
        // Ignorar erro de rede temporário
      }
    };

    checkAlerts();
    const alertInterval = setInterval(checkAlerts, 10000);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(alertInterval);
    };
  }, []);

  const dismissAlert = async (id: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
    try {
      await fetch("/api/admin/security-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId: id })
      });
    } catch {
      // Ignorar
    }
  };

  const dismissAll = async () => {
    setActiveAlerts([]);
    try {
      await fetch("/api/admin/security-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true })
      });
    } catch {
      // Ignorar
    }
  };

  if (activeAlerts.length === 0) return null;

  const firstAlert = activeAlerts[0];

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        maxWidth: 440,
        width: "calc(100vw - 40px)",
        background: "linear-gradient(135deg, #18181b 0%, #09090b 100%)",
        border: "1px solid #ef4444",
        boxShadow: "0 20px 40px rgba(239, 68, 68, 0.25), 0 0 20px rgba(0, 0, 0, 0.8)",
        borderRadius: 16,
        padding: "16px 20px",
        color: "#ffffff",
        animation: "pulseBorder 2s infinite"
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "rgba(239, 68, 68, 0.2)",
            color: "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <ShieldAlert size={24} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <strong style={{ fontSize: 15, color: "#fca5a5", display: "flex", alignItems: "center", gap: 6 }}>
              {firstAlert.titulo}
            </strong>
            <button
              onClick={() => dismissAlert(firstAlert.id)}
              style={{ background: "transparent", border: 0, color: "#9ca3af", cursor: "pointer", padding: 4 }}
              title="Fechar"
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ fontSize: 13, color: "#e5e7eb", margin: "4px 0 10px", lineHeight: 1.4 }}>
            {firstAlert.mensagem}
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <Link
              href="/admin/seguranca"
              onClick={dismissAll}
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#ffffff",
                background: "#dc2626",
                padding: "6px 14px",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6
              }}
            >
              Ver Sessões & Auditoria <ExternalLink size={12} />
            </Link>

            <button
              onClick={() => dismissAlert(firstAlert.id)}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#9ca3af",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "6px 12px",
                borderRadius: 8,
                cursor: "pointer"
              }}
            >
              Dispensar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
