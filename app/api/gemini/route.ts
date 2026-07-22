import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, contexto } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt é obrigatório." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        resposta: "Assistente IA Modo Simulado: (Para respostas da IA em tempo real com Gemini, configure a chave GEMINI_API_KEY no arquivo .env.local).\n\n" +
          `Sugestão para "${prompt}": Recomendamos comparar com 3 anúncios similares na mesma região, avaliar quilometragem, histórico de revisões na concessionária e pneus.`,
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = ai.models ? ai.models : null;

    const systemInstruction = `Você é o Assistente Especialista em Mercado de Caminhões e Máquinas Pesadas da plataforma "Caminhões à Venda". 
Sua missão é ajudar o administrador e vendedores a precificar veículos, criar descrições comerciais atrativas e analisar oportunidades de venda no Brasil.`;

    const fullPrompt = `${systemInstruction}\n\nContexto: ${contexto || "Marketplace de Caminhões"}\n\nPergunta do Administrador: ${prompt}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      })
    });

    const resultData = await response.json();
    const textResponse = resultData?.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar resposta no momento.";

    return NextResponse.json({ success: true, resposta: textResponse });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
