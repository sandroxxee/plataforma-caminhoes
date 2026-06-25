'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Draft = {
  category: string
  vehicle: { brand?: string; model?: string; year?: number; bodyType?: string; mileage?: number }
  price: number | null
  location: { city?: string; state?: string }
  contact: { whatsapp?: string }
  description: string
  photos: string[]
}

const BR_STATES = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

const QUICK: Record<string, string[]> = {
  mileage: ['Menos de 50 mil km', '50 a 200 mil km', '200 a 500 mil km', 'Acima de 500 mil km'],
  price: ['A negociar', 'Consulte-nos'],
  description: ['Pular', 'Veículo em ótimo estado, revisado e pronto para trabalhar.'],
}

function getField(d: Draft): string {
  if (!d.vehicle.brand) return 'brand'
  if (!d.vehicle.year) return 'year'
  if (!d.vehicle.bodyType) return 'bodyType'
  if (!d.vehicle.mileage) return 'mileage'
  if (!d.price) return 'price'
  if (!d.location.city) return 'location'
  if (!d.contact.whatsapp) return 'whatsapp'
  if (!d.description) return 'description'
  return 'done'
}

function getPrompt(d: Draft): string {
  const f = getField(d)
  if (f === 'brand') return 'Me diga a marca, modelo e ano do veículo.'
  if (f === 'year') return `Qual o ano do ${d.vehicle.brand}?`
  if (f === 'bodyType') return 'Qual é a carroceria ou configuração?'
  if (f === 'mileage') return 'Quantos km ele tem, mais ou menos?'
  if (f === 'price') return 'Qual preço quer anunciar?'
  if (f === 'location') return 'Em que cidade e estado ele está?'
  if (f === 'whatsapp') return 'Qual WhatsApp vai aparecer no anúncio?'
  if (f === 'description') return 'Quer adicionar uma descrição curta? (opcional)'
  return 'done'
}

function parse(text: string, d: Draft): Draft {
  const next: Draft = JSON.parse(JSON.stringify(d))
  const t = text.trim()
  const field = getField(d)

  const yearM = t.match(/\b(19\d{2}|20\d{2})\b/)
  if (yearM) next.vehicle.year = parseInt(yearM[1])

  if (/negociar|consulte/i.test(t)) { next.price = -1 }
  else {
    const priceM = t.match(/([\d.]+(?:,\d{1,2})?)/)
    if (priceM && field === 'price') {
      const v = parseFloat(priceM[1].replace(/\./g, '').replace(',', '.'))
      if (!isNaN(v) && v > 1000) next.price = v
    }
  }

  if (/menos de 50/i.test(t)) next.vehicle.mileage = 49000
  else if (/50 a 200/i.test(t)) next.vehicle.mileage = 125000
  else if (/200 a 500/i.test(t)) next.vehicle.mileage = 350000
  else if (/acima de 500/i.test(t)) next.vehicle.mileage = 500001
  else {
    const kmM = t.match(/([\d.]+)\s*(?:mil)?\s*km/i)
    if (kmM) {
      let v = parseFloat(kmM[1].replace(/\./g, ''))
      if (/mil km/i.test(t)) v *= 1000
      if (!isNaN(v)) next.vehicle.mileage = v
    }
  }

  const stateRe = new RegExp(`\\b(${BR_STATES.join('|')})\\b`, 'i')
  const stateM = t.match(stateRe)
  if (stateM) {
    next.location.state = stateM[1].toUpperCase()
    const before = t.slice(0, stateM.index).trim()
    const words = before.split(/[,\s]+/).filter(Boolean)
    if (words.length) next.location.city = words[words.length - 1]
  }

  const waM = t.match(/(\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4})/)
  if (waM) next.contact.whatsapp = waM[1].trim()

  if (field === 'description') {
    next.description = /pular/i.test(t) ? '—' : t
  }

  if (field === 'bodyType') next.vehicle.bodyType = t

  if (field === 'brand' && !next.vehicle.brand) {
    const words = t.split(/\s+/)
    if (words[0]) next.vehicle.brand = words[0]
    const rest = words.slice(1).filter(w => !/\b(19|20)\d{2}\b/.test(w))
    if (rest.length) next.vehicle.model = rest.join(' ')
  }

  return next
}

