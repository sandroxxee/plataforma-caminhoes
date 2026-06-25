'use client'

import { useRouter } from 'next/navigation'

const categories = [
  { value: 'caminhao', label: 'Caminhão', emoji: '🚛' },
  { value: 'carreta', label: 'Carreta', emoji: '🚚' },
  { value: 'maquina', label: 'Máquina', emoji: '🏗️' },
  { value: 'implemento', label: 'Implemento', emoji: '🔧' },
  { value: 'peca', label: 'Peça', emoji: '⚙️' },
] as const

export default function AnunciarIAPage() {
  const router = useRouter()

  function handleSelect(value: string) {
    const draft = {
      category: value,
      vehicle: {},
      price: null,
      location: {},
      contact: {},
      description: '',
      photos: [],
    }
    sessionStorage.setItem('ia_draft', JSON.stringify(draft))
    router.push('/anunciar-ia/chat')
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-8">
      <div className="mx-auto max-w-md">
        {/* Progress */}
        <div className="mb-6">
          <div className="h-1 w-full rounded-full bg-zinc-800">
            <div className="h-1 w-[10%] rounded-full bg-emerald-500" />
          </div>
          <p className="mt-2 text-xs text-zinc-500">Etapa 1 de 5</p>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <h1 className="text-2xl font-semibold">Anunciar com IA</h1>
        </div>
        <p className="mb-8 text-sm text-zinc-400">Responda algumas perguntas e o anúncio se preenche sozinho.</p>

        <h2 className="mb-4 text-base font-medium text-zinc-300">O que você quer anunciar?</h2>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleSelect(cat.value)}
              className="flex flex-col items-start gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-emerald-500 active:scale-95"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-base font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
