import { GoogleGenAI, Type } from '@google/genai'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const ferramentas = [
  {
    functionDeclarations: [
      {
        name: 'cadastrar_anuncio',
        description: 'Dispare quando tiver coletado todos os dados do anuncio: modelo, preco, km, cidade e contato do vendedor.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            nome: { type: Type.STRING, description: 'Nome do vendedor' },
            whatsapp: { type: Type.STRING, description: 'WhatsApp ou telefone com DDD' },
            cidade: { type: Type.STRING, description: 'Cidade do vendedor' },
            tipo: { type: Type.STRING, description: 'vender ou comprar' },
            modelo: { type: Type.STRING, description: 'Marca, modelo e ano do veiculo' },
            km: { type: Type.STRING, description: 'Quilometragem' },
            mecanica: { type: Type.STRING, description: 'Estado da mecanica' },
            tipo_vendedor: { type: Type.STRING, description: 'particular ou revenda' },
            preco: { type: Type.NUMBER, description: 'Preco de venda em reais' },
            aceita_troca: { type: Type.STRING, description: 'sim ou nao' },
          },
          required: ['nome', 'whatsapp', 'modelo']
        }
      }
    ]
  }
]

export async function POST(req: Request) {
  try {
    const { mensagem, historico } = await req.json()

    const chat = ai.chats.create({
      model: 'gemini-1.5-flash',
      config: {
        systemInstruction: `Voce e um atendente simpatico da plataforma CaminhoesBR.
Sua tarefa e criar anuncios de caminhoes conversando naturalmente.

Colete nesta ordem, uma informacao por vez:
1. Nome, WhatsApp e cidade
2. Vai vender ou comprar?
3. Marca, modelo, ano e km
4. Estado da mecanica e se e particular ou revenda
5. Valor pedido e se aceita troca
6. Mostre um resumo e confirme: Posso publicar o anuncio?
7. Se confirmar: chame a funcao cadastrar_anuncio com todos os dados

Regras: sem asteriscos, seja breve, uma pergunta por vez.`,
        tools: ferramentas
      },
      history: historico ?? []
    })

    let response = await chat.sendMessage({ message: mensagem })

    if (response.functionCalls && response.functionCalls.length > 0) {
      const chamada = response.functionCalls[0]
      const args = chamada.args as Record<string, unknown>

      const supabase = await createClient()
      const { error } = await supabase.from('anuncios_chat').insert([args])

      const resultado = error
        ? { status: 'erro', mensagem: error.message }
        : { status: 'sucesso' }

      response = await chat.sendMessage({
        message: [
          {
            functionResponse: {
              name: chamada.name,
              response: { result: resultado }
            }
          }
        ]
      })
    }

    const historicoAtualizado = await chat.getHistory()

    return NextResponse.json({
      textoBot: response.text,
      historicoAtualizado
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}
