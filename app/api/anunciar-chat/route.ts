import { google } from '@ai-sdk/google'
import { streamText, type CoreMessage } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Remove o 'oi' inicial automatico para o Gemini comecar do zero
  const historico: CoreMessage[] = (messages as CoreMessage[]).filter(
    (_m, i) => i !== 0
  )

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    temperature: 0.2,
    system: `Voce e um atendente da plataforma CaminhoesBR que cria anuncios de caminhoes.

ANALISE O HISTORICO COMPLETO DA CONVERSA antes de responder.
Identifique quais topicos JA foram respondidos e VA PARA O PROXIMO.

Topicos a coletar nesta ordem:
T1: nome, WhatsApp e cidade
T2: vender ou comprar
T3: marca, modelo, ano e km
T4: estado da mecanica e se e particular ou revenda
T5: valor, aceita troca e fotos
T6: exibir resumo e pedir confirmacao
T7: se confirmado, escrever ANUNCIO_CONFIRMADO seguido de JSON com todos os dados

Se o historico estiver vazio, comece com: Ola! Qual seu nome, WhatsApp e cidade?

REGRAS ABSOLUTAS:
- Se T1 ja foi respondido, NAO pergunte T1 de novo
- Se T2 ja foi respondido, NAO pergunte T2 de novo
- Mesma logica para todos os topicos
- Sempre avance para o proximo topico nao respondido
- Sem asteriscos, markdown ou formatacao especial
- Respostas curtas e diretas`,
    messages: historico.length > 0 ? historico : [{ role: 'user', content: 'iniciar' }],
  })

  return result.toDataStreamResponse()
}
