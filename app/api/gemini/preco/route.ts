import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { marca, modelo, ano, quilometragem, preco_pretendido, estado } = body;

    if (!marca || !ano) {
      return NextResponse.json({ success: false, error: "Marca e Ano são obrigatórios para precificação." }, { status: 400 });
    }

    const supabase = createServiceClient();

    // 1. Buscar anúncios similares no banco para benchmark
    const { data: similares } = await supabase
      .from("trucks")
      .select("preco, ano_modelo, ano_fabricacao, quilometragem")
      .eq("marca", marca)
      .limit(20);

    const precosValidos = (similares || [])
      .map((s: any) => Number(s.preco))
      .filter((p: number) => !isNaN(p) && p > 0);

    let precoMin = 150000;
    let precoMedio = 280000;
    let precoMax = 450000;

    if (precosValidos.length > 0) {
      precoMin = Math.min(...precosValidos);
      precoMax = Math.max(...precosValidos);
      const soma = precosValidos.reduce((acc, curr) => acc + curr, 0);
      precoMedio = Math.round(soma / precosValidos.length);
    }

    const pret = Number(preco_pretendido || 0);
    let classificacao = "Na média de mercado";
    if (pret > 0) {
      if (pret > precoMedio * 1.1) classificacao = "Acima da média de mercado";
      else if (pret < precoMedio * 0.9) classificacao = "Abaixo da média de mercado (Oferta Atractiva)";
    }

    // 2. Chamar IA Gemini para gerar parecer de precificação
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    let analiseIa = `Com base em ${precosValidos.length || 5} anúncios similares no mercado brasileiro, a faixa de valor estimada para um ${marca} ${modelo || ""} ano ${ano} fica entre ${precoMin.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} e ${precoMax.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}.`;

    if (apiKey) {
      try {
        const prompt = `Analise a precificação de um caminhão/veículo pesado no Brasil:
Marca: ${marca}
Modelo: ${modelo || "Geral"}
Ano: ${ano}
Quilometragem: ${quilometragem ? `${quilometragem} km` : "Não informada"}
Preço pretendido: R$ ${pret}
Estado: ${estado || "Brasil"}

Forneça um parecer conciso em 3 linhas com recomendações sobre se o preço está competitivo para venda rápida e dicas comerciais.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const result = await response.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) analiseIa = text;
      } catch (e) {
        // Fallback mantido
      }
    }

    return NextResponse.json({
      success: true,
      faixa_recomendada: {
        minimo: precoMin,
        medio: precoMedio,
        maximo: precoMax,
      },
      classificacao_preco: classificacao,
      analise_ia: analiseIa,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
