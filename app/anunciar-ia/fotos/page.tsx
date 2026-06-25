'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const CHECKLIST = [
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
    Array.from(e.target.files ?? []).forEach(f => {
      const reader = new FileReader()
      reader.onload = ev => {
        if (ev.target?.result) setPreviews(p => [...p, ev.target!.result as string])
      }
      reader.readAsDataURL(f)
    })
  }

  function continuar() {
    const raw = sessionStorage.getItem('ia_draft')
    if (raw) {
      const d = JSON.parse(raw)
      d.photos = previews
      sessionStorage.setItem('ia_draft', JSON.stringify(d))
    }
    router.push('/anunciar-ia/revisar')
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 pb-32 pt-6">
      <div className="mx-auto max-w-md">
        <div className="mb-4">
          <div className="h-1 w-full rounded-full bg-zinc-800">
            <div className="h-1 w-[60%] rounded-full bg-emerald-500" />
          </div>
          <p className="mt-1.5 text-xs text-zinc-500">Etapa 3 de 5</p>
        </div>

        <h1 className="mb-1 text-2xl font-semibold">Fotos do veículo</h1>
        <p className="mb-6 text-sm text-zinc-400">Quanto mais claras, melhor o anúncio converter.</p>

        <ul className="mb-6 space-y-2.5">
          {CHECKLIST.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                previews[i] ? 'border-emerald-500 bg-emerald-500 font-bold text-black' : 'border-zinc-700'
              }`}>
                {previews[i] ? '✓' : i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>

        {previews.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="aspect-square w-full rounded-xl object-cover" />
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

        <button onClick={continuar} className="w-full rounded-2xl bg-emerald-500 py-4 font-semibold text-black">
          Continuar →
        </button>
      </div>
    </main>
  )
}
