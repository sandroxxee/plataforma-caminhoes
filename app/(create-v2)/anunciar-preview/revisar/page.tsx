'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdDraft } from '@/lib/schema/ad-draft'
import { publishAd } from '@/lib/actions/publish-ad'

export default function RevisarPage() {
  const router = useRouter()
  const [draft, setDraft] = useState<AdDraft | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string[] | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('ad_draft')
    if (raw) setDraft(JSON.parse(raw))
  }, [])

  async function handlePublish() {
    if (!draft) return
    setPublishing(true)
    const result = await publishAd(draft)
    if (result.ok) {
      sessionStorage.setItem('published_id', result.publishedId ?? '')
      router.push('/anunciar-preview/publicado')
    } else {
      setError(result.requiredMissing ?? [])
      setPublishing(false)
    }
  }

  if (!draft) return <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center">Carregando...</div>

  const fields = [
    { label: 'Categoria', value: draft.category },
    { label: 'Marca', value: draft.vehicle.brand },
    { label: 'Modelo', value: draft.vehicle.model },
    { label: 'Ano', value: draft.vehicle.year },
    { label: 'Carroceria', value: draft.vehicle.bodyType },
    { label: 'Quilometragem', value: draft.vehicle.mileage ? `${draft.vehicle.mileage.toLocaleString('pt-BR')} km` : undefined },
    { label: 'Preço', value: draft.price ? `R$ ${draft.price.toLocaleString('pt-BR')}` : undefined },
    { label: 'Cidade', value: draft.location.city },
    { label: 'Estado', value: draft.location.state },
    { label: 'WhatsApp', value: draft.contact.whatsapp },
    { label: 'Descrição', value: draft.description },
    { label: 'Fotos', value: draft.photos.length > 0 ? `${draft.photos.length} foto(s)` : undefined },
  ]

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 pb-32 pt-6">
      <div className="mx-auto max-w-md">
        <div className="mb-4">
          <div className="h-1 w-full rounded-full bg-zinc-800">
            <div className="h-1 w-4/5 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-2 text-xs text-zinc-500">Etapa 4 de 5</p>
        </div>

        <h1 className="mb-6 text-2xl font-semibold">Revise seu anúncio</h1>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-800 bg-red-900/20 p-4 text-sm text-red-400">
            Campos obrigatórios faltando: {error.join(', ')}
          </div>
        )}

        <div className="mb-6 space-y-2">
          {fields.map((f) => (
            <div key={f.label} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
              f.value ? 'border-zinc-800 bg-zinc-900' : 'border-red-900/50 bg-red-900/10'
            }`}>
              <span className="text-zinc-400">{f.label}</span>
              <span className={f.value ? 'text-zinc-100' : 'text-red-400 text-xs'}>
                {f.value ?? 'Não preenchido'}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push('/anunciar-preview/assistente')}
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
