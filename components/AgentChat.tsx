"use client";
import { useState, useRef, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
type Role = "agente" | "user";
type Msg  = { role: Role; texto: string; fotos?: string[] };
type Dados = Record<string, string | string[]>;

export type AgentChatVariant = "anuncio" | "publico";

interface AgentChatProps {
  /** "anuncio" = usuário logado, cria anúncio direto.
   *  "publico" = visitante, envia para aprovação. */
  variant: AgentChatVariant;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function renderMd(texto: string) {
  return texto
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#3b82f6;text-decoration:underline">$1</a>')
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export function AgentChat({ variant }: AgentChatProps) {
  const apiBase     = variant === "anuncio" ? "/api/agente-anuncio" : "/api/agente-publico";
  const uploadPath  = variant === "anuncio" ? "/api/agente-anuncio/upload" : "/api/agente-publico/upload";
  const etapaInicial = variant === "anuncio" ? "" : "inicio";
  const msgInicial   = variant === "anuncio" ? "" : "__inicio__";

  const [msgs, setMsgs]           = useState<Msg[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [etapa, setEtapa]         = useState(etapaInicial);
  const [dados, setDados]         = useState<Dados>({});
  const [finalizado, setFinal]    = useState(false);
  const [truckId, setTruckId]     = useState<string | null>(null);
  const [fotos, setFotos]         = useState<File[]>([]);
  const [fotosUrls, setFotosUrls] = useState<string[]>([]);
  const [preview, setPreview]     = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  const addMsg = (role: Role, texto: string, fotos?: string[]) =>
    setMsgs(m => [...m, { role, texto, fotos }]);

  // ---- Chamada à API -------------------------------------------------------
  const chamarAPI = useCallback(async (
    mensagem: string,
    dadosAtual: Dados,
    etapaAtual: string,
    qtdFotos = 0,
  ) => {
    setLoading(true);
    try {
      const res  = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem, dados: dadosAtual, etapa: etapaAtual, qtdFotos }),
      });
      const json = await res.json();
      if (json.resposta)      addMsg("agente", json.resposta);
      if (json.respostaFotos) addMsg("agente", json.respostaFotos);
      setEtapa(json.etapa  ?? etapaAtual);
      setDados(json.dados  ?? dadosAtual);
      if (json.etapa === "finalizado") {
        setFinal(true);
        if (json.truckId) setTruckId(json.truckId);
      }
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  // Iniciar conversa
  useEffect(() => { chamarAPI(msgInicial, {}, etapaInicial); }, [chamarAPI]); // eslint-disable-line

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  // ---- Upload de fotos (variante anuncio — upload após confirmar) ----------
  const uploadFotosAnuncio = async (trId: string) => {
    if (!fotos.length) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("truckId", trId);
    fotos.forEach(f => fd.append("fotos", f));
    await fetch(uploadPath, { method: "POST", body: fd });
    setUploading(false);
  };

  // ---- Upload de fotos (variante publico — upload imediato) ---------------
  const handleFotosPublico = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = Array.from(e.target.files || []);
    if (!arquivos.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const arquivo of arquivos) {
      const fd = new FormData();
      fd.append("file", arquivo);
      try {
        const res  = await fetch(uploadPath, { method: "POST", body: fd });
        const json = await res.json();
        if (json.url) urls.push(json.url);
      } catch { console.error("Erro upload foto"); }
    }
    const novasUrls = [...fotosUrls, ...urls];
    setFotosUrls(novasUrls);
    setUploading(false);
    addMsg("user", `${arquivos.length} foto(s) enviada(s)`, urls);
    await chamarAPI(
      `fotos_enviadas:${urls.join(",")}`,
      { ...dados, fotos: novasUrls },
      etapa,
    );
  };

  // ---- Upload de fotos (variante anuncio — seleção local) -----------------
  const handleFotosAnuncio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setFotos(prev => [...prev, ...files]);
    setPreview(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removerFoto = (idx: number) => {
    setFotos(prev  => prev.filter((_, i) => i !== idx));
    setPreview(prev => prev.filter((_, i) => i !== idx));
  };

  const continuarFotos = async () => {
    await chamarAPI("", dados, "fotos", fotos.length);
  };

  // ---- Enviar mensagem -----------------------------------------------------
  const enviar = async () => {
    if (!input.trim() || loading || finalizado) return;
    const texto = input.trim();
    setInput("");
    addMsg("user", texto);

    // Variante anuncio: interceptar confirmação para fazer upload das fotos
    if (
      variant === "anuncio" &&
      etapa === "confirmar" &&
      ["publicar","sim","s","ok","confirmar","enviar"].includes(texto.toLowerCase())
    ) {
      setLoading(true);
      const res  = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: texto, dados, etapa, qtdFotos: fotos.length }),
      });
      const json = await res.json();
      if (json.truckId) {
        setTruckId(json.truckId);
        await uploadFotosAnuncio(json.truckId);
      }
      if (json.resposta) addMsg("agente", json.resposta);
      setEtapa(json.etapa ?? etapa);
      setDados(json.dados ?? dados);
      if (json.etapa === "finalizado") setFinal(true);
      setLoading(false);
      return;
    }

    await chamarAPI(texto, dados, etapa, fotos.length);
  };

  // ---- Render --------------------------------------------------------------
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: variant === "anuncio" ? "calc(100vh - 120px)" : "100vh",
      maxWidth: variant === "anuncio" ? 680 : undefined,
      margin: variant === "anuncio" ? "0 auto" : undefined,
      background: "#fff",
      borderRadius: variant === "anuncio" ? 16 : 0,
      boxShadow: variant === "anuncio" ? "0 4px 32px rgba(0,0,0,.1)" : undefined,
      overflow: "hidden",
      border: variant === "anuncio" ? "1px solid #e5e7eb" : undefined,
    }}>

      {/* Header */}
      <div style={{ background: "#1d4ed8", color: "white", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24 }}>🚛</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Assistente de Anúncio</div>
          <div style={{ fontSize: 12, opacity: .8 }}>
            {variant === "anuncio" ? "Responda as perguntas e crie seu anúncio" : "Caminhões à Venda"}
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div
              style={{
                maxWidth: "82%",
                background: m.role === "user" ? "#1d4ed8" : "#f3f4f6",
                color:      m.role === "user" ? "white"   : "#111",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "10px 14px", fontSize: 14, lineHeight: 1.55,
              }}
              dangerouslySetInnerHTML={{ __html: renderMd(m.texto) }}
            />
          </div>
        ))}

        {/* Indicador de digitando */}
        {loading && (
          <div style={{ display: "flex", gap: 5, padding: "8px 14px", background: "#f3f4f6", borderRadius: 12, width: "fit-content" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%", background: "#9ca3af",
                animation: `bounce 1.2s ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}

        {/* Etapa de fotos — variante anuncio */}
        {variant === "anuncio" && etapa === "fotos" && !finalizado && (
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontWeight: 700, color: "#0369a1", fontSize: 14 }}>Fotos do veículo</div>
            {preview.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {preview.map((src, i) => (
                  <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
                    <img src={src} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
                    <button onClick={() => removerFoto(i)} style={{
                      position: "absolute", top: -6, right: -6,
                      background: "#ef4444", color: "white", border: "none",
                      borderRadius: "50%", width: 20, height: 20, cursor: "pointer",
                      fontSize: 12,
                    }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => fileRef.current?.click()} style={{
                background: "#0369a1", color: "white", border: "none",
                borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
              }}>+ Adicionar fotos</button>
              {fotos.length > 0 && (
                <button onClick={continuarFotos} disabled={loading} style={{
                  background: "#16a34a", color: "white", border: "none",
                  borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
                }}>Continuar com {fotos.length} foto(s)</button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFotosAnuncio} style={{ display: "none" }} />
          </div>
        )}

        {/* Etapa de fotos — variante publico */}
        {variant === "publico" && etapa === "fotos" && !finalizado && (
          <div style={{ marginBottom: 8 }}>
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
              width: "100%", border: "2px dashed #93c5fd", borderRadius: 12,
              padding: "12px 0", color: "#1d4ed8", background: "transparent",
              fontSize: 14, cursor: uploading ? "not-allowed" : "pointer",
            }}>
              {uploading ? "Enviando fotos..." : "📷 Adicionar fotos do veículo"}
            </button>
            <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleFotosPublico} />
            {fotosUrls.length > 0 && <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{fotosUrls.length} foto(s) enviada(s)</p>}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Concluído — variante publico */}
      {variant === "publico" && finalizado && (
        <div style={{ padding: 16 }}>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <p style={{ fontWeight: 700, color: "#166534", marginBottom: 8 }}>Anúncio enviado para aprovação!</p>
            <p style={{ fontSize: 13, color: "#15803d", marginBottom: 16 }}>Crie uma conta para acompanhar e receber contatos.</p>
            <a href="/cadastro" style={{
              display: "inline-block", background: "#1d4ed8", color: "white",
              borderRadius: 24, padding: "10px 24px", textDecoration: "none",
              fontWeight: 700, fontSize: 14,
            }}>Criar conta grátis</a>
          </div>
        </div>
      )}

      {/* Concluído — variante anuncio */}
      {variant === "anuncio" && finalizado && (
        <div style={{ padding: 16, borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
          <a href="/painel" style={{
            display: "inline-block", background: "#1d4ed8", color: "white",
            borderRadius: 24, padding: "10px 28px", textDecoration: "none",
            fontWeight: 700, fontSize: 14,
          }}>Ver meus anúncios</a>
        </div>
      )}

      {/* Input */}
      {!finalizado && !(etapa === "fotos" && variant === "publico") && etapa !== "fotos" || (!finalizado && etapa !== "fotos") ? (
        !finalizado && etapa !== "fotos" ? (
          <div style={{ padding: "10px 12px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 8, background: "#fff" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), enviar())}
              placeholder="Digite sua resposta..."
              disabled={loading}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 24,
                border: "1px solid #d1d5db", fontSize: 14, outline: "none",
                background: loading ? "#f9fafb" : "white",
              }}
            />
            <button onClick={enviar} disabled={loading || !input.trim()} style={{
              background: loading || !input.trim() ? "#d1d5db" : "#1d4ed8",
              color: "white", border: "none", borderRadius: 24,
              padding: "10px 18px", cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700, fontSize: 14,
            }}>Enviar</button>
          </div>
        ) : null
      ) : null}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

export default AgentChat;
