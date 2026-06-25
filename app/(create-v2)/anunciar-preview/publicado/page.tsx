'use client'

import { useRouter } from 'next/navigation'

export default function PublicadoPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-6xl">✅</div>
      <h1 className="mb-2 text-2xl font-semibold">Anúncio publicado!</h1>
      <p className="mb-8 text-zinc-400 text-sm">Seu anúncio foi enviado para revisão e será publicado em breve.</p>
      <button
        onClick={() => router.push('/')}
        className="rounded-2xl bg-emerald-500 px-8 py-4 font-semibold text-black"
      >
        Ir para o início
      </button>
      <button
        onClick={() => {
          sessionStorage.removeItem('ad_draft')
          router.push('/anunciar-preview')
        }}
        className="mt-3 text-sm text-zinc-400 underline"
      >
        Criar outro anúncio
      </button>
    </main>
  )
}
