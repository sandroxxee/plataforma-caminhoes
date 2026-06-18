'use client'

import { useState, useEffect, useRef } from 'react'

type MensagemTela = { enviadoPor: 'user' | 'bot'; texto: string }
type HistoricoItem = { role: string; parts: { text?: string }[] }

const styles = `
.chat-wrap { min-height:100vh; background:#030712; display:flex; flex-direction:column; align-items:center; padding:20px; }
.chat-box { width:100%; max-width:640px; display:flex; flex-direction:column; gap:8px; padding-top:24px; }
.chat-header { text-align:center; color:#4ade80; font-size:1.1rem; font-weight:800; padding-bottom:8px; }
.chat-messages { display:flex; flex-direction:column; gap:10px; min-height:60vh; padding:8px 0; }
.msg { padding:12px 16px; border-radius:16px; font-size:.97rem; line-height:1.5; max-width:85%; word-break:break-word; }
.msg-bot { background:#0f172a; color:#e2e8f0; border:1px solid #1e293b; align-self:flex-start; border-bottom-left-radius:4px; }
.msg-user { background:#22c55e; color:#052e16; font-weight:600; align-self:flex-end; border-bottom-right-radius:4px; }
.chat-form { display:flex; gap:8px; margin-top:12px; width:100%; }
.chat-input { flex:1; background:#0f172a; border:1px solid #1e293b; border-radius:12px; padding:12px 16px; color:#f1f5f9; font-size:.97rem; outline:none; }
.chat-input:focus { border-color:#22c55e; }
.chat-btn { background:#22c55e; color:#052e16; font-weight:900; border:none; border-radius:12px; padding:12px 20px; cursor:pointer; font-size:1rem; }
.chat-btn:disabled { opacity:.5; cursor:not-allowed; }
.chat-loading { color:#64748b; font-size:.9rem; padding:8px 0; align-self:flex-start; font-style:italic; }
.chat-inicio { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; flex:1; padding:40px 0; }
.chat-inicio p { color:#94a3b8; text-align:center; font-size:1rem; }
.btn-iniciar { background:#22c55e; color:#052e16; font-weight:900; border:none; border-radius:12px; padding:16px 32px; cursor:pointer; font-size:1.1rem; }
`

export default function ChatAnuncio() {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [iniciado, setIniciado] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [mensagensTela, setMensagensTela] = useState<MensagemTela[]>([])
  const [historicoApi, setHistoricoApi] = useState<HistoricoItem[]>([])

  async function enviarMensagem(texto: string) {
    if (!texto.trim() || carregando) return
    setCarregando(true)

    if (texto !== 'iniciar') {
      setMensagensTela(prev => [...prev, { enviadoPor: 'user', texto }])
    }
    setInput('')

    try {
      const res = await fetch('/api/anunciar-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: texto, historico: historicoApi })
      })

      const dados = await res.json() as { textoBot?: string; historicoAtualizado?: HistoricoItem[]; error?: string }

      if (dados.textoBot) {
        setMensagensTela(prev => [...prev, { enviadoPor: 'bot', texto: dados.textoBot! }])
        setHistoricoApi(dados.historicoAtualizado ?? [])
      }
    } catch (erro) {
      console.error('Erro ao falar com o bot:', erro)
      setMensagensTela(prev => [...prev, { enviadoPor: 'bot', texto: 'Erro ao conectar. Tente novamente.' }])
    }

    setCarregando(false)
  }

  function iniciar() {
    setIniciado(true)
    enviarMensagem('iniciar')
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagensTela])

  return (
    <div className="chat-wrap">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="chat-box">
        <div className="chat-header">🚛 Criar Anuncio</div>
        {!iniciado ? (
          <div className="chat-inicio">
            <p>Nosso assistente cria seu anuncio em minutos!</p>
            <button className="btn-iniciar" onClick={iniciar}>Criar Anuncio Agora</button>
          </div>
        ) : (
          <>
            <div className="chat-messages">
              {mensagensTela.map((msg, i) => (
                <div key={i} className={`msg ${msg.enviadoPor === 'bot' ? 'msg-bot' : 'msg-user'}`}>
                  {msg.texto}
                </div>
              ))}
              {carregando && <div className="chat-loading">Digitando...</div>}
              <div ref={bottomRef} />
            </div>
            <form className="chat-form" onSubmit={e => { e.preventDefault(); enviarMensagem(input) }}>
              <input
                className="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Digite sua resposta..."
                disabled={carregando}
                autoFocus
              />
              <button className="chat-btn" type="submit" disabled={carregando || !input.trim()}>
                {carregando ? '...' : 'Enviar'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
