'use client'

import { useState, useRef, useEffect } from 'react'

type Msg = { role: 'agente' | 'user'; text: string; fotos?: string[] }
type Dados = Record<string, string | string[]>

export default function BotaoAnunciarFlutuante() {
  const [aberto, setAberto] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [dados, setDados] = useState<Dados>({})
  const [etapa, setEtapa] = useState('inicio')
  const [fotosUrls, setFotosUrls] = useState<string[]>([])
  const [uploadando, setUploadando] = useState(false)
  const [concluido, setConcluido] = useState(false)
  const [iniciado, setIniciado] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [msgs])

  async function abrir() {
    setAberto(true)
    if (!iniciado) {
      setIniciado(true)
      setLoading(true)
      try {
        const res = await fetch('/api/agente-publico', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mensagem: '__inicio__', dados: {}, etapa: 'inicio' }),
        })
        const json = await res.json()
        setMsgs([{ role: 'agente', text: json.resposta }])
        setDados(json.dados || {})
        setEtapa(json.etapa || 'inicio')
      } catch { setMsgs([{ role: 'agente', text: 'Erro ao iniciar. Tente novamente.' }]) }
      setLoading(false)
    }
  }

  async function enviar() {
    if (!input.trim()) return
    const msg = input.trim()
    setInput('')
    setMsgs(p => [...p, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const res = await fetch('/api/agente-publico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: msg, dados, etapa }),
      })
      const json = await res.json()
      setMsgs(p => [...p, { role: 'agente', text: json.resposta }])
      setDados(json.dados || {})
      const ne = json.etapa || etapa
      setEtapa(ne)
      if (ne === 'finalizado') setConcluido(true)
    } catch { setMsgs(p => [...p, { role: 'agente', text: 'Erro. Tente novamente.' }]) }
    setLoading(false)
  }

  async function handleFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadando(true)
    const urls: string[] = []
    for (const f of files) {
      const fd = new FormData()
      fd.append('file', f)
      try {
        const r = await fetch('/api/agente-publico/upload', { method: 'POST', body: fd })
        const j = await r.json()
        if (j.url) urls.push(j.url)
      } catch {}
    }
    const novas = [...fotosUrls, ...urls]
    setFotosUrls(novas)
    setUploadando(false)
    setMsgs(p => [...p, { role: 'user', text: `${files.length} foto(s) enviada(s)`, fotos: urls }])
    setLoading(true)
    const res = await fetch('/api/agente-publico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem: `fotos_enviadas:${urls.join(',')}`, dados: { ...dados, fotos: novas }, etapa }),
    })
    const json = await res.json()
    setMsgs(p => [...p, { role: 'agente', text: json.resposta }])
    setDados(json.dados || {})
    setEtapa(json.etapa || etapa)
    setLoading(false)
  }

  return (
    <>
      {/* Botao flutuante */}
      {!aberto && (
        <button
          onClick={abrir}
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
            color: '#fff', border: 'none', borderRadius: 50,
            width: 60, height: 60, fontSize: 26, cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(37,99,235,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1.0)')}
          title="Anunciar Gratis"
        >
          🚛
        </button>
      )}

      {/* Janela flutuante de chat */}
      {aberto && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 370, height: 560,
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: 14,
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38, background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 20,
              }}>🚛</div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Agente de Anúncios</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>Caminhões à Venda • Grátis</div>
              </div>
            </div>
            <button
              onClick={() => setAberto(false)}
              style={{
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: '#fff', borderRadius: 8, padding: '4px 10px',
                cursor: 'pointer', fontSize: 18, lineHeight: 1,
              }}
            >&#x2715;</button>
          </div>

          {/* Mensagens */}
          <div ref={chatRef} style={{
            flex: 1, overflowY: 'auto', padding: '16px 12px',
            display: 'flex', flexDirection: 'column', gap: 10,
            background: '#f8fafc',
          }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%',
                  background: m.role === 'user' ? '#2563eb' : '#fff',
                  color: m.role === 'user' ? '#fff' : '#1e293b',
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '10px 14px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {m.text}
                  {m.fotos && m.fotos.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {m.fotos.map((u, j) => (
                        <img key={j} src={u} alt="foto" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  background: '#fff', borderRadius: '18px 18px 18px 4px',
                  padding: '10px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                  color: '#94a3b8', fontSize: 13,
                }}>Digitando...</div>
              </div>
            )}
          </div>

          {/* Concluido */}
          {concluido ? (
            <div style={{ padding: 16, background: '#f0fdf4', borderTop: '1px solid #bbf7d0', textAlign: 'center' }}>
              <div style={{ color: '#15803d', fontWeight: 700, marginBottom: 6 }}>🎉 Anúncio enviado para aprovação!</div>
              <div style={{ color: '#166534', fontSize: 12, marginBottom: 12 }}>Crie uma conta para acompanhar seu anúncio.</div>
              <a href="/cadastro" style={{
                display: 'inline-block', background: '#2563eb', color: '#fff',
                padding: '8px 24px', borderRadius: 50, fontSize: 13,
                textDecoration: 'none', fontWeight: 600,
              }}>Criar conta grátis</a>
            </div>
          ) : (
            /* Input */
            <div style={{ padding: '10px 12px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
              {etapa === 'fotos' && (
                <div style={{ marginBottom: 8 }}>
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadando}
                    style={{
                      width: '100%', padding: '10px',
                      border: '2px dashed #93c5fd', borderRadius: 12,
                      background: '#eff6ff', color: '#2563eb',
                      cursor: uploadando ? 'not-allowed' : 'pointer',
                      fontSize: 13, fontWeight: 600,
                    }}
                  >
                    {uploadando ? 'Enviando...' : '📷 Adicionar fotos do veículo'}
                  </button>
                  <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleFotos} />
                  {fotosUrls.length > 0 && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{fotosUrls.length} foto(s) enviada(s)</div>}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar() } }}
                  placeholder="Digite sua resposta..."
                  rows={1}
                  style={{
                    flex: 1, border: '1.5px solid #e2e8f0', borderRadius: 12,
                    padding: '9px 12px', fontSize: 13, resize: 'none',
                    outline: 'none', fontFamily: 'inherit', lineHeight: 1.4,
                  }}
                />
                <button
                  onClick={enviar}
                  disabled={loading || !input.trim()}
                  style={{
                    background: loading || !input.trim() ? '#cbd5e1' : '#2563eb',
                    color: '#fff', border: 'none', borderRadius: 12,
                    padding: '0 16px', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: 700, fontSize: 13,
                  }}
                >
                  ↑
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
