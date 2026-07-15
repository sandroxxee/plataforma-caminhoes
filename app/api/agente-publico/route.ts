import { NextRequest, NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public"; // Bypassa RLS
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  let inputDados: any = {};
  try {
    const body = await req.json();
    const { mensagem, dados, etapa } = body;
    inputDados = dados || {};
    const supabase = createPublicClient();

    if (!apiKey) {
      return NextResponse.json({ resposta: "Erro: Chave do Gemini não configurada no .env" }, { status: 500 });
    }

    const genAI = new GoogleGenAI({ apiKey });

    const prompt = `
      Você é um assistente de anúncios de caminhões.
      Dados coletados: ${JSON.stringify(dados || {})}
      Mensagem do usuário: "${mensagem}"

      Extraia: marca, modelo, preco, ano, cidade, estado, whatsapp.
      Se tiver tudo (marca, modelo, preco, cidade, estado, whatsapp), retorne finalizado: true.

      Responda APENAS em JSON:
      {
        "resposta": "Sua mensagem aqui",
        "dadosExtraidos": { ... },
        "finalizado": boolean
      }
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt
    });

    const jsonStr = (response.text || "").replace(/```json|```/g, "").trim();
    const aiResponse = JSON.parse(jsonStr);

    const novosDados = { ...(dados || {}), ...(aiResponse.dadosExtraidos || {}) };

    if (aiResponse.finalizado) {
      const { error } = await (supabase.from("trucks") as any).insert({
        titulo: `${novosDados.marca || ''} ${novosDados.modelo || ''}`.trim(),
        marca: novosDados.marca,
        modelo: novosDados.modelo,
        preco: novosDados.preco ? Number(String(novosDados.preco).replace(/\D/g, "")) : 0,
        cidade: novosDados.cidade,
        estado: novosDados.estado,
        whatsapp: novosDados.whatsapp ? String(novosDados.whatsapp).replace(/\D/g, "") : "",
        status: "aprovado"
      });
      if (error) throw error;
      aiResponse.resposta = "✅ Anúncio publicado com sucesso!";
    }

    return NextResponse.json({
      resposta: aiResponse.resposta,
      dados: novosDados,
      etapa: aiResponse.finalizado ? "finalizado" : "conversando"
    });
  } catch (error) {
    console.error("ERRO AGENTE:", error);
    return NextResponse.json({ resposta: "Tive um erro técnico. Pode repetir?", dados: inputDados }, { status: 500 });
  }
}
