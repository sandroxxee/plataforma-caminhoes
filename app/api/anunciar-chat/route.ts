import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Lê a chave de API do ambiente
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const { mensagem, historico, dadosColetados } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'Chave de API Gemini não configurada' }, { status: 500 });
    }

    const genAI = new GoogleGenAI({ apiKey });

    // Tratamento rigoroso do histórico para evitar INVALID_ARGUMENT
    // O Gemini exige que o histórico alterne entre 'user' e 'model'
    let lastRole = '';
    const formattedHistory = (Array.isArray(historico) ? historico : [])
      .filter(msg => msg.role === 'user' || msg.role === 'model' || msg.role === 'assistant')
      .map(msg => ({
        role: (msg.role === 'assistant' ? 'model' : msg.role) as "user" | "model",
        content: msg.content || msg.text || ''
      }))
      .filter(msg => {
        if (msg.role === lastRole) return false;
        lastRole = msg.role;
        return true;
      })
      .map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

    // Inicia o chat com o histórico validado no novo SDK @google/genai
    const chat = genAI.chats.create({
      model: 'gemini-1.5-pro',
      config: {
        systemInstruction: `Você é o assistente inteligente da plataforma Caminhões à Venda.
Seu objetivo é ajudar o usuário a criar um anúncio completo.
Siga estas etapas:
1. Identificar Marca, Modelo e Ano.
2. Identificar Valor e Quilometragem.
3. Identificar Localização (Cidade/Estado).
4. Solicitar uma breve descrição.

Dados já coletados: ${JSON.stringify(dadosColetados || {})}

REGRAS:
- Seja direto e amigável.
- Não use formatação markdown pesada (como muitos asteriscos).
- Se os dados estiverem completos, gere um resumo e peça confirmação.`,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
      history: formattedHistory,
    });

    const result = await chat.sendMessage({ message: mensagem });
    const text = result.text || "";

    return NextResponse.json({
      textoBot: text,
      historicoAtualizado: chat.getHistory()
    });

  } catch (error: any) {
    console.error('Erro na API Gemini:', error);

    // Tratamento específico para erros comuns de argumento
    if (error?.message?.includes('INVALID_ARGUMENT')) {
      return NextResponse.json({
        error: 'Erro de formato na conversa. Reiniciando chat.',
        textoBot: "Tive um pequeno problema ao processar nossa conversa. Poderia repetir o que deseja fazer?"
      }, { status: 400 });
    }

    return NextResponse.json({ error: 'Erro interno no assistente' }, { status: 500 });
  }
}
