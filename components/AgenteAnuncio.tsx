"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type Msg = { role: "agente" | "user"; texto: string };

function renderMd(texto: string) {
  return texto
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#3b82f6;text-decoration:underline">$1</a>')
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
}

export function AgenteAnuncio() {
  const [msgs, setMsgs]         = useState<Msg[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [etapa, setEtapa]       = useState("");
  const [dados, setDados]       = useState<Record<string, string>>({});
  const [finalizado, setFinal]  = useState(false);
  const [truckId, setTruckId]   = useState<string | null>(null);
  const [fotos, setFotos]       = useState<File[]>([]);
  const [preview, setPreview]   = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  const addMsg = (role: "agente" | "user", texto: string) =>
    setMsgs(m => [...m, { role, texto }]);

  const chamarAPI = useCallback(async (
    mensagem: string,
    dadosAtual: Record<string, string>,
    etapaAtual: string,
    qtdFotos = 0,
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/agente-anuncio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem, dados: dadosAtual, etapa: etapaAtual, qtdFotos }),
      });
      const json = await res.json();
      if (json.resposta) addMsg("agente", json.resposta);
      if (json.respostaFotos) addMsg("agente", json.respostaFotos);
      setEtapa(json.etapa || "");
      setDados(json.dados || {});
      if (json.etapa === "finalizado") {
        setFinal(true);
        if (json.truckId) setTruckId(json.truckId);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Iniciar conversa
  useEffect(() => { chamarAPI("", {}, ""); }, [chamarAPI]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  // Upload de fotos para o storage antes de criar o anuncio
  const uploadFotos = async (trId: string) => {
    if (!fotos.length) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("truckId", trId);
    fotos.forEach(f => fd.append("fotos", f));
    await fetch("/api/agente-anuncio/upload", { method: "POST", body: fd });
    setUploading(false);
  };

  const enviar = async () => {
    if (!input.trim() || loading || finalizado) return;
    const texto = input.trim();
    setInput("");
    addMsg("user", texto);

    // Interceptar "publicar" para fazer upload das fotos antes
    if (etapa === "confirmar" && ["publicar","sim","s","ok","confirmar","enviar"].includes(texto.toLowerCase().trim())) {
      setLoading(true);
      // 1. Criar anuncio
      const res = await fetch("/api/agente-anuncio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: texto, dados, etapa, qtdFotos: fotos.length }),
      });
      const json = await res.json();
      // 2. Upload das fotos se anuncio foi criado
      if (json.truckId) {
        setTruckId(json.truckId);
        await uploadFotos(json.truckId);
      }
      if (json.resposta) addMsg("agente", json.resposta);
      setEtapa(json.etapa || "");
      setDados(json.dados || {});
      if (json.etapa === "finalizado") setFinal(true);
      setLoading(false);
      return;
    }

    await chamarAPI(texto, dados, etapa, fotos.length);
  };

  const handleFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setFotos(prev => [...prev, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreview(prev => [...prev, ...newPreviews]);
  };

  const removerFoto = (idx: number) => {
    setFotos(prev => prev.filter((_, i) => i !== idx));
    setPreview(prev => prev.filter((_, i) => i !== idx));
  };

  const continuarFotos = async () => {
    await chamarAPI("", dados, "fotos", fotos.length);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "calc(100vh - 120px)", maxWidth: 680,
      margin: "0 auto", background: "#fff",
      borderRadius: 16, boxShadow: "0 4px 32px rgba(0,0,0,.1)",
      overflow: "hidden", border: "1px solid #e5e7eb",
    }}>
      {/* Header */}
      <div style={{ background: "#1d4ed8", color: "white", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24 }}>&#x1F69B;</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Assistente de Anuncio</div>
          <div style={{ fontSize: 12, opacity: .8 }}>Responda as perguntas e crie seu anuncio</div>
        </div>
      </div>

      {/* Mensagens */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "82%",
              background: m.role === "user" ? "#1d4ed8" : "#f3f4f6",
              color: m.role === "user" ? "white" : "#111",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "10px 14px",
              fontSize: 14,
              lineHeight: 1.55,
            }}
              dangerouslySetInnerHTML={{ __html: renderMd(m.texto) }}
            />
          </div>
        ))}

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

        {/* Etapa de fotos */}
        {etapa === "fotos" && !finalizado && (
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontWeight: 700, color: "#0369a1", fontSize: 14 }}>Fotos do veiculo</div>
            {preview.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {preview.map((src, i) => (
                  <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
                    <img src={src} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
                    <button onClick={() => removerFoto(i)} style={{
                      position: "absolute", top: -6, right: -6,
                      background: "#ef4444", color: "white", border: "none",
                      borderRadius: "50%", width: 20, height: 20, cursor: "pointer",
                      fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>x</button>
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
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFotos} style={{ display: "none" }} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!finalizado && etapa !== "fotos" && (
        <div style={{ padding: "10px 12px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 8 }}>
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
            fontWeight: 700, fontSize: 14, transition: "background .15s",
          }}>Enviar</button>
        </div>
      )}

      {finalizado && (
        <div style={{ padding: 16, borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
          <a href="/painel" style={{
            display: "inline-block", background: "#1d4ed8", color: "white",
            borderRadius: 24, padding: "10px 28px", textDecoration: "none",
            fontWeight: 700, fontSize: 14,
          }}>Ver meus anuncios</a>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
