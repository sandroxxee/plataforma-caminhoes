import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type AnaliseFoto = {
  nota?: number;
  resumo?: string;
  problemas?: string[];
  recomendacoes?: string[];
  melhorUso?: string;
  corteSugerido?: {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    explicacao?: string;
  };
  areasSensiveis?: Array<{
    tipo?: string;
    descricao?: string;
  }>;
};

function limparJson(texto: string) {
  return texto
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();
}

function normalizarAnalise(data: AnaliseFoto): AnaliseFoto {
  const nota = Number(data.nota || 0);

  return {
    nota: Number.isFinite(nota) ? Math.max(0, Math.min(10, Math.round(nota))) : 0,
    resumo: String(data.resumo || "Análise concluída.").trim().slice(0, 220),
    problemas: Array.isArray(data.problemas) ? data.problemas.slice(0, 6).map(String) : [],
    recomendacoes: Array.isArray(data.recomendacoes) ? data.recomendacoes.slice(0, 6).map(String) : [],
    melhorUso: String(data.melhorUso || "Analisar manualmente").trim().slice(0, 80),
    corteSugerido: data.corteSugerido
      ? {
          x: Math.max(0, Math.min(1, Number(data.corteSugerido.x || 0))),
          y: Math.max(0, Math.min(1, Number(data.corteSugerido.y || 0))),
          w: Math.max(0, Math.min(1, Number(data.corteSugerido.w || 1))),
          h: Math.max(0, Math.min(1, Number(data.corteSugerido.h || 1))),
          explicacao: String(data.corteSugerido.explicacao || "").trim().slice(0, 180),
        }
      : undefined,
    areasSensiveis: Array.isArray(data.areasSensiveis)
      ? data.areasSensiveis.slice(0, 6).map((area) => ({
          tipo: String(area.tipo || "").trim().slice(0, 40),
          descricao: String(area.descricao || "").trim().slice(0, 140),
        }))
      : [],
  };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erro: "Faça login para analisar fotos com IA." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const imageDataUrl = String(body?.imageDataUrl || "");

  if (!imageDataUrl.startsWith("data:image/")) {
    return NextResponse.json({ erro: "Envie uma imagem válida para análise." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        erro: "OPENAI_API_KEY não configurada na Vercel. A análise com IA só funciona depois de adicionar a chave nas variáveis de ambiente.",
      },
      { status: 503 },
    );
  }

  const prompt = `Você é um especialista em fotos comerciais de caminhões usados no Brasil.
Analise a foto para ajudar um vendedor a publicar melhor o anúncio.

Retorne somente JSON válido, sem markdown, neste formato:
{
  "nota": 0-10,
  "resumo": "resumo curto da foto",
  "problemas": ["problema 1"],
  "recomendacoes": ["recomendação prática 1"],
  "melhorUso": "capa do site | foto extra | ruim para capa | boa para Facebook",
  "corteSugerido": { "x": 0.0, "y": 0.0, "w": 1.0, "h": 1.0, "explicacao": "como cortar para centralizar o caminhão" },
  "areasSensiveis": [{ "tipo": "placa|telefone|adesivo|contato|outro", "descricao": "onde aparece" }]
}

Regras:
- Não invente dados do caminhão.
- Foque em enquadramento, excesso de chão/céu, caminhão pequeno, placa visível, telefone/adesivo/contato, fundo poluído, qualidade de capa.
- O corteSugerido deve usar coordenadas normalizadas de 0 a 1 na imagem inteira.
- Recomende manter caminhão inteiro, sem cortar frente, traseira, carreta ou implemento.
- Use português do Brasil, direto, linguagem de vendedor de caminhão.`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: prompt },
              { type: "input_image", image_url: imageDataUrl, detail: "low" },
            ],
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ erro: "A IA não conseguiu analisar essa foto agora." }, { status: 502 });
    }

    const result = await response.json();
    const output = String(result.output_text || "").trim();
    const jsonText = limparJson(output);
    const analise = normalizarAnalise(JSON.parse(jsonText) as AnaliseFoto);

    return NextResponse.json({ analise });
  } catch (error) {
    console.error("Erro ao analisar foto com IA:", error);
    return NextResponse.json({ erro: "Erro ao analisar a foto. Tente outra imagem ou tente novamente." }, { status: 500 });
  }
}
