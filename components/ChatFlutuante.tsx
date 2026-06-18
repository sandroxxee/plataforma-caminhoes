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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [mensagensTela, setMensagensTela] = useState<Mensagem[]>([
    { enviadoPor: 'bot', texto: 'Ola! Sou seu assistente virtual. Vou te ajudar a criar um anuncio. Como posso ajudar hoje?' }
  ]);
  const [historicoApi, setHistoricoApi] = useState<Record<string, unknown>[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [confirmacaoFinal, setConfirmacaoFinal] = useState<boolean>(false);
  const [dadosColetados, setDadosColetados] = useState<DadosColetados>({
    etapa1_cadastro: null,
    etapa2_intencao: null,
    etapa3_veiculo: null,
    etapa4_valores: null
  });

  const finalDasMensagensRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const abrirChat = () => setIsOpen(true);
    window.addEventListener('abrir-chat-gemini', abrirChat);
    return () => window.removeEventListener('abrir-chat-gemini', abrirChat);
  }, []);

  useEffect(() => {
    finalDasMensagensRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        body: JSON.stringify({
          mensagem: mensagemUsuario,
          historico: historicoApi,
          dadosColetados
        })
      });

      const dados = await res.json() as {
        textoBot?: string;
        historicoAtualizado?: Record<string, unknown>[];
        error?: string;
      };

      if (dados.textoBot) {
        setMensagensTela(prev => [...prev, { enviadoPor: 'bot', texto: dados.textoBot! }]);
        setHistoricoApi(dados.historicoAtualizado ?? []);

        if (dados.textoBot.toLowerCase().includes('confirma a publica')) {
          setConfirmacaoFinal(true);
          console.log('Etapa de confirmacao final atingida. Dados:', dadosColetados);
        }
      }
    } catch (erro) {
      console.error('Erro no chat:', erro);
      setMensagensTela(prev => [...prev, { enviadoPor: 'bot', texto: 'Ops, tive um problema tecnico. Pode tentar novamente?' }]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-zinc-900 hover:bg-zinc-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center border border-zinc-700"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-1.648 0-3.255.075-4.842.222-1.584.233-2.707 1.626-2.707 3.228v5.53z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[330px] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-zinc-100 flex flex-col overflow-hidden">
          <div className="bg-zinc-900 text-white p-4 flex items-center justify-between border-b border-zinc-800">
            <div>
              <h3 className="font-semibold text-sm tracking-wide">Assistente Virtual</h3>
              <p className="text-xs text-zinc-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Online agora
              </p>
            </div>
            {confirmacaoFinal && (
              <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full">Pronto para publicar</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50/50">
            {mensagensTela.map((msg, index) => (
              <div key={index} className={`flex ${msg.enviadoPor === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm leading-relaxed ${
                  msg.enviadoPor === 'user'
                    ? 'bg-zinc-900 text-white rounded-2xl rounded-tr-none shadow-sm'
                    : 'bg-white text-zinc-800 rounded-2xl rounded-tl-none border border-zinc-200 shadow-sm'
                }`}>
                  {msg.texto}
                </div>
              </div>
            ))}
            {carregando && (
              <div className="flex justify-start">
                <div className="bg-white text-zinc-400 border border-zinc-200 px-4 py-2 rounded-2xl rounded-tl-none text-xs italic shadow-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={finalDasMensagensRef} />
          </div>

          <form onSubmit={enviarMensagem} className="p-3 bg-white border-t border-zinc-100 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-zinc-100 focus:bg-white text-sm p-2.5 px-4 rounded-xl border border-transparent focus:border-zinc-300 focus:outline-none transition-all text-zinc-800"
            />
            <button
              type="submit"
              disabled={!input.trim() || carregando}
              className="bg-zinc-900 hover:bg-zinc-800 text-white p-2.5 rounded-xl transition-colors disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
