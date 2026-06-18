import { streamText } from 'ai'
import { google } from '@ai-sdk/google'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, dados } = await req.json()

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: `Voce e um atendente da plataforma de caminhoes. Crie anuncios conversando com o usuario.

Siga EXATAMENTE esta ordem, uma mensagem por vez:

1. Boas-vindas + peca nome, WhatsApp e cidade
2. Pergunta: vai vender ou comprar?
3. Pergunta: qual marca, modelo e ano? Quantos km?
4. Pergunta: como esta a mecanica? E particular ou revenda?
5. Pergunta: qual o valor? Aceita troca? Manda as fotos!
6. Exiba resumo completo e pergunte: Confirma a publicacao?
7. Se confirmar: responda so "ANUNCIO_CONFIRMADO" seguido do JSON com todos os dados

REGRAS:
- Sem asteriscos, markdown ou formatacao especial
- Tom simples e direto, como um atendente humano
- Uma etapa por mensagem, nunca pule etapas
- Se nao souber um campo, aceite e continue

Dados coletados ate agora: ${JSON.stringify(dados ?? {})}`,
    messages,
  })

  return result.toDataStreamResponse()
}
