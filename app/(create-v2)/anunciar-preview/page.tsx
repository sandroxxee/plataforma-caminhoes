'use client'

import { useRouter } from 'next/navigation'

const categories = [
  { value: 'caminhao', label: 'Caminhão', emoji: '🚛' },
  { value: 'carreta', label: 'Carreta', emoji: '🚚' },
  { value: 'maquina', label: 'Máquina', emoji: '🏗️' },
  { value: 'implemento', label: 'Implemento', emoji: '🔧' },
  { value: 'peca', label: 'Peça', emoji: '⚙️' },
] as const

export default function CategoryPage() {
  const router = useRouter()

  function handleSelect(value: string) {
    sessionStorage.setItem('ad_draft', JSON.stringify({ category: value, vehicle: {}, location: {}, contact: {}, photos: [], status: { step: 'assistente', requiredMissing: [], confidence: {} } }))
    router.push('/anunciar-preview/assistente')
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <div className="h-1 w-full rounded-full bg-zinc-800">
            <div className="h-1 w-[10%] rounded-full bg-emerald-500" />
          </div>
          <p className="mt-2 text-xs text-zinc-500">Etapa 1 de 5</p>
        </div>
        <h1 className="mb-6 text-2xl font-semibold">O que você quer anunciar?</h1>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleSelect(cat.value)}
              className="flex flex-col items-start gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-emerald-500 active:scale-95"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-base font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
