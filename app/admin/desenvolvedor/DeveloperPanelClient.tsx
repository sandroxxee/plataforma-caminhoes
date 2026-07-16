"use client";

import { useState } from "react";
import { 
  Database, 
  Cpu, 
  Terminal, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Server, 
  Activity,
  Layers,
  Sparkles
} from "lucide-react";
import { 
  testDatabaseAction, 
  testGeminiAction, 
  revalidateAllAction 
} from "../actions";

type EnvStatus = {
  NEXT_PUBLIC_SUPABASE_URL: boolean;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: boolean;
  SUPABASE_SERVICE_ROLE_KEY: boolean;
  GEMINI_API_KEY: boolean;
  NODE_ENV: string;
  NODE_VERSION: string;
};

type Props = {
  envStatus: EnvStatus;
};

export function DeveloperPanelClient({ envStatus }: Props) {
  // Database status
  const [dbStatus, setDbStatus] = useState<{ loading: boolean; success: boolean | null; latency?: number; version?: string; error?: string }>({
    loading: false,
    success: null
  });

  // Gemini status
  const [geminiStatus, setGeminiStatus] = useState<{ loading: boolean; success: boolean | null; latency?: number; response?: string; error?: string }>({
    loading: false,
    success: null
  });

  // Cache status
  const [cacheStatus, setCacheStatus] = useState<{ loading: boolean; success: boolean | null; error?: string }>({
    loading: false,
    success: null
  });

  async function handleTestDb() {
    setDbStatus({ loading: true, success: null });
    const res = await testDatabaseAction();
    if (res.success) {
      setDbStatus({ loading: false, success: true, latency: res.latency, version: res.dbVersion });
    } else {
      setDbStatus({ loading: false, success: false, error: res.error });
    }
  }

  async function handleTestGemini() {
    setGeminiStatus({ loading: true, success: null });
    const res = await testGeminiAction();
    if (res.success) {
      setGeminiStatus({ loading: false, success: true, latency: res.latency, response: res.answer });
    } else {
      setGeminiStatus({ loading: false, success: false, error: res.error });
    }
  }

  async function handleRevalidateCache() {
    setCacheStatus({ loading: true, success: null });
    const res = await revalidateAllAction();
    if (res.success) {
      setCacheStatus({ loading: false, success: true });
      setTimeout(() => setCacheStatus({ loading: false, success: null }), 3000);
    } else {
      setCacheStatus({ loading: false, success: false, error: res.error });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* GRID DE KPIs E DIAGNÓSTICO RÁPIDO */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        
        {/* CARD A: BANCO DE DADOS */}
        <div className="admin-card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 13, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Database size={16} /> Banco de Dados
            </span>
            <Activity size={18} style={{ color: "var(--blue)" }} />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 70 }}>
            {dbStatus.success === true && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#22c55e", fontWeight: 800, fontSize: 14 }}>
                  <CheckCircle2 size={16} /> Conexão Estabelecida
                </div>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>
                  Latência: <strong style={{ color: "var(--text)" }}>{dbStatus.latency}ms</strong>
                </span>
                <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  SGBD: <strong style={{ color: "var(--text)" }}>{dbStatus.version}</strong>
                </span>
              </>
            )}
            {dbStatus.success === false && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#ef4444", fontWeight: 800, fontSize: 14 }}>
                  <XCircle size={16} /> Falha de Conectividade
                </div>
                <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 700, wordBreak: "break-word" }}>
                  {dbStatus.error}
                </span>
              </>
            )}
            {dbStatus.success === null && (
              <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 750 }}>
                Status da conexão com o banco de dados do Supabase.
              </span>
            )}
          </div>

          <button 
            onClick={handleTestDb} 
            disabled={dbStatus.loading}
            className="admin-btn admin-btn-edit" 
            style={{ width: "100%", marginTop: 16, height: 40, borderRadius: 10, justifyContent: "center" }}
          >
            {dbStatus.loading ? (
              <RefreshCw size={15} style={{ animation: "spin 1s linear infinite", marginRight: 8 }} />
            ) : null}
            {dbStatus.loading ? "Testando..." : "Testar Conexão"}
          </button>
        </div>

        {/* CARD B: INTELIGÊNCIA ARTIFICIAL */}
        <div className="admin-card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 13, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Cpu size={16} /> Inteligência Artificial
            </span>
            <Sparkles size={18} style={{ color: "#a855f7" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 70 }}>
            {geminiStatus.success === true && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#22c55e", fontWeight: 800, fontSize: 14 }}>
                  <CheckCircle2 size={16} /> API Gemini Ativa
                </div>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>
                  Modelo: <strong style={{ color: "var(--text)" }}>gemini-2.0-flash</strong>
                </span>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>
                  Latência: <strong style={{ color: "var(--text)" }}>{geminiStatus.latency}ms</strong>
                </span>
              </>
            )}
            {geminiStatus.success === false && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#ef4444", fontWeight: 800, fontSize: 14 }}>
                  <XCircle size={16} /> Falha na Conexão IA
                </div>
                <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 700 }}>
                  {geminiStatus.error}
                </span>
              </>
            )}
            {geminiStatus.success === null && (
              <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 750 }}>
                Status de comunicação com o modelo generativo Gemini da Google.
              </span>
            )}
          </div>

          <button 
            onClick={handleTestGemini} 
            disabled={geminiStatus.loading}
            className="admin-btn admin-btn-edit" 
            style={{ width: "100%", marginTop: 16, height: 40, borderRadius: 10, justifyContent: "center" }}
          >
            {geminiStatus.loading ? (
              <RefreshCw size={15} style={{ animation: "spin 1s linear infinite", marginRight: 8 }} />
            ) : null}
            {geminiStatus.loading ? "Testando..." : "Testar API Gemini"}
          </button>
        </div>

        {/* CARD C: AMBIENTE RUNTIME */}
        <div className="admin-card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ color: "var(--muted)", fontWeight: 800, fontSize: 13, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Server size={16} /> Ambiente de Execução
            </span>
            <Terminal size={18} style={{ color: "var(--muted)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 70 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "var(--muted)", fontWeight: 700 }}>Modo:</span>
              <span style={{ fontWeight: 800, textTransform: "uppercase", color: envStatus.NODE_ENV === "production" ? "#22c55e" : "#f59e0b" }}>
                {envStatus.NODE_ENV}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "var(--muted)", fontWeight: 700 }}>Versão Node.js:</span>
              <span style={{ fontWeight: 800, color: "var(--text)" }}>{envStatus.NODE_VERSION}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "var(--muted)", fontWeight: 700 }}>Tecnologia:</span>
              <span style={{ fontWeight: 800, color: "var(--text)" }}>Next.js (React Server Actions)</span>
            </div>
          </div>

          <div style={{ marginTop: 24, fontSize: 11, color: "var(--muted)", fontWeight: 700, textAlign: "center" }}>
            Servidor respondendo via requisições assíncronas.
          </div>
        </div>

      </div>

      {/* SEÇÃO: VARIÁVEIS DE AMBIENTE */}
      <div className="admin-card" style={{ padding: 22 }}>
        <h3 className="admin-section-title" style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 950, display: "flex", alignItems: "center", gap: 8 }}>
          <Layers size={18} /> Variáveis de Ambiente Clínicas (.env)
        </h3>
        
        <p style={{ margin: "0 0 20px 0", color: "var(--muted)", fontSize: 13, fontWeight: 700, lineHeight: 1.5 }}>
          Esta tabela verifica se as chaves necessárias para a conexão com o Supabase e com os serviços da Google estão cadastradas corretamente nas variáveis do servidor da Vercel ou localmente.
        </p>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Nome da Variável</th>
                <th>Requisito</th>
                <th>Estado do Registro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>NEXT_PUBLIC_SUPABASE_URL</strong></td>
                <td>Conexão do Cliente Supabase</td>
                <td style={{ textAlign: "center" }}>
                  {envStatus.NEXT_PUBLIC_SUPABASE_URL ? (
                    <span className="admin-card-status admin-btn-approve" style={{ padding: "3px 10px", border: 0, textTransform: "none" }}>Preenchida</span>
                  ) : (
                    <span className="admin-card-status admin-btn-reject" style={{ padding: "3px 10px", border: 0, textTransform: "none" }}>Faltando</span>
                  )}
                </td>
              </tr>
              <tr>
                <td><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong></td>
                <td>Autenticação Geral de Cliente</td>
                <td style={{ textAlign: "center" }}>
                  {envStatus.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                    <span className="admin-card-status admin-btn-approve" style={{ padding: "3px 10px", border: 0, textTransform: "none" }}>Preenchida</span>
                  ) : (
                    <span className="admin-card-status admin-btn-reject" style={{ padding: "3px 10px", border: 0, textTransform: "none" }}>Faltando</span>
                  )}
                </td>
              </tr>
              <tr>
                <td><strong>SUPABASE_SERVICE_ROLE_KEY</strong></td>
                <td>Segurança e Bypass de RLS (Admin)</td>
                <td style={{ textAlign: "center" }}>
                  {envStatus.SUPABASE_SERVICE_ROLE_KEY ? (
                    <span className="admin-card-status admin-btn-approve" style={{ padding: "3px 10px", border: 0, textTransform: "none" }}>Preenchida</span>
                  ) : (
                    <span className="admin-card-status admin-btn-reject" style={{ padding: "3px 10px", border: 0, textTransform: "none" }}>Faltando</span>
                  )}
                </td>
              </tr>
              <tr>
                <td><strong>GEMINI_API_KEY</strong></td>
                <td>Geração de Artes e Slogans por IA</td>
                <td style={{ textAlign: "center" }}>
                  {envStatus.GEMINI_API_KEY ? (
                    <span className="admin-card-status admin-btn-approve" style={{ padding: "3px 10px", border: 0, textTransform: "none" }}>Preenchida</span>
                  ) : (
                    <span className="admin-card-status admin-btn-reject" style={{ padding: "3px 10px", border: 0, textTransform: "none" }}>Faltando</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SEÇÃO: FERRAMENTAS DE UTILIDADES */}
      <div className="admin-card" style={{ padding: 22 }}>
        <h3 className="admin-section-title" style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 950, display: "flex", alignItems: "center", gap: 8 }}>
          <RefreshCw size={18} /> Utilitários e Limpeza de Cache (ISR)
        </h3>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, background: "var(--soft)", padding: 18, borderRadius: 12, border: "1px solid var(--line)" }}>
          <div style={{ minWidth: 260, flex: 1 }}>
            <strong style={{ display: "block", fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Limpar Cache Global</strong>
            <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700, lineHeight: 1.4, display: "block" }}>
              Força o Next.js a invalidar o cache estático das rotas públicas (Home, Lista de Caminhões, Páginas de Categoria) na Vercel, fazendo com que novos anúncios apareçam imediatamente para todos os visitantes.
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
            <button 
              onClick={handleRevalidateCache} 
              disabled={cacheStatus.loading}
              className="admin-btn admin-btn-approve"
              style={{ height: 42, padding: "0 22px", borderRadius: 10, fontWeight: 800 }}
            >
              {cacheStatus.loading ? (
                <RefreshCw size={14} style={{ animation: "spin 1s linear infinite", marginRight: 8 }} />
              ) : null}
              {cacheStatus.loading ? "Limpando..." : "Forçar Revalidação"}
            </button>
            
            {cacheStatus.success && (
              <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 800 }}>Cache limpo com sucesso!</span>
            )}
            {cacheStatus.error && (
              <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 800 }}>Erro: {cacheStatus.error}</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
