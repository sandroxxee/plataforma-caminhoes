'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { type AdDraft, emptyAdDraft } from '@/lib/schema/ad-draft'
import { parseAdMessage } from '@/lib/ai/parse-message'
import { saveDraft } from '@/lib/actions/save-draft'

function getPrompt(draft: AdDraft): string {
  if (!draft.vehicle.brand) return 'Me diga a marca, modelo e ano do veículo.'
  if (!draft.vehicle.year) return `Qual o ano do ${draft.vehicle.brand}?`
  if (!draft.vehicle.bodyType) return 'Qual é a carroceria ou configuração?'
  if (!draft.vehicle.mileage) return 'Quantos km ele tem, mais ou menos?'
  if (!draft.price) return 'Qual preço quer anunciar?'
  if (!draft.location.city) return 'Em que cidade e estado ele está?'
  if (!draft.contact.whatsapp) return 'Qual WhatsApp vai aparecer no anúncio?'
  if (!draft.description) return 'Quer adicionar uma descrição curta? (opcional)'
  return 'Tudo pronto! Vamos para as fotos.'
}

const quickReplies: Record<string, string[]> = {
  mileage: ['Menos de 50 mil', '50 a 200 mil', '200 a 500 mil', 'Acima de 500 mil'],
  price: ['A negociar', 'Consulte-nos'],
  description: ['Pular', 'Veículo em ótimo estado, revisado e pronto para trabalhar.'],
}

export default function AssistantePage() {
  const router = useRouter()
  const [draft, setDraft] = useState<AdDraft>(emptyAdDraft)
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([])

  useEffect(() => {
    const raw = sessionStorage.getItem('ad_draft')
    if (raw) setDraft(JSON.parse(raw))
  }, [])

  const prompt = useMemo(() => getPrompt(draft), [draft])
  const isDone = prompt === 'Tudo pronto! Vamos para as fotos.'

  useEffect(() => {
    setMessages((prev) => {
      const last = prev[prev.length - 1]
      if (last?.role === 'ai' && last.text === prompt) return prev
      return [...prev, { role: 'ai', text: prompt }]
    })
  }, [prompt])

  async function send(text: string) {
    if (!text.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    const next = parseAdMessage(text, draft)
    setDraft(next)
    sessionStorage.setItem('ad_draft', JSON.stringify(next))
    setSaving(true)
    await saveDraft(next)
    setSaving(false)
  }

  const currentField = !draft.vehicle.brand ? 'brand'
    : !draft.vehicle.mileage ? 'mileage'
    : !draft.price ? 'price'
    : !draft.description ? 'description'
    : ''

  const replies = quickReplies[currentField] ?? []

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 pb-32 pt-6">
      <div className="mx-auto max-w-md">
        <div className="mb-4">
          <div className="h-1 w-full rounded-full bg-zinc-800">
            <div className="h-1 w-2/5 rounded-full bg-emerald-500 transition-all" />
          </div>
          <p className="mt-2 text-xs text-zinc-500">Etapa 2 de 5 {saving && '· Salvando...'}</p>
        </div>

        {/* Chips de resumo */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {draft.vehicle.brand && <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">{draft.vehicle.brand}</span>}
          {draft.vehicle.year && <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">{draft.vehicle.year}</span>}
          {draft.vehicle.mileage && <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">{draft.vehicle.mileage.toLocaleString('pt-BR')} km</span>}
          {draft.price && <span className="shrink-0 rounded-full border border-emerald-700 bg-emerald-900/30 px-3 py-1 text-xs text-emerald-400">R$ {draft.price.toLocaleString('pt-BR')}</span>}
          {draft.location.state && <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">{draft.location.city} {draft.location.state}</span>}
        </div>

        {/* Mensagens */}
        <div className="flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === 'ai' ? 'flex justify-start' : 'flex justify-end'}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'ai'
                  ? 'border border-zinc-800 bg-zinc-900 text-zinc-100'
                  : 'bg-emerald-600 text-white'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {isDone && (
          <button
            onClick={() => router.push('/anunciar-preview/fotos')}
            className="mt-6 w-full rounded-2xl bg-emerald-500 py-4 font-semibold text-black"
          >
            Ir para fotos →
          </button>
        )}
      </div>

      {/* Input fixo */}
      {!isDone && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950 p-4">
          <div className="mx-auto max-w-md">
            {replies.length > 0 && (
              <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
                {replies.map((r) => (
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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder="Escreva sua resposta..."
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || saving}
                className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black disabled:opacity-40"
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
