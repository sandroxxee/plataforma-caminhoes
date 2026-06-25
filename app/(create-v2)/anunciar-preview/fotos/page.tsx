'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const checklist = [
  'Frente do veículo',
  'Lado esquerdo',
  'Lado direito',
  'Traseira',
  'Cabine / interior',
  'Painel / odômetro',
  'Motor',
  'Detalhe ou avaria (opcional)',
]

export default function FotosPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    files.forEach((f) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPreviews((prev) => [...prev, ev.target!.result as string])
        }
      }
      reader.readAsDataURL(f)
    })
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 pb-32 pt-6">
      <div className="mx-auto max-w-md">
        <div className="mb-4">
          <div className="h-1 w-full rounded-full bg-zinc-800">
            <div className="h-1 w-3/5 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-2 text-xs text-zinc-500">Etapa 3 de 5</p>
        </div>

        <h1 className="mb-2 text-2xl font-semibold">Fotos do veículo</h1>
        <p className="mb-6 text-sm text-zinc-400">Quanto mais claras, melhor o anúncio.</p>

        {/* Checklist */}
        <ul className="mb-6 space-y-2">
          {checklist.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
              <span className={`h-5 w-5 rounded-full border text-center text-xs leading-5 ${
                previews[i] ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-zinc-700'
              }`}>{previews[i] ? '✓' : i + 1}</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Preview grid */}
        {previews.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="aspect-square rounded-xl object-cover" />
            ))}
          </div>
        )}

        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />

        <button
          onClick={() => inputRef.current?.click()}
          className="mb-3 w-full rounded-2xl border border-zinc-700 bg-zinc-900 py-4 text-sm font-medium text-zinc-200 hover:border-emerald-500"
        >
          + Adicionar fotos
        </button>

        <button
          onClick={() => {
            const raw = sessionStorage.getItem('ad_draft')
            const draft = raw ? JSON.parse(raw) : {}
            draft.photos = previews
            sessionStorage.setItem('ad_draft', JSON.stringify(draft))
            router.push('/anunciar-preview/revisar')
          }}
          className="w-full rounded-2xl bg-emerald-500 py-4 font-semibold text-black"
        >
          Continuar →
        </button>
      </div>
    </main>
  )
}
