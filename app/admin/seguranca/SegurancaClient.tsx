"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Globe,
  Clock,
  Laptop,
  Activity,
  Search,
  RefreshCw,
  AlertTriangle,
  FileEdit,
  UserCheck,
  Lock,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface SessionItem {
  id: string;
  user_id: string;
  session_token: string;
  user_agent: string | null;
  navegador: string | null;
  ip: string | null;
  cidade: string | null;
  estado: string | null;
  pais: string | null;
  is_admin: boolean;
  status: string;
  online_seconds: number;
  ultimo_acesso: string;
  created_at: string;
  perfis?: {
    id: string;
    email: string;
    nome: string;
    role: string;
  } | null;
}

interface AuditItem {
  id: string;
  usuario_id: string | null;
  acao: string;
  detalhes: any;
  ip: string | null;
  navegador: string | null;
  cidade: string | null;
  entidade: string | null;
  path: string | null;
  created_at: string;
  perfis?: {
    id: string;
    email: string;
    nome: string;
    role: string;
  } | null;
}

interface SecurityAlertItem {
  id: string;
  user_id: string;
  titulo: string;
  mensagem: string;
  navegador: string | null;
  cidade: string | null;
  ip: string | null;
  lido: boolean;
  created_at: string;
  perfis?: {
    id: string;
    email: string;
    nome: string;
  } | null;
}

interface Props {
  initialSessions: SessionItem[];
  initialAuditLogs: AuditItem[];
  initialAlerts: SecurityAlertItem[];
}

