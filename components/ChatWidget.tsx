"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mensagem = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
};

type Props = {
  truckId: string;
  truckTitulo: string;
  vendedorId: string;
  compradorId?: string;
};

export function ChatWidget({ truckId, truckTitulo, vendedorId, compradorId }: Props) {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [naoLidas, setNaoLidas] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const ehVendedor = userId === vendedorId;
  const outraParteId = ehVendedor ? compradorId : vendedorId;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!userId || !aberto) return;
    carregarMensagens();
    const canal = supabase
      .channel(`chat:${truckId}:${[vendedorId, compradorId ?? userId].sort().join(":")}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
        const nova = payload.new as Mensagem;
        if (nova.truck_id === truckId) {
          setMensagens((prev) => [...prev, nova]);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(canal); };
  }, [userId, aberto]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function carregarMensagens() {
    const parteA = userId!;
    const parteB = outraParteId ?? userId!;
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("truck_id", truckId)
      .or(`and(sender_id.eq.${parteA},receiver_id.eq.${parteB}),and(sender_id.eq.${parteB},receiver_id.eq.${parteA})`)
      .order("created_at", { ascending: true });
    setMensagens(data ?? []);
    setNaoLidas(0);
  }

  async function enviar() {
    if (!texto.trim() || !userId || enviando) return;
    setEnviando(true);
    const receiver = outraParteId ?? vendedorId;
    await supabase.from("chat_messages").insert({
      truck_id: truckId,
      sender_id: userId,
      receiver_id: receiver,
      content: texto.trim(),
    });
    setTexto("");
    setEnviando(false);
  }

  if (!userId || userId === vendedorId && !compradorId) return null;

  return (
    <>
      {/* Botão flutuante */}
      {!aberto && (
        <button className="chat-fab" onClick={() => setAberto(true)} aria-label="Abrir chat">
          <MessageCircle size={22} />
          {naoLidas > 0 && <span className="chat-badge">{naoLidas}</span>}
        </button>
      )}

      {/* Janela do chat */}
      {aberto && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <MessageCircle size={16} />
              <span>{truckTitulo.slice(0, 32)}{truckTitulo.length > 32 ? "..." : ""}</span>
            </div>
            <button onClick={() => setAberto(false)} className="chat-close">
              <X size={16} />
            </button>
          </div>

          <div className="chat-body">
            {mensagens.length === 0 && (
              <div className="chat-empty">
                <MessageCircle size={28} />
                <span>Nenhuma mensagem ainda.<br />Diga olá ao {ehVendedor ? "comprador" : "vendedor"}!</span>
              </div>
            )}
            {mensagens.map((m) => (
              <div key={m.id} className={`chat-msg ${m.sender_id === userId ? "minha" : "dele"}`}>
                <span>{m.content}</span>
                <small>{new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</small>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="chat-footer">
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && enviar()}
              placeholder="Digite uma mensagem..."
              className="chat-input"
              maxLength={500}
            />
            <button onClick={enviar} disabled={enviando || !texto.trim()} className="chat-send">
              {enviando ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .chat-fab {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #2563eb;
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(37,99,235,.4);
          z-index: 900;
          transition: background 0.15s;
        }
        .chat-fab:hover { background: #1d4ed8; }
        .chat-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-window {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 320px;
          height: 420px;
          border-radius: 16px;
          background: #1f2327;
          border: 1px solid #343a40;
          box-shadow: 0 16px 48px rgba(0,0,0,.4);
          display: flex;
          flex-direction: column;
          z-index: 900;
          overflow: hidden;
        }
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: #2563eb;
          color: #fff;
        }
        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
        }
        .chat-close {
          background: rgba(255,255,255,.15);
          border: none;
          border-radius: 6px;
          padding: 4px;
          cursor: pointer;
          color: #fff;
          display: flex;
          align-items: center;
        }
        .chat-body {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .chat-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #6b7280;
          font-size: 13px;
          text-align: center;
          padding: 20px;
        }
        .chat-msg {
          max-width: 80%;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 13px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .chat-msg.minha {
          align-self: flex-end;
          background: #2563eb;
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .chat-msg.dele {
          align-self: flex-start;
          background: #2a2f34;
          color: #e8eaed;
          border-bottom-left-radius: 4px;
        }
        .chat-msg small { font-size: 10px; opacity: 0.7; }
        .chat-footer {
          display: flex;
          gap: 8px;
          padding: 10px 12px;
          border-top: 1px solid #343a40;
        }
        .chat-input {
          flex: 1;
          height: 38px;
          border-radius: 10px;
          border: 1px solid #343a40;
          background: #15181b;
          color: #e8eaed;
          padding: 0 10px;
          font-size: 13px;
          outline: none;
        }
        .chat-input:focus { border-color: #2563eb; }
        .chat-send {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #2563eb;
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          .chat-window { width: calc(100vw - 32px); right: 16px; bottom: 72px; }
        }
      `}</style>
    </>
  );
}
