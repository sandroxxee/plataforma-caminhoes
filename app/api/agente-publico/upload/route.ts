import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `publico/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage
      .from('anuncios-fotos')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      })

    if (error) {
      console.error('Erro upload Supabase:', error)
      return NextResponse.json({ error: 'Falha ao fazer upload' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from('anuncios-fotos')
      .getPublicUrl(fileName)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    console.error('Erro no upload publico:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
