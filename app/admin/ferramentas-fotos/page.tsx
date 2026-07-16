'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { AdminLayout } from '@/components/AdminLayout'
import { Download, RefreshCw, Copy, Send, CheckSquare, Square, FolderArchive } from 'lucide-react'

type Anuncio = {
  id: string
  titulo: string
  marca: string
  modelo: string
  ano: number
  fotos: string[]
}

const FRASES_PREMIUM = [
  '🚛 Oportunidade premium! Caminhão ideal para você. Chame agora!',
  '🔥 Raridade no mercado! Este caminhão não vai durar. Fale já!',
  '⭐ Seleção premium de caminhões para o seu negócio. Entre em contato!',
  '💼 Oportunidade única! Caminhão revisado e pronto pra rodar. Chame agora!',
  '🏆 Os melhores caminhões estão aqui. Não perca essa chance!',
  '🚀 Caminhão de alta performance esperando por você. Consulte agora!',
  '💎 Premium e na sua mão. Caminhão top de linha disponível. Chame já!',
  '✅ Estoque selecionado! Caminhões premium para o seu gosto. Fale conosco!',
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
    <AdminLayout
      title="Ferramentas de Fotos"
      subtitle="Baixe fotos soltas ou em ZIP e compartilhe com frases premium."
      badge="Admin"
    >
      <div className="admin-grid" style={{ gridTemplateColumns: "1fr 2fr", gap: 20, alignItems: "start" }}>

        {/* Lista de Anúncios */}
        <section className="admin-card" style={{ display: "block", padding: 18 }}>
          <h2 className="admin-card-title" style={{ margin: "0 0 12px", fontSize: 16 }}>Anúncios</h2>
          <div className="admin-input-group" style={{ marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Buscar por marca, modelo..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "60vh", overflowY: "auto", paddingRight: 4 }}>
            {anunciosFiltrados.map(a => {
              const active = selecionado?.id === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => { setSelecionado(a); setFotosSelecionadas(new Set()) }}
                  className="admin-btn"
                  style={{
                    width: "100%",
                    display: "block",
                    textAlign: "left",
                    background: active ? "var(--blue)" : "var(--soft)",
                    color: active ? "#ffffff" : "var(--text)",
                    border: "1px solid var(--line)",
                    padding: "10px 14px",
                    borderRadius: 12
                  }}
                >
                  <strong style={{ display: "block", fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.titulo || `${a.marca} ${a.modelo}`}
                  </strong>
                  <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 700 }}>
                    {a.marca} • {a.ano} • {a.fotos?.length ?? 0} fotos
                  </span>
                </button>
              );
            })}
            {anunciosFiltrados.length === 0 && (
              <p style={{ color: "var(--muted)", fontSize: 13, textAlign: "center", padding: 12 }}>Nenhum anúncio encontrado</p>
            )}
          </div>
        </section>

        {/* Grade de Fotos + Ações */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {selecionado ? (
            <>
              <section className="admin-card" style={{ display: "block", padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h2 className="admin-card-title" style={{ margin: 0, fontSize: 16 }}>{selecionado.titulo || `${selecionado.marca} ${selecionado.modelo}`}</h2>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>
                      {fotosSelecionadas.size} de {selecionado.fotos?.length ?? 0} fotos selecionadas
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={selecionarTodas} className="admin-btn admin-btn-edit" style={{ padding: "8px 14px", borderRadius: 10 }}>Todas</button>
                    <button onClick={limparSelecao} className="admin-btn admin-btn-edit" style={{ padding: "8px 14px", borderRadius: 10 }}>Limpar</button>
                  </div>
                </div>
              </section>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
                {(selecionado.fotos || []).map((url, i) => {
                  const isSelected = fotosSelecionadas.has(url);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleFoto(url)}
                      style={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: 14,
                        overflow: "hidden",
                        border: isSelected ? "3px solid var(--blue)" : "1.5px solid var(--line)",
                        background: "var(--soft)",
                        cursor: "pointer",
                        padding: 0,
                        transform: isSelected ? "scale(0.96)" : "none",
                        transition: "all 0.15s"
                      }}
                    >
                      <img src={url} alt={`Foto ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {isSelected && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(24,119,242,0.22)", display: "grid", placeItems: "center", color: "#ffffff", fontWeight: 900, fontSize: 18 }}>
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {fotosSelecionadas.size > 0 && (
                <section className="admin-card" style={{ display: "block", padding: 18 }}>
                  <h3 className="admin-card-title" style={{ margin: "0 0 12px", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>
                    ⬇️ Download ({fotosSelecionadas.size} fotos)
                  </h3>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={baixarFotosSoltas}
                      disabled={loading}
                      className="admin-btn admin-btn-approve"
                      style={{ flex: 1, height: 44, gap: 8 }}
                    >
                      <Download size={16} />
                      {loading ? 'Baixando...' : 'Baixar Fotos Soltas'}
                    </button>
                    <button
                      onClick={baixarZip}
                      disabled={loading}
                      className="admin-btn"
                      style={{ flex: 1, height: 44, background: "#7c3aed", color: "#ffffff", gap: 8 }}
                    >
                      <FolderArchive size={16} />
                      {loading ? 'Gerando ZIP...' : 'Baixar como ZIP'}
                    </button>
                  </div>
                </section>
              )}
            </>
          ) : (
            <section className="admin-card" style={{ display: "grid", placeItems: "center", padding: 48, textAlign: "center" }}>
              <p style={{ fontSize: 36, margin: "0 0 10px" }}>🚛</p>
              <p style={{ color: "var(--muted)", fontWeight: 700, fontSize: 14 }}>Selecione um anúncio para ver as fotos</p>
            </section>
          )}

          {/* Frases Premium */}
          <section className="admin-card" style={{ display: "block", padding: 18 }}>
            <h3 className="admin-card-title" style={{ margin: "0 0 12px", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>
              💬 Frase Premium
            </h3>
            <div style={{ background: "var(--soft)", border: "1.5px dashed var(--line)", padding: 16, borderRadius: 14, marginBottom: 12 }}>
              <p style={{ color: "var(--text)", fontWeight: 700, margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                {FRASES_PREMIUM[fraseIndex]}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={proximaFrase} className="admin-btn admin-btn-edit" style={{ padding: "8px 16px", borderRadius: 10, gap: 6 }}>
                <RefreshCw size={13} />
                Próxima
              </button>
              <button
                onClick={copiarFrase}
                className="admin-btn"
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  background: copiado ? "#22c55e" : "var(--soft)",
                  color: copiado ? "#ffffff" : "var(--text)",
                  border: "1px solid var(--line)",
                  gap: 6
                }}
              >
                <Copy size={13} />
                {copiado ? 'Copiado!' : 'Copiar'}
              </button>
              <button onClick={compartilharWhatsApp} className="admin-btn" style={{ padding: "8px 16px", borderRadius: 10, background: "#25d366", color: "#ffffff", gap: 6 }}>
                <Send size={13} />
                WhatsApp
              </button>
            </div>
          </section>

        </div>
      </div>
    </AdminLayout>
  )
}