type Msg = { role: 'ai' | 'user'; text: string }

export default function ChatPage() {
  const router = useRouter()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [started, setStarted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('ia_draft')
    if (!raw) { router.replace('/anunciar-ia'); return }
    const d: Draft = JSON.parse(raw)
    setDraft(d)
  }, [router])

  // Envia primeira mensagem da IA só uma vez
  useEffect(() => {
    if (!draft || started) return
    setStarted(true)
    const prompt = getPrompt(draft)
    if (prompt !== 'done') setMessages([{ role: 'ai', text: prompt }])
  }, [draft, started])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = useCallback((text: string) => {
    if (!text.trim() || !draft) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text }])
    const next = parse(text, draft)
    setDraft(next)
    setSaving(true)
    sessionStorage.setItem('ia_draft', JSON.stringify(next))
    setTimeout(() => setSaving(false), 600)
    const prompt = getPrompt(next)
    setTimeout(() => {
      if (prompt === 'done') {
        setMessages(prev => [...prev, { role: 'ai', text: 'Perfeito! Tudo preenchido. Vamos para as fotos 📸' }])
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: prompt }])
      }
    }, 400)
  }, [draft])

  if (!draft) return null

  const field = getField(draft)
  const isDone = field === 'done'
  const quickReplies = QUICK[field] ?? []

  const chips = [
    draft.category,
    draft.vehicle.brand,
    draft.vehicle.model,
    draft.vehicle.year?.toString(),
    draft.vehicle.bodyType,
    draft.vehicle.mileage ? (draft.vehicle.mileage > 500000 ? '+500k km' : draft.vehicle.mileage.toLocaleString('pt-BR') + ' km') : null,
    draft.price ? (draft.price === -1 ? 'A negociar' : 'R$ ' + draft.price.toLocaleString('pt-BR')) : null,
    draft.location.city ? `${draft.location.city} ${draft.location.state ?? ''}`.trim() : null,
    draft.contact.whatsapp,
  ].filter(Boolean) as string[]

  const filled = [draft.category, draft.vehicle.brand, draft.vehicle.year, draft.vehicle.bodyType, draft.vehicle.mileage, draft.price, draft.location.city, draft.contact.whatsapp].filter(Boolean).length
  const pct = Math.round(10 + (filled / 8) * 60)

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 pb-36 pt-6 px-4">
      <div className="mx-auto max-w-md">
        {/* Progress */}
        <div className="mb-4">
          <div className="h-1 w-full rounded-full bg-zinc-800">
            <div className="h-1 rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-zinc-500">
            Etapa 2 de 5 {saving && <span className="text-emerald-500"> · Salvando...</span>}
          </p>
        </div>

        {/* Chips */}
        {chips.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {chips.map((c, i) => (
              <span key={i} className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                c.startsWith('R$') || c === 'A negociar'
                  ? 'border-emerald-800 bg-emerald-900/20 text-emerald-400'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-300'
              }`}>{c}</span>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'ai'
                  ? 'border border-zinc-800 bg-zinc-900 text-zinc-100'
                  : 'bg-emerald-600 text-white'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {isDone && (
            <button
              onClick={() => router.push('/anunciar-ia/fotos')}
              className="mt-2 w-full rounded-2xl bg-emerald-500 py-4 font-semibold text-black"
            >
              Ir para fotos →
            </button>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      {!isDone && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950 px-4 py-3">
          <div className="mx-auto max-w-md">
            {quickReplies.length > 0 && (
              <div className="mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {quickReplies.map((r) => (
                  <button
                    key={r}
                    onClick={() => send(r)}
                    className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 hover:border-emerald-500"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
                placeholder="Escreva sua resposta..."
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-emerald-500 placeholder:text-zinc-600"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim()}
                className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black disabled:opacity-40"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
