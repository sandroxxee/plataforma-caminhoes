'use client'

import { useEffect, useState } from 'react'
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

export default function RevisarPage() {
  const router = useRouter()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [missing, setMissing] = useState<string[]>([])

  useEffect(() => {
    const raw = sessionStorage.getItem('ia_draft')
    if (raw) setDraft(JSON.parse(raw))
  }, [])

  function handlePublish() {
    if (!draft) return
    const m: string[] = []
    if (!draft.category) m.push('Categoria')
    if (!draft.vehicle.brand) m.push('Marca')
    if (!draft.vehicle.year) m.push('Ano')
    if (!draft.price) m.push('Preço')
    if (!draft.contact.whatsapp) m.push('WhatsApp')
    if (m.length) { setMissing(m); return }
    setPublishing(true)
    setTimeout(() => router.push('/anunciar-ia/publicado'), 1200)
  }

  if (!draft) return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
      Carregando...
    </div>
  )

  const fields = [
    { label: 'Categoria', value: draft.category },
    { label: 'Marca', value: draft.vehicle.brand },
    { label: 'Modelo', value: draft.vehicle.model },
    { label: 'Ano', value: draft.vehicle.year?.toString() },
    { label: 'Carroceria', value: draft.vehicle.bodyType },
    { label: 'Quilometragem', value: draft.vehicle.mileage ? draft.vehicle.mileage.toLocaleString('pt-BR') + ' km' : undefined },
    { label: 'Preço', value: draft.price ? (draft.price === -1 ? 'A negociar' : 'R$ ' + draft.price.toLocaleString('pt-BR')) : undefined },
    { label: 'Cidade', value: draft.location.city },
    { label: 'Estado', value: draft.location.state },
    { label: 'WhatsApp', value: draft.contact.whatsapp },
    { label: 'Descrição', value: draft.description && draft.description !== '—' ? draft.description : undefined },
    { label: 'Fotos', value: draft.photos.length > 0 ? `${draft.photos.length} foto(s)` : undefined },
  ]

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 pb-32 pt-6">
      <div className="mx-auto max-w-md">
        <div className="mb-4">
          <div className="h-1 w-full rounded-full bg-zinc-800">
            <div className="h-1 w-[80%] rounded-full bg-emerald-500" />
          </div>
          <p className="mt-1.5 text-xs text-zinc-500">Etapa 4 de 5</p>
        </div>

        <h1 className="mb-6 text-2xl font-semibold">Revise seu anúncio</h1>

        {missing.length > 0 && (
          <div className="mb-4 rounded-2xl border border-red-800 bg-red-900/10 px-4 py-3 text-sm text-red-400">
            Campos obrigatórios faltando: {missing.join(', ')}
          </div>
        )}

        <div className="mb-6 space-y-2">
          {fields.map(f => (
            <div
              key={f.label}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                f.value ? 'border-zinc-800 bg-zinc-900' : 'border-red-900/40 bg-red-900/5'
              }`}
            >
              <span className="text-zinc-400">{f.label}</span>
              <span className={f.value ? 'text-zinc-100' : 'text-xs text-red-400'}>
                {f.value ?? 'Não preenchido'}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push('/anunciar-ia/chat')}
          className="mb-3 w-full rounded-2xl border border-zinc-700 bg-zinc-900 py-3 text-sm text-zinc-300"
        >
          ← Editar dados
        </button>

        <button
          onClick={handlePublish}
          disabled={publishing}
          className="w-full rounded-2xl bg-emerald-500 py-4 font-semibold text-black disabled:opacity-50"
        >
          {publishing ? 'Publicando...' : 'Publicar anúncio'}
        </button>
      </div>
    </main>
  )
}