export default function SegurancaClient({ initialSessions, initialAuditLogs, initialAlerts }: Props) {
  const [activeTab, setActiveTab] = useState<"sessoes" | "auditoria" | "alertas">("sessoes");
  const [sessions, setSessions] = useState<SessionItem[]>(initialSessions);
  const [auditLogs, setAuditLogs] = useState<AuditItem[]>(initialAuditLogs);
  const [alerts, setAlerts] = useState<SecurityAlertItem[]>(initialAlerts);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [resSess, resAudit, resAlerts] = await Promise.all([
        fetch("/api/admin/session"),
        fetch("/api/audit?limit=100"),
        fetch("/api/admin/security-alerts")
      ]);

      if (resSess.ok) {
        const json = await resSess.json();
        if (json.success) setSessions(json.data);
      }
      if (resAudit.ok) {
        const json = await resAudit.json();
        if (json.success) setAuditLogs(json.data);
      }
      if (resAlerts.ok) {
        const json = await resAlerts.json();
        if (json.success) setAlerts(json.data);
      }
    } catch (err) {
      console.error("Erro ao atualizar dados:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatOnlineDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return "Menos de 1 min";
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hours > 0) {
      return `${hours}h ${remMins}min online`;
    }
    return `${mins} min online`;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const getTimeAgo = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return "Agora mesmo";
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `Há ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Há ${diffHours} h`;
    return `Há ${Math.floor(diffHours / 24)} dias`;
  };

  const translateAction = (acao: string) => {
    switch (acao) {
      case "aprovou_anuncio":
        return { label: "Aprovou Anúncio", color: "#22c55e", bg: "rgba(34,197,94,0.1)" };
      case "reprovou_anuncio":
        return { label: "Reprovou Anúncio", color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
      case "excluiu_anuncio":
        return { label: "Excluiu Anúncio", color: "#f43f5e", bg: "rgba(244,63,94,0.1)" };
      case "alterou_selo":
        return { label: "Alterou Selo / Destaque", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" };
      case "vinculou_parceiro":
        return { label: "Vinculou Parceiro", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" };
      case "login_admin":
        return { label: "Fez Login como Admin", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
      default:
        return { label: acao.replace(/_/g, " "), color: "var(--text)", bg: "var(--surface)" };
    }
  };

  // Filtros
  const filteredSessions = sessions.filter((s) => {
    const term = search.toLowerCase();
    const name = (s.perfis?.nome || s.perfis?.email || "").toLowerCase();
    const nav = (s.navegador || "").toLowerCase();
    const city = (s.cidade || "").toLowerCase();
    const ip = (s.ip || "").toLowerCase();
    return name.includes(term) || nav.includes(term) || city.includes(term) || ip.includes(term);
  });

  const filteredLogs = auditLogs.filter((l) => {
    const term = search.toLowerCase();
    const name = (l.perfis?.nome || l.perfis?.email || "").toLowerCase();
    const acao = (l.acao || "").toLowerCase();
    const city = (l.cidade || "").toLowerCase();
    const nav = (l.navegador || "").toLowerCase();
    return name.includes(term) || acao.includes(term) || city.includes(term) || nav.includes(term);
  });

  // Métricas
  const adminsOnlineCount = sessions.filter((s) => s.is_admin && (Date.now() - new Date(s.ultimo_acesso).getTime()) < 120000).length;
  const uniqueCitiesCount = new Set(sessions.map((s) => s.cidade).filter(Boolean)).size;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPIS DE SEGURANÇA */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="admin-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 13, textTransform: "uppercase" }}>
              Admins Online Agora
            </span>
            <ShieldCheck size={22} style={{ color: "#22c55e" }} />
          </div>
          <strong style={{ display: "block", fontSize: 32, fontWeight: 900, color: "var(--text)", marginTop: 12 }}>
            {adminsOnlineCount}
          </strong>
          <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 700, marginTop: 6, display: "block" }}>
            Dispositivos ativos conectados
          </span>
        </div>

        <div className="admin-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 13, textTransform: "uppercase" }}>
              Cidades de Acesso
            </span>
            <Globe size={22} style={{ color: "var(--blue)" }} />
          </div>
          <strong style={{ display: "block", fontSize: 32, fontWeight: 900, color: "var(--text)", marginTop: 12 }}>
            {uniqueCitiesCount}
          </strong>
          <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700, marginTop: 6, display: "block" }}>
            Locais geográficos mapeados
          </span>
        </div>

        <div className="admin-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 13, textTransform: "uppercase" }}>
              Edições Registradas
            </span>
            <Activity size={22} style={{ color: "#f59e0b" }} />
          </div>
          <strong style={{ display: "block", fontSize: 32, fontWeight: 900, color: "var(--text)", marginTop: 12 }}>
            {auditLogs.length}
          </strong>
          <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginTop: 6, display: "block" }}>
            Ações auditadas no sistema
          </span>
        </div>

        <div className="admin-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 13, textTransform: "uppercase" }}>
              Alertas de Segurança
            </span>
            <AlertTriangle size={22} style={{ color: "#ef4444" }} />
          </div>
          <strong style={{ display: "block", fontSize: 32, fontWeight: 900, color: "var(--text)", marginTop: 12 }}>
            {alerts.length}
          </strong>
          <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 700, marginTop: 6, display: "block" }}>
            Logins em novos dispositivos
          </span>
        </div>
      </div>

      {/* CABEÇALHO DE ABAS E BUSCA */}
      <div
        style={{
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          background: "var(--surface)",
          padding: 16,
          borderRadius: 16,
          border: "1px solid var(--line)"
        }}
      >
        {/* NAVEGAÇÃO DE ABAS */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setActiveTab("sessoes")}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 13,
              border: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: activeTab === "sessoes" ? "var(--blue)" : "transparent",
              color: activeTab === "sessoes" ? "#ffffff" : "var(--muted)"
            }}
          >
            <Laptop size={16} /> Sessões & Navegadores ({sessions.length})
          </button>

          <button
            onClick={() => setActiveTab("auditoria")}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 13,
              border: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: activeTab === "auditoria" ? "var(--blue)" : "transparent",
              color: activeTab === "auditoria" ? "#ffffff" : "var(--muted)"
            }}
          >
            <FileEdit size={16} /> O que Editou / Audit Log ({auditLogs.length})
          </button>

          <button
            onClick={() => setActiveTab("alertas")}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 13,
              border: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: activeTab === "alertas" ? "#ef4444" : "transparent",
              color: activeTab === "alertas" ? "#ffffff" : "var(--muted)"
            }}
          >
            <AlertTriangle size={16} /> Alertas de Login ({alerts.length})
          </button>
        </div>

        {/* CAMPO DE BUSCA E REFRESH */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative", minWidth: 260 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
            <input
              type="text"
              placeholder="Buscar cidade, navegador, e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: 10,
                border: "1px solid var(--line)",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: 13
              }}
            />
          </div>

          <button
            onClick={refreshData}
            disabled={isLoading}
            className="admin-btn"
            style={{ padding: "8px 14px", height: 38, borderRadius: 10 }}
            title="Atualizar dados"
          >
            <RefreshCw size={16} className={isLoading ? "spin" : ""} />
          </button>
        </div>
      </div>

      {/* CONTEÚDO DAS ABAS */}

      {/* ABA 1: SESSÕES & NAVEGADORES */}
      {activeTab === "sessoes" && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Navegador & Sistema</th>
                <th>Cidade / Localização</th>
                <th>Tempo Online</th>
                <th>Último Acesso</th>
                <th>IP</th>
                <th style={{ textAlign: "right" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 30, color: "var(--muted)" }}>
                    Nenhuma sessão encontrada.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((s) => {
                  const isOnline = (Date.now() - new Date(s.ultimo_acesso).getTime()) < 120000;
                  return (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.perfis?.nome || s.perfis?.email || "Visitante"}</strong>
                        <br />
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>
                          {s.perfis?.role === "admin" ? "🛡️ Administrador" : "👤 Usuário"}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: "var(--text)" }}>{s.navegador || "Não identificado"}</span>
                      </td>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
                          📍 {s.cidade || "Local não identificado"}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--blue)", fontWeight: 700 }}>
                          <Clock size={13} /> {formatOnlineDuration(s.online_seconds)}
                        </span>
                      </td>
                      <td>
                        <strong>{getTimeAgo(s.ultimo_acesso)}</strong>
                        <br />
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>{formatDate(s.ultimo_acesso)}</span>
                      </td>
                      <td>
                        <code style={{ fontSize: 12, background: "var(--surface)", padding: "2px 6px", borderRadius: 4 }}>
                          {s.ip || "-"}
                        </code>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 800,
                            background: isOnline ? "rgba(34, 197, 94, 0.15)" : "rgba(156, 163, 175, 0.15)",
                            color: isOnline ? "#22c55e" : "var(--muted)"
                          }}
                        >
                          {isOnline ? "🟢 Online" : "⚪ Offline"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ABA 2: HISTÓRICO DO QUE EDITOU / MEXEU */}
      {activeTab === "auditoria" && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuário / Admin</th>
                <th>Ação Realizada</th>
                <th>Cidade de Origem</th>
                <th>Navegador</th>
                <th>Data e Hora</th>
                <th style={{ textAlign: "right" }}>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 30, color: "var(--muted)" }}>
                    Nenhum registro de auditoria encontrado.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const actionMeta = translateAction(log.acao);
                  const isExpanded = expandedAuditId === log.id;
                  return (
                    <>
                      <tr key={log.id}>
                        <td>
                          <strong>{log.perfis?.nome || log.perfis?.email || "Sistema / Admin"}</strong>
                          <br />
                          <span style={{ fontSize: 11, color: "var(--muted)" }}>{log.perfis?.email || "-"}</span>
                        </td>
                        <td>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 800,
                              background: actionMeta.bg,
                              color: actionMeta.color
                            }}
                          >
                            {actionMeta.label}
                          </span>
                        </td>
                        <td>📍 {log.cidade || "Não identificada"}</td>
                        <td>{log.navegador || "Não informado"}</td>
                        <td>{formatDate(log.created_at)}</td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            onClick={() => setExpandedAuditId(isExpanded ? null : log.id)}
                            className="admin-btn admin-btn-edit"
                            style={{ padding: "4px 10px", borderRadius: 8, fontSize: 12 }}
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Detalhes
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${log.id}-details`} style={{ background: "var(--surface)" }}>
                          <td colSpan={6} style={{ padding: 16 }}>
                            <strong style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase" }}>
                              Payload de Alterações (JSON):
                            </strong>
                            <pre
                              style={{
                                marginTop: 8,
                                padding: 12,
                                borderRadius: 8,
                                background: "var(--bg)",
                                color: "var(--text)",
                                fontSize: 12,
                                overflowX: "auto"
                              }}
                            >
                              {JSON.stringify(log.detalhes || {}, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ABA 3: ALERTAS DE SEGURANÇA MULTIDISPOSITIVO */}
      {activeTab === "alertas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {alerts.length === 0 ? (
            <div className="admin-card" style={{ padding: 30, textAlign: "center", color: "var(--muted)" }}>
              <ShieldCheck size={40} style={{ color: "#22c55e", margin: "0 auto 12px" }} />
              <strong>Nenhum alerta de segurança pendente.</strong>
              <p style={{ fontSize: 13, margin: "4px 0 0" }}>
                Todos os logins recentes de administradores foram verificados com sucesso.
              </p>
            </div>
          ) : (
            alerts.map((alerta) => (
              <div
                key={alerta.id}
                className="admin-card"
                style={{
                  padding: 16,
                  display: "flex",
                  justify: "space-between",
                  alignItems: "center",
                  borderLeft: "4px solid #ef4444"
                }}
              >
                <div>
                  <strong style={{ fontSize: 15, color: "#ef4444", display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertTriangle size={18} /> {alerta.titulo}
                  </strong>
                  <p style={{ margin: "4px 0 6px", fontSize: 14, color: "var(--text)" }}>{alerta.mensagem}</p>
                  <span style={{ fontSize: 12, color: "var(--muted)", display: "flex", gap: 16 }}>
                    <span>📍 Cidade: {alerta.cidade || "N/A"}</span>
                    <span>💻 Navegador: {alerta.navegador || "N/A"}</span>
                    <span>🌐 IP: {alerta.ip || "N/A"}</span>
                    <span>🕒 {formatDate(alerta.created_at)}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
