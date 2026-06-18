import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Alterado para ler a chave correta que está no seu .env.local
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export async function POST(req: Request) {
  try {
    const { mensagem, historico, dadosColetados } = await req.json();

    // Validação extra caso a chave suma por algum motivo
    if (!apiKey) {
      console.error("Erro: Chave de API da Google não encontrada no ambiente.");
      return NextResponse.json({ error: 'Configuração de IA ausente' }, { status: 500 });
    }

    const instrucaoSistema = `Voce e um assistente da plataforma de caminhoes que cria anuncios.
Siga EXATAMENTE esta ordem de perguntas, uma etapa por vez:

ETAPA 1: Pergunte nome, WhatsApp e cidade do cliente em uma so mensagem.
ETAPA 2: Pergunte se quer vender ou comprar um caminhao.
ETAPA 3: Pergunte marca, modelo, ano e quilometragem juntos.
ETAPA 4: Pergunte valor pedido, descricao/observacoes e se aceita troca, tudo junto.

Ao ter todas as respostas da ETAPA 4, exiba um resumo limpo e organizado do anuncio e pergunte na mesma linha: "Confirma a publicacao?"

REGRAS ABSOLUTAS:
- Nunca use asteriscos, markdown, negrito ou qualquer formatacao especial no texto.
- Uma etapa por mensagem, nunca pule etapas.
- Seja breve, amigavel e direto.
- Se o usuario nao souber algum campo, aceite "nao sei" e continue para a proxima etapa.
- Dados coletados ate agora: ${JSON.stringify(dadosColetados || {})}`;

    // Inicializa o chat tratando o histórico enviado pelo front-end
    const chat = ai.chats.create({
      model: 'gemini-1.5-flash',
      config: {
        systemInstruction: instrucaoSistema,
        temperature: 0.2
      },
      history: Array.isArray(historico) ? historico : []
    });

    const response = await chat.sendMessage({ message: mensagem });
    const historicoAtualizado = await chat.getHistory();

    return NextResponse.json({
      textoBot: response.text,
      historicoAtualizado
    });

  } catch (error: any) {
    // Esse console.error vai te mostrar o erro real na janela preta do terminal se algo mais falhar
    console.error('Erro detalhado na rota do assistente:', error?.message || error);
    return NextResponse.json({ error: 'Erro interno no assistente' }, { status: 500 });
  }
}