'use client'

import { useState, useRef, useEffect } from 'react'

type Mensagem = {
  role: 'agente' | 'usuario'
  content: string
  fotos?: string[]
}

type DadosAnuncio = Record<string, string | string[]>

export default function AgentePublico() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [input, setInput] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [dados, setDados] = useState<DadosAnuncio>({})
  const [etapa, setEtapa] = useState('inicio')
  const [fotosUrls, setFotosUrls] = useState<string[]>([])
  const [uploadando, setUploadando] = useState(false)
  const [concluido, setConcluido] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => { iniciarChat() }, [])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [mensagens])

  async function iniciarChat() {
    setCarregando(true)
    try {
      const res = await fetch('/api/agente-publico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: '__inicio__', dados: {}, etapa: 'inicio' }),
      })
      const json = await res.json()
      setMensagens([{ role: 'agente', content: json.resposta }])
      setDados(json.dados || {})
      setEtapa(json.etapa || 'inicio')
    } catch { setMensagens([{ role: 'agente', content: 'Erro ao iniciar. Tente novamente.' }]) }
    setCarregando(false)
  }

  async function enviarMensagem() {
    if (!input.trim()) return
    const msg = input.trim()
    setInput('')
    setMensagens(prev => [...prev, { role: 'usuario', content: msg }])
    setCarregando(true)
    try {
      const res = await fetch('/api/agente-publico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: msg, dados, etapa }),
      })
      const json = await res.json()
      setMensagens(prev => [...prev, { role: 'agente', content: json.resposta }])
      setDados(json.dados || {})
      const novaEtapa = json.etapa || etapa
      setEtapa(novaEtapa)
      if (novaEtapa === 'finalizado') setConcluido(true)
    } catch { setMensagens(prev => [...prev, { role: 'agente', content: 'Erro ao processar.' }]) }
    setCarregando(false)
  }

  async function handleFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(e.target.files || [])
    if (!arquivos.length) return
    setUploadando(true)
    const urls: string[] = []
    for (const arquivo of arquivos) {
      const fd = new FormData()
      fd.append('file', arquivo)
      try {
        const res = await fetch('/api/agente-publico/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (json.url) urls.push(json.url)
      } catch { console.error('Erro upload foto') }
    }
    const novasUrls = [...fotosUrls, ...urls]
    setFotosUrls(novasUrls)
    setUploadando(false)
    setMensagens(prev => [...prev, { role: 'usuario', content: `${arquivos.length} foto(s) enviada(s)`, fotos: urls }])
    setCarregando(true)
    const res = await fetch('/api/agente-publico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem: `fotos_enviadas:${urls.join(',')}`, dados: { ...dados, fotos: novasUrls }, etapa }),
    })
    const json = await res.json()
    setMensagens(prev => [...prev, { role: 'agente', content: json.resposta }])
    setDados(json.dados || {})
    setEtapa(json.etapa || etapa)
    setCarregando(false)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-blue-700 text-white px-4 py-3 flex items-center gap-3 shadow">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-700 text-xl">🚛</div>
        <div>
          <p className="font-bold text-sm">Agente de Anúncios</p>
          <p className="text-xs text-blue-200">Caminhões à Venda</p>
        </div>
      </div>
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {mensagens.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'usuario' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow ${
              msg.role === 'usuario' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm border'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.fotos && msg.fotos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.fotos.map((url, j) => <img key={j} src={url} alt="foto" className="w-20 h-20 object-cover rounded" />)}
                </div>
              )}
            </div>
          </div>
        ))}
        {carregando && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl rounded-bl-sm px-4 py-2 text-sm shadow">
              <span className="animate-pulse">Digitando...</span>
            </div>
          </div>
        )}
      </div>
      {concluido && (
        <div className="px-4 pb-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-800 font-semibold mb-2">Anúncio enviado para aprovação!</p>
            <p className="text-sm text-green-700 mb-4">Crie uma conta para acompanhar e receber contatos.</p>
            <a href="/cadastro" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">Criar conta grátis</a>
          </div>
        </div>
      )}
      {!concluido && (
        <div className="px-4 pb-4 pt-2 bg-white border-t">
          {etapa === 'fotos' && (
            <div className="mb-2">
              <button onClick={() => fileInputRef.current?.click()} disabled={uploadando}
                className="w-full border-2 border-dashed border-blue-300 rounded-xl py-3 text-blue-600 text-sm hover:bg-blue-50 transition disabled:opacity-50">
                {uploadando ? 'Enviando fotos...' : '📷 Adicionar fotos do veículo'}
              </button>
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFotos} />
              {fotosUrls.length > 0 && <p className="text-xs text-gray-500 mt-1">{fotosUrls.length} foto(s) enviada(s)</p>}
            </div>
          )}
          <div className="flex gap-2">
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensagem() } }}
              placeholder="Digite sua resposta..." rows={1}
              className="flex-1 border rounded-xl px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={enviarMensagem} disabled={carregando || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">Enviar</button>
          </div>
        </div>
      )}
    </div>
  )
}
