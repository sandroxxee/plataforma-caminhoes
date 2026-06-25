'use client'

import { useRouter } from 'next/navigation'

export default function PublicadoPage() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center text-zinc-100">
      <div className="mb-4 text-6xl">✅</div>
      <h1 className="mb-2 text-2xl font-semibold">Anúncio publicado!</h1>
      <p className="mb-8 text-sm text-zinc-400">
        Seu anúncio foi enviado para revisão e será publicado em breve.
      </p>
      <button
        onClick={() => router.push('/')}
        className="rounded-2xl bg-emerald-500 px-8 py-4 font-semibold text-black"
      >
        Ir para o início
      </button>
      <button
        onClick={() => {
          sessionStorage.removeItem('ia_draft')
          router.push('/anunciar-ia')
        }}
        className="mt-3 text-sm text-zinc-400 underline"
      >
        Criar outro anúncio
      </button>
    </main>
  )
}
