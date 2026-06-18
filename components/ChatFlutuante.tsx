'use client';
import React, { useState, useEffect, useRef, FormEvent } from 'react';

interface Mensagem {
  enviadoPor: 'user' | 'bot';
  texto: string;
}

interface DadosColetados {
  etapa1_cadastro: string | null;
  etapa2_intencao: string | null;
  etapa3_veiculo: string | null;
  etapa4_valores: string | null;
}

export default function ChatFlutuante() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [mensagensTela, setMensagensTela] = useState<Mensagem[]>([
    { enviadoPor: 'bot', texto: 'Olá! Sou o assistente virtual. Vou te ajudar a criar um anúncio rapidinho. Pode começar!' }
  ]);
  const [historicoApi, setHistoricoApi] = useState<Record<string, unknown>[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [confirmacaoFinal, setConfirmacaoFinal] = useState(false);
  const [dadosColetados, setDadosColetados] = useState<DadosColetados>({
    etapa1_cadastro: null,
    etapa2_intencao: null,
    etapa3_veiculo: null,
    etapa4_valores: null
  });
  const finalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const abrir = () => setIsOpen(true);
    window.addEventListener('abrir-chat-gemini', abrir);
    return () => window.removeEventListener('abrir-chat-gemini', abrir);
  }, []);

  useEffect(() => {
    finalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagensTela]);

  const enviarMensagem = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || carregando) return;
    const mensagemUsuario = input;
    setInput('');
    setMensagensTela(prev => [...prev, { enviadoPor: 'user', texto: mensagemUsuario }]);
    setCarregando(true);
    try {
      const res = await fetch('/api/anunciar-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: mensagemUsuario, historico: historicoApi, dadosColetados })
      });
      const dados = await res.json() as { textoBot?: string; historicoAtualizado?: Record<string, unknown>[]; };
      if (dados.textoBot) {
        setMensagensTela(prev => [...prev, { enviadoPor: 'bot', texto: dados.textoBot! }]);
        setHistoricoApi(dados.historicoAtualizado ?? []);
        if (dados.textoBot.toLowerCase().includes('confirma a publica')) {
          setConfirmacaoFinal(true);
        }
      }
    } catch {
      setMensagensTela(prev => [...prev, { enviadoPor: 'bot', texto: 'Ops, tive um problema técnico. Tente novamente.' }]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <style>{`
        .cf-wrap { position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: inherit; }
        .cf-btn {
          width: 56px; height: 56px; border-radius: 50%;
          background: #18181b; border: 1px solid #3f3f46;
          box-shadow: 0 8px 32px rgba(0,0,0,.28);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #fff; transition: background .2s, transform .2s;
        }
        .cf-btn:hover { background: #27272a; transform: scale(1.07); }
        .cf-box {
          position: absolute; bottom: 68px; right: 0;
          width: 340px; height: 500px;
          background: #fff; border-radius: 20px;
          border: 1px solid #e4e4e7;
          box-shadow: 0 16px 48px rgba(0,0,0,.18);
          display: flex; flex-direction: column; overflow: hidden;
        }
        .cf-header {
          background: #18181b; color: #fff;
          padding: 14px 16px;
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .cf-header-title { font-size: 14px; font-weight: 700; margin: 0 0 2px; }
        .cf-header-status { font-size: 11px; color: #a1a1aa; display: flex; align-items: center; gap: 5px; }
        .cf-dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; display: inline-block; animation: cf-pulse 1.5s infinite; }
        @keyframes cf-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .cf-badge { font-size: 11px; background: #059669; color: #fff; padding: 3px 10px; border-radius: 999px; }
        .cf-msgs { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; background: #fafafa; }
        .cf-msg { display: flex; }
        .cf-msg.user { justify-content: flex-end; }
        .cf-msg.bot { justify-content: flex-start; }
        .cf-bubble {
          max-width: 82%; padding: 10px 14px;
          font-size: 13px; line-height: 1.55;
          border-radius: 16px;
        }
        .cf-msg.user .cf-bubble { background: #18181b; color: #fff; border-top-right-radius: 4px; }
        .cf-msg.bot .cf-bubble { background: #fff; color: #18181b; border: 1px solid #e4e4e7; border-top-left-radius: 4px; }
        .cf-typing { display: flex; gap: 4px; align-items: center; padding: 10px 14px; background: #fff; border: 1px solid #e4e4e7; border-radius: 16px; border-top-left-radius: 4px; }
        .cf-dot-t { width: 6px; height: 6px; border-radius: 50%; background: #a1a1aa; animation: cf-bounce .8s infinite; }
        .cf-dot-t:nth-child(2) { animation-delay: .15s; }
        .cf-dot-t:nth-child(3) { animation-delay: .3s; }
        @keyframes cf-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .cf-form { display: flex; gap: 8px; padding: 10px 12px; background: #fff; border-top: 1px solid #f0f0f0; flex-shrink: 0; }
        .cf-input {
          flex: 1; height: 38px; border-radius: 12px;
          border: 1.5px solid #e4e4e7; background: #f4f4f5;
          padding: 0 14px; font-size: 13px; color: #18181b;
          outline: none; transition: border-color .2s, background .2s;
        }
        .cf-input:focus { border-color: #18181b; background: #fff; }
        .cf-send {
          width: 38px; height: 38px; border-radius: 12px;
          background: #18181b; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #fff; transition: background .2s; flex-shrink: 0;
        }
        .cf-send:hover { background: #27272a; }
        .cf-send:disabled { opacity: .35; cursor: not-allowed; }
        @media (max-width: 480px) {
          .cf-box { width: calc(100vw - 32px); right: -8px; }
          .cf-wrap { bottom: 16px; right: 16px; }
        }
      `}</style>

      <div className="cf-wrap">
        <button className="cf-btn" onClick={() => setIsOpen(v => !v)} aria-label={isOpen ? 'Fechar chat' : 'Abrir assistente'}>
          {isOpen ? (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-1.648 0-3.255.075-4.842.222-1.584.233-2.707 1.626-2.707 3.228v5.53z"/></svg>
          )}
        </button>

        {isOpen && (
          <div className="cf-box">
            <div className="cf-header">
              <div>
                <p className="cf-header-title">Assistente Virtual</p>
                <span className="cf-header-status"><span className="cf-dot" />Online agora</span>
              </div>
              {confirmacaoFinal && <span className="cf-badge">Pronto para publicar</span>}
            </div>

            <div className="cf-msgs">
              {mensagensTela.map((msg, i) => (
                <div key={i} className={`cf-msg ${msg.enviadoPor}`}>
                  <div className="cf-bubble">{msg.texto}</div>
                </div>
              ))}
              {carregando && (
                <div className="cf-msg bot">
                  <div className="cf-typing">
                    <span className="cf-dot-t" />
                    <span className="cf-dot-t" />
                    <span className="cf-dot-t" />
                  </div>
                </div>
              )}
              <div ref={finalRef} />
            </div>

            <form className="cf-form" onSubmit={enviarMensagem}>
              <input
                className="cf-input"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                autoComplete="off"
              />
              <button className="cf-send" type="submit" disabled={!input.trim() || carregando}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12zm0 0h7.5"/></svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
