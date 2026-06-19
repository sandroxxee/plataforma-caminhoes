'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

type Anuncio = {
  id: string
  titulo: string
  marca: string
  modelo: string
  ano: number
  fotos: string[]
}

const FRASES_PREMIUM = [
  '\uD83D\uDE9B Oportunidade premium! Caminh\u00E3o ideal para voc\u00EA. Chame agora!',
  '\uD83D\uDD25 Raridade no mercado! Este caminh\u00E3o n\u00E3o vai durar. Fale j\u00E1!',
  '\u2B50 Sele\u00E7\u00E3o premium de caminh\u00F5es para o seu neg\u00F3cio. Entre em contato!',
  '\uD83D\uDCBC Oportunidade \u00FAnica! Caminh\u00E3o revisado e pronto pra rodar. Chame agora!',
  '\uD83C\uDFC6 Os melhores caminh\u00F5es est\u00E3o aqui. N\u00E3o perca essa chance!',
  '\uD83D\uDE80 Caminh\u00E3o de alta performance esperando por voc\u00EA. Consulte agora!',
  '\uD83D\uDC8E Premium e na sua m\u00E3o. Caminh\u00E3o top de linha dispon\u00EDvel. Chame j\u00E1!',
  '\u2705 Estoque selecionado! Caminh\u00F5es premium para o seu gosto. Fale conosco!',
]

