import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'

export async function POST(req: NextRequest) {
  try {
    const { urls, nomeArquivo } = await req.json()

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'Nenhuma URL fornecida' }, { status: 400 })
    }

    const zip = new JSZip()

    await Promise.all(
      urls.map(async (url: string, i: number) => {
        try {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`Falha ao buscar: ${url}`)
          const buffer = await res.arrayBuffer()
          const ext = url.split('.').pop()?.split('?')[0] || 'jpg'
          zip.file(`foto-${i + 1}.${ext}`, buffer)
        } catch (e) {
          console.error('Erro na foto:', url, e)
        }
      })
    )

    const zipUint8 = await zip.generateAsync({ type: 'uint8array' })
    const nome = (nomeArquivo || 'fotos-caminhao').replace(/[^a-z0-9-_]/gi, '-').toLowerCase()

    return new Response(zipUint8, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${nome}.zip"`,
      },
    })
  } catch (error) {
    console.error('Erro ao gerar ZIP:', error)
    return NextResponse.json({ error: 'Erro interno ao gerar ZIP' }, { status: 500 })
  }
}
