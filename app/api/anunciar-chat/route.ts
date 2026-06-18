import { streamText } from 'ai'
import { google } from '@ai-sdk/google'

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
7. Se confirmar: responda so ANUNCIO_CONFIRMADO seguido do JSON com todos os dados

REGRAS:
- Sem asteriscos ou formatacao especial
- Tom simples e direto
- Uma etapa por mensagem
- Se nao souber um campo, aceite e continue

Dados coletados: ${JSON.stringify(dados ?? {})}`,
    messages,
  })

  return result.toDataStreamResponse()
}
