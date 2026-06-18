'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const styles = `
.chat-wrap { min-height:100vh; background:#030712; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; padding:20px; }
.chat-box { width:100%; max-width:640px; display:flex; flex-direction:column; gap:8px; }
.chat-header { text-align:center; color:#4ade80; font-size:1.1rem; font-weight:800; padding:24px 0 8px; }
.chat-messages { display:flex; flex-direction:column; gap:10px; max-height:65vh; overflow-y:auto; padding:8px 0; }
.msg { padding:12px 16px; border-radius:16px; font-size:.97rem; line-height:1.5; max-width:85%; word-break:break-word; }
.msg-agent { background:#0f172a; color:#e2e8f0; border:1px solid #1e293b; align-self:flex-start; border-bottom-left-radius:4px; }
.msg-user { background:#22c55e; color:#052e16; font-weight:600; align-self:flex-end; border-bottom-right-radius:4px; }
.chat-form { display:flex; gap:8px; margin-top:12px; width:100%; max-width:640px; }
.chat-input { flex:1; background:#0f172a; border:1px solid #1e293b; border-radius:12px; padding:12px 16px; color:#f1f5f9; font-size:.97rem; outline:none; }
.chat-input:focus { border-color:#22c55e; }
.chat-btn { background:#22c55e; color:#052e16; font-weight:900; border:none; border-radius:12px; padding:12px 20px; cursor:pointer; font-size:1rem; }
.chat-btn:disabled { opacity:.5; cursor:not-allowed; }
.chat-success { text-align:center; padding:32px; color:#4ade80; font-size:1.1rem; font-weight:700; }
`

export default function ChatAnuncio() {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [publicado, setPublicado] = useState(false)
  const [dados, setDados] = useState<Record<string, unknown>>({})

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/anunciar/chat',
    body: { dados },
    initialMessages: [
      {
        id: 'init',
        role: 'assistant',
        content: 'Ola! Qual seu nome, WhatsApp e cidade?',
      },
    ],
    onFinish: async (message) => {
      if (message.content.includes('ANUNCIO_CONFIRMADO')) {
        try {
          const jsonStr = message.content.replace('ANUNCIO_CONFIRMADO', '').trim()
          const anuncioData = JSON.parse(jsonStr) as Record<string, unknown>
          setDados(anuncioData)
          const supabase = createClient()
          await supabase.from('anuncios_chat').insert([anuncioData])
          setPublicado(true)
        } catch (_e) {
          // JSON ainda incompleto
        }
      }
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat-wrap">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="chat-box">
        <div className="chat-header">🚛 Criar Anuncio</div>

        {publicado ? (
          <div className="chat-success">Anuncio publicado com sucesso! Obrigado, ate logo!</div>
        ) : (
          <>
            <div className="chat-messages">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`msg ${m.role === 'assistant' ? 'msg-agent' : 'msg-user'}`}
                >
                  {m.content}
                </div>
              ))}
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
