import { GoogleGenAI, Type, FunctionDeclaration, Tool } from '@google/genai'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const ferramentas: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'cadastrar_pessoa',
        description: 'Dispare assim que coletar o nome e o whatsapp de um novo usuario para registra-lo.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            nome: { type: Type.STRING, description: 'Nome completo' },
            whatsapp: { type: Type.STRING, description: 'Numero de telefone ou WhatsApp com DDD' }
          },
          required: ['nome', 'whatsapp']
        }
      } as FunctionDeclaration,
      {
        name: 'cadastrar_anuncio',
        description: 'Dispare quando o usuario trouxer os dados para criar o anuncio do veiculo.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            modelo: { type: Type.STRING, description: 'Modelo do caminhao ou veiculo (ex: Volvo VM 270)' },
            preco: { type: Type.NUMBER, description: 'Preco de venda em reais (apenas numeros)' },
            descricao: { type: Type.STRING, description: 'Detalhes opcionais sobre o estado do veiculo' }
          },
          required: ['modelo']
        }
      } as FunctionDeclaration
    ]
  }
]

export async function POST(req: Request) {
  try {
    const { mensagem, historico } = await req.json()

    const chat = ai.chats.create({
      model: 'gemini-1.5-flash',
      config: {
        systemInstruction: `Voce e um assistente virtual e negociador especializado na plataforma de caminhoes CaminhoesBR.
Converse de maneira natural, limpa e profissional.
Se o usuario quiser se cadastrar, peca o nome e o contato. Coletou? Chame 'cadastrar_pessoa'.
Se o usuario quiser vender ou anunciar, descubra o modelo e detalhes. Coletou? Chame 'cadastrar_anuncio'.
Sempre conduza a conversa de forma leve, pedindo uma informacao de cada vez para parecer um chat humano.`,
        tools: ferramentas
      },
      history: historico ?? []
    })

    let response = await chat.sendMessage({ message: mensagem })

    if (response.functionCalls && response.functionCalls.length > 0) {
      const chamada = response.functionCalls[0]
      const nomeFuncao = chamada.name
      const argumentos = chamada.args as Record<string, unknown>

      let resultadoDoBanco: Record<string, unknown>

      if (nomeFuncao === 'cadastrar_pessoa') {
        const { data, error } = await supabase
          .from('usuarios')
          .insert([{ nome: argumentos.nome, whatsapp: argumentos.whatsapp }])
          .select()

        resultadoDoBanco = error
          ? { status: 'erro', mensagem: error.message }
          : { status: 'sucesso', id_usuario: (data as Record<string, unknown>[])[0]?.id }

      } else if (nomeFuncao === 'cadastrar_anuncio') {
        const { data, error } = await supabase
          .from('anuncios_chat')
          .insert([{
            modelo: argumentos.modelo,
            preco: argumentos.preco ?? null,
            descricao: argumentos.descricao ?? ''
          }])
          .select()

        resultadoDoBanco = error
          ? { status: 'erro', mensagem: error.message }
          : { status: 'sucesso', id_anuncio: (data as Record<string, unknown>[])[0]?.id }

      } else {
        resultadoDoBanco = { status: 'funcao_desconhecida' }
      }

      response = await chat.sendMessage({
        message: [
          {
            functionResponse: {
              name: nomeFuncao,
              response: { result: resultadoDoBanco }
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
