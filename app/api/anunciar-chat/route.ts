import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

const PERGUNTAS = [
  'Qual seu nome, WhatsApp e cidade?',
  'Vai vender ou comprar?',
  'Qual a marca, modelo e ano? Quantos km tem?',
  'Como esta a mecanica? E particular ou revenda?',
  'Qual o valor? Aceita troca? Pode mandar as fotos!',
]

export async function POST(req: Request) {
  const { messages } = await req.json()

  // messages[0] = boas vindas (assistant), depois alternando user/assistant
  // numero de respostas do usuario = quantidade de mensagens com role 'user'
  const respostasUsuario = messages.filter((m: { role: string }) => m.role === 'user').length

  // Se ainda tem perguntas a fazer
  if (respostasUsuario < PERGUNTAS.length) {
    const proximaPergunta = PERGUNTAS[respostasUsuario]
    return new Response(
      `0:${JSON.stringify(proximaPergunta)}\n`,
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    )
  }

  // Todas respondidas: pede resumo e confirmacao ao Gemini
  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: `Voce e um atendente de plataforma de caminhoes.
Com base no historico da conversa, faca um resumo simples dos dados do anuncio e pergunte: Confirma a publicacao?
Se o usuario confirmar, responda ANUNCIO_CONFIRMADO seguido de um JSON com todos os dados.
Sem asteriscos ou formatacao especial.`,
    messages,
  })

  return result.toDataStreamResponse()
}
