'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const styles = `
.chat-wrap { min-height:100vh; background:#030712; display:flex; flex-direction:column; align-items:center; padding:20px; }
.chat-box { width:100%; max-width:640px; display:flex; flex-direction:column; gap:8px; padding-top:24px; }
.chat-header { text-align:center; color:#4ade80; font-size:1.1rem; font-weight:800; padding-bottom:8px; }
.chat-messages { display:flex; flex-direction:column; gap:10px; min-height:60vh; padding:8px 0; }
.msg { padding:12px 16px; border-radius:16px; font-size:.97rem; line-height:1.5; max-width:85%; word-break:break-word; }
.msg-agent { background:#0f172a; color:#e2e8f0; border:1px solid #1e293b; align-self:flex-start; border-bottom-left-radius:4px; }
.msg-user { background:#22c55e; color:#052e16; font-weight:600; align-self:flex-end; border-bottom-right-radius:4px; }
.chat-form { display:flex; gap:8px; margin-top:12px; width:100%; }
.chat-input { flex:1; background:#0f172a; border:1px solid #1e293b; border-radius:12px; padding:12px 16px; color:#f1f5f9; font-size:.97rem; outline:none; }
.chat-input:focus { border-color:#22c55e; }
.chat-btn { background:#22c55e; color:#052e16; font-weight:900; border:none; border-radius:12px; padding:12px 20px; cursor:pointer; font-size:1rem; }
.chat-btn:disabled { opacity:.5; cursor:not-allowed; }
.chat-success { text-align:center; padding:32px; color:#4ade80; font-size:1.1rem; font-weight:700; }
.chat-loading { color:#64748b; font-size:.9rem; padding:8px 0; align-self:flex-start; }
.chat-inicio { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; flex:1; padding:40px 0; }
.chat-inicio p { color:#94a3b8; text-align:center; }
.btn-iniciar { background:#22c55e; color:#052e16; font-weight:900; border:none; border-radius:12px; padding:16px 32px; cursor:pointer; font-size:1.1rem; }
`

export default function ChatAnuncio() {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [publicado, setPublicado] = useState(false)
  const [iniciado, setIniciado] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, status, append } = useChat({
    api: '/api/anunciar-chat',
    onFinish: async (message) => {
      if (message.content.includes('ANUNCIO_CONFIRMADO')) {
        try {
          const jsonStr = message.content.replace('ANUNCIO_CONFIRMADO', '').trim()
          const anuncioData = JSON.parse(jsonStr) as Record<string, unknown>
          const supabase = createClient()
          await supabase.from('anuncios_chat').insert([anuncioData])
          setPublicado(true)
        } catch (_e) {}
      }
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  async function iniciarConversa() {
    setIniciado(true)
    await append({ role: 'user', content: 'iniciar' })
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const mensagensVisiveis = messages.filter(
    (m, i) => !(i === 0 && m.role === 'user' && m.content === 'iniciar')
  )

  return (
    <div className="chat-wrap">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="chat-box">
        <div className="chat-header">🚛 Criar Anuncio</div>
        {publicado ? (
          <div className="chat-success">Anuncio publicado! Obrigado, ate logo!</div>
        ) : !iniciado ? (
          <div className="chat-inicio">
            <p>Nosso assistente vai te ajudar a criar seu anuncio em poucos minutos!</p>
            <button className="btn-iniciar" onClick={iniciarConversa}>
              Criar Anuncio Agora
            </button>
          </div>
        ) : (
          <>
            <div className="chat-messages">
              {mensagensVisiveis.map((m) => (
                <div key={m.id} className={`msg ${m.role === 'assistant' ? 'msg-agent' : 'msg-user'}`}>
                  {m.content}
                </div>
              ))}
              {isLoading && <div className="chat-loading">digitando...</div>}
              <div ref={bottomRef} />
            </div>
            <form className="chat-form" onSubmit={handleSubmit}>
              <input
                className="chat-input"
                value={input}
                onChange={handleInputChange}
                placeholder="Digite sua resposta..."
                disabled={isLoading}
                autoFocus
              />
              <button className="chat-btn" type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? '...' : 'Enviar'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
