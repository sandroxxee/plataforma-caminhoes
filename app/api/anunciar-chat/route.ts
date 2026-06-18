import { google } from '@ai-sdk/google'
import { streamText, type CoreMessage } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Remove a mensagem inicial hardcoded do cliente (role: assistant, id: 'init')
  // para nao confundir o Gemini com mensagem fora do padrao
  const historico: CoreMessage[] = (messages as CoreMessage[]).filter(
    (m) => !(m.role === 'assistant' && (m as { id?: string }).id === 'init')
  )

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: `Voce e um atendente simpatico da plataforma de caminhoes CaminhoesBR.
Sua tarefa e coletar dados para criar um anuncio conversando naturalmente.

Colete nesta ordem, avancando conforme o usuario responde:
1. Nome, WhatsApp e cidade
2. Vai vender ou comprar?
3. Marca, modelo, ano e km
4. Estado da mecanica e se e particular ou revenda
5. Valor pedido, aceita troca e fotos
6. Mostre um resumo e pergunte: Confirma a publicacao?
7. Se confirmar: escreva ANUNCIO_CONFIRMADO e um JSON com os dados

REGRAS:
- Leia todo o historico antes de responder
- Nunca repita pergunta ja respondida
- Avance sempre para o proximo topico
- Sem asteriscos ou markdown
- Seja breve e direto`,
    messages: historico,
  })

  return result.toDataStreamResponse()
}
