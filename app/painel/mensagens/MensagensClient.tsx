"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Send, 
  MessageSquare, 
  User, 
  Clock, 
  Truck,
  CheckCircle,
  AlertCircle
} from "lucide-react";

type Conversation = {
  id: string;
  created_at: string;
  last_message_at: string;
  ad_id: string;
  buyer_id: string;
  seller_id: string;
  trucks?: {
    titulo: string;
    preco: number;
    perfil: string;
  } | null;
};

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

type Props = {
  userId: string;
  initialConversations: Conversation[];
  activeChatId?: string | null;
};

export function MensagensClient({ userId, initialConversations, activeChatId }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(activeChatId || null);

  useEffect(() => {
    if (activeChatId) {
      setSelectedId(activeChatId);
    }
  }, [activeChatId]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Carrega mensagens quando uma conversa é selecionada
  useEffect(() => {
    if (!selectedId) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
        setTimeout(scrollToBottom, 50);
      }
      setLoadingMessages(false);
    };

    fetchMessages();

    // 🔥 Inscreve no canal de tempo real para novas mensagens desta conversa
    const channel = supabase
      .channel(`chat:${selectedId}`)
      .on(
        "postgres_changes" as any,
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          // Evita duplicar se o remetente já adicionou localmente
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          setTimeout(scrollToBottom, 50);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedId]);

  // Ouvir novas conversas ou atualizações globais de mensagens
  useEffect(() => {
    const globalChannel = supabase
      .channel("global_conversations")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
        },
        (payload) => {
          const updatedConv = payload.new as Conversation;
          setConversations((prev) => 
            prev.map((c) => c.id === updatedConv.id ? { ...c, last_message_at: updatedConv.last_message_at } : c)
                .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(globalChannel);
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedId || sending) return;

    const messageText = inputText.trim();
    setInputText("");
    setSending(true);

    // Otimista: cria e insere a mensagem localmente na tela antes da confirmação do banco
    const tempId = crypto.randomUUID();
    const tempMsg: Message = {
      id: tempId,
      conversation_id: selectedId,
      sender_id: userId,
      content: messageText,
      is_read: false,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMsg]);
    setTimeout(scrollToBottom, 50);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: selectedId,
        sender_id: userId,
        content: messageText,
      })
      .select()
      .single();

    if (!error && data) {
      // Substitui o placeholder temporário pelo registro real do Supabase
      setMessages((prev) => prev.map((m) => m.id === tempId ? data : m));
      
      // Atualiza last_message_at na tabela de conversas
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", selectedId);
    } else {
      // Caso dê erro, remove a mensagem da tela
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      alert("Falha ao enviar mensagem. Tente novamente.");
    }
    setSending(false);
  };

  const selectedConversation = conversations.find(c => c.id === selectedId);

  return (
    <div className="chat-wrapper" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", minHeight: "600px", height: "calc(100vh - 240px)" }}>
      
      {/* PAINEL LATERAL: LISTA DE CONVERSAS */}
      <div className="chat-sidebar" style={{ borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", background: "var(--soft)" }}>
        <div style={{ padding: 16, borderBottom: "1px solid var(--line)" }}>
          <strong style={{ fontSize: 16, fontWeight: 900, color: "var(--text)" }}>Conversas Recentes</strong>
        </div>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {conversations.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
              <MessageSquare size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              Nenhuma conversa iniciada.
            </div>
          ) : (
            conversations.map((conv) => {
              const active = conv.id === selectedId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    padding: "14px 16px",
                    textAlign: "left",
                    background: active ? "var(--blueSoft)" : "transparent",
                    border: 0,
                    borderBottom: "1px solid var(--line)",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    width: "100%"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Truck size={14} style={{ color: "var(--blue)", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 900, color: active ? "var(--blue)" : "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {conv.trucks?.titulo || "Veículo não especificado"}
                    </span>
                  </div>
                  
                  {conv.trucks?.preco && (
                    <span style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>
                      R$ {Number(conv.trucks.preco).toLocaleString("pt-BR")}
                    </span>
                  )}
                  
                  <span style={{ fontSize: 10, color: "var(--muted)", alignSelf: "flex-end", display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={10} />
                    {new Date(conv.last_message_at).toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ÁREA CENTRAL: CHAT BOX */}
      <div className="chat-main" style={{ display: "flex", flexDirection: "column", background: "var(--surface)" }}>
        {selectedId ? (
          <>
            {/* Header da conversa ativa */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--soft)" }}>
              <div>
                <strong style={{ display: "block", fontSize: 14, fontWeight: 900, color: "var(--text)" }}>
                  {selectedConversation?.trucks?.titulo}
                </strong>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>
                  Interesse no veículo • R$ {selectedConversation?.trucks?.preco?.toLocaleString("pt-BR")}
                </span>
              </div>
            </div>

            {/* Balão de mensagens */}
            <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12, background: "var(--surface)" }}>
              {loadingMessages ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--muted)" }}>
                  Carregando histórico...
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender_id === userId;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        justifyContent: isMine ? "flex-end" : "flex-start",
                        width: "100%"
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "70%",
                          padding: "10px 14px",
                          borderRadius: 14,
                          background: isMine ? "var(--blue)" : "var(--soft)",
                          color: isMine ? "#ffffff" : "var(--text)",
                          border: isMine ? "none" : "1px solid var(--line)",
                          fontSize: 13,
                          fontWeight: 700,
                          lineHeight: 1.4
                        }}
                      >
                        <div>{msg.content}</div>
                        <span style={{ display: "block", fontSize: 9, opacity: 0.7, textAlign: "right", marginTop: 4 }}>
                          {new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de envio */}
            <form onSubmit={handleSendMessage} style={{ padding: 16, borderTop: "1px solid var(--line)", display: "flex", gap: 10, background: "var(--soft)" }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escreva sua mensagem..."
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid var(--line)",
                  padding: "0 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  outline: "none",
                  background: "var(--surface)",
                  color: "var(--text)"
                }}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="admin-btn admin-btn-approve"
                style={{
                  height: 44,
                  width: 44,
                  padding: 0,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 32, textAlign: "center", color: "var(--muted)" }}>
            <MessageSquare size={48} style={{ color: "var(--blue)", marginBottom: 16, opacity: 0.6 }} />
            <strong style={{ fontSize: 16, color: "var(--text)" }}>Selecione um chat para ver as mensagens</strong>
            <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 700 }}>
              Aqui você pode responder potenciais compradores ou negociar caminhões.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