export default function FerramentasFotosPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [selecionado, setSelecionado] = useState<Anuncio | null>(null)
  const [fotosSelecionadas, setFotosSelecionadas] = useState<Set<string>>(new Set())
  const [fraseIndex, setFraseIndex] = useState(0)
  const [copiado, setCopiado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    carregarAnuncios()
  }, [])

  async function carregarAnuncios() {
    const { data } = await supabase
      .from('anuncios')
      .select('id, titulo, marca, modelo, ano, fotos')
      .order('created_at', { ascending: false })
      .limit(100)
    if (data) setAnuncios(data)
  }

  const anunciosFiltrados = anuncios.filter(a =>
    `${a.titulo} ${a.marca} ${a.modelo}`.toLowerCase().includes(busca.toLowerCase())
  )

  function toggleFoto(url: string) {
    setFotosSelecionadas(prev => {
      const novo = new Set(prev)
      novo.has(url) ? novo.delete(url) : novo.add(url)
      return novo
    })
  }

  function selecionarTodas() {
    if (!selecionado) return
    setFotosSelecionadas(new Set(selecionado.fotos))
  }

  function limparSelecao() {
    setFotosSelecionadas(new Set())
  }

  async function baixarFotosSoltas() {
    if (fotosSelecionadas.size === 0) return
    setLoading(true)
    const urls = Array.from(fotosSelecionadas)
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      const nome = url.split('/').pop() || `foto-${i + 1}.jpg`
      try {
        const res = await fetch(url)
        const blob = await res.blob()
        saveAs(blob, nome)
        await new Promise(r => setTimeout(r, 300))
      } catch (e) {
        console.error('Erro ao baixar foto:', url, e)
      }
    }
    setLoading(false)
  }

  async function baixarZip() {
    if (fotosSelecionadas.size === 0) return
    setLoading(true)
    const zip = new JSZip()
    const urls = Array.from(fotosSelecionadas)
    const nomeArquivo = selecionado
      ? `${selecionado.marca}-${selecionado.modelo}-${selecionado.ano}`.replace(/\s+/g, '-').toLowerCase()
      : 'fotos-caminhao'

    await Promise.all(
      urls.map(async (url, i) => {
        try {
          const res = await fetch(url)
          const blob = await res.blob()
          const ext = url.split('.').pop()?.split('?')[0] || 'jpg'
          zip.file(`foto-${i + 1}.${ext}`, blob)
        } catch (e) {
          console.error('Erro ao adicionar ao ZIP:', url, e)
        }
      })
    )

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, `${nomeArquivo}.zip`)
    setLoading(false)
  }

  function copiarFrase() {
    navigator.clipboard.writeText(FRASES_PREMIUM[fraseIndex]).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  function proximaFrase() {
    setFraseIndex(i => (i + 1) % FRASES_PREMIUM.length)
  }

  function compartilharWhatsApp() {
    const frase = encodeURIComponent(FRASES_PREMIUM[fraseIndex])
    window.open(`https://wa.me/?text=${frase}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-400 mb-1">\uD83D\uDCF8 Ferramentas de Fotos</h1>
          <p className="text-gray-400 text-sm">Baixe fotos soltas ou em ZIP e compartilhe com frases premium</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Lista de An\u00FAncios */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">An\u00FAncios</h2>
              <input
                type="text"
                placeholder="Buscar por marca, modelo..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 mb-3 focus:outline-none focus:border-orange-500"
              />
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {anunciosFiltrados.map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setSelecionado(a); setFotosSelecionadas(new Set()) }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selecionado?.id === a.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="font-medium truncate">{a.titulo || `${a.marca} ${a.modelo}`}</div>
                    <div className="text-xs opacity-70">{a.marca} \u2022 {a.ano} \u2022 {a.fotos?.length ?? 0} fotos</div>
                  </button>
                ))}
                {anunciosFiltrados.length === 0 && (
                  <p className="text-gray-600 text-sm text-center py-4">Nenhum an\u00FAncio encontrado</p>
                )}
              </div>
            </div>
          </div>

          {/* Grade de Fotos + A\u00E7\u00F5es */}
          <div className="lg:col-span-2 space-y-4">

            {selecionado ? (
              <>
                <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 className="font-bold text-white">{selecionado.titulo || `${selecionado.marca} ${selecionado.modelo}`}</h2>
                      <p className="text-xs text-gray-400">{fotosSelecionadas.size} de {selecionado.fotos?.length ?? 0} fotos selecionadas</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={selecionarTodas} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs text-white transition">Todas</button>
                      <button onClick={limparSelecao} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs text-white transition">Limpar</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {(selecionado.fotos || []).map((url, i) => (
                    <button
                      key={i}
                      onClick={() => toggleFoto(url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        fotosSelecionadas.has(url)
                          ? 'border-orange-500 scale-95'
                          : 'border-transparent hover:border-gray-500'
                      }`}
                    >
                      <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      {fotosSelecionadas.has(url) && (
                        <div className="absolute inset-0 bg-orange-500/30 flex items-center justify-center">
                          <span className="text-2xl">\u2713</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {fotosSelecionadas.size > 0 && (
                  <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">\u2B07\uFE0F Download ({fotosSelecionadas.size} fotos)</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={baixarFotosSoltas}
                        disabled={loading}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-semibold text-sm transition"
                      >
                        {loading ? '\u23F3 Baixando...' : '\uD83D\uDCE5 Baixar Fotos Soltas'}
                      </button>
                      <button
                        onClick={baixarZip}
                        disabled={loading}
                        className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl font-semibold text-sm transition"
                      >
                        {loading ? '\u23F3 Gerando ZIP...' : '\uD83D\uDDDC\uFE0F Baixar como ZIP'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-900 rounded-2xl p-12 border border-gray-800 text-center">
                <p className="text-4xl mb-3">\uD83D\uDE9B</p>
                <p className="text-gray-400">Selecione um an\u00FAncio para ver as fotos</p>
              </div>
            )}

            {/* Frases Premium */}
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">\uD83D\uDCAC Frase Premium</h3>
              <div className="bg-gray-800 rounded-xl p-4 mb-3 border border-orange-500/30">
                <p className="text-white font-medium text-sm leading-relaxed">{FRASES_PREMIUM[fraseIndex]}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={proximaFrase} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition">
                  \uD83D\uDD04 Pr\u00F3xima
                </button>
                <button
                  onClick={copiarFrase}
                  className={`px-4 py-2 rounded-lg text-sm text-white transition ${
                    copiado ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {copiado ? '\u2705 Copiado!' : '\uD83D\uDCCB Copiar'}
                </button>
                <button onClick={compartilharWhatsApp} className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-sm text-white transition">
                  \uD83D\uDCF2 WhatsApp
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
