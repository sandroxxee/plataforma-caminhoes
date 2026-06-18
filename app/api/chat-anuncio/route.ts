import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type TruckContext = {
  marca?: string | null;
  modelo?: string | null;
  ano_modelo?: number | null;
  ano_fabricacao?: number | null;
  preco?: number | null;
  quilometragem?: number | null;
  motor?: string | null;
  cambio?: string | null;
  combustivel?: string | null;
  carroceria?: string | null;
  tracao?: string | null;
  cor?: string | null;
  cidade?: string | null;
  estado?: string | null;
  descricao?: string | null;
  whatsapp?: string | null;
};

function buildSystemPrompt(truck: TruckContext): string {
  const preco = truck.preco
    ? `R$ ${Number(truck.preco).toLocaleString("pt-BR")}`
    : "nao informado";
  const km = truck.quilometragem
    ? `${Number(truck.quilometragem).toLocaleString("pt-BR")} km`
    : "nao informado";

  const temVeiculo = Boolean(truck?.marca);

  const contextoVeiculo = temVeiculo
    ? `Veiculo: ${truck.marca} ${truck.modelo} ${truck.ano_modelo ?? truck.ano_fabricacao ?? ""}
Preco: ${preco}
Quilometragem: ${km}
Motor: ${truck.motor ?? "nao informado"}
Cambio: ${truck.cambio ?? "nao informado"}
Combustivel: ${truck.combustivel ?? "nao informado"}
Carroceria: ${truck.carroceria ?? "nao informado"}
Tracao: ${truck.tracao ?? "nao informado"}
Cor: ${truck.cor ?? "nao informada"}
Localizacao: ${truck.cidade ?? ""} / ${truck.estado ?? ""}
Descricao: ${truck.descricao ?? "nenhuma"}`
    : "Nao ha veiculo especifico nesta conversa.";

  return `Voce e o assistente do site Caminhoes a Venda (caminhoesavenda.com).

${contextoVeiculo}

AJUDE QUALQUER PESSOA:
- Comprador com duvida sobre o veiculo: responda com base nos dados acima
- Comprador quer contato com vendedor: oriente a usar o botao WhatsApp no anuncio
- Vendedor quer editar anuncio: oriente a acessar /painel
- Vendedor quer anunciar: explique que e gratis em /cadastro
- Duvidas gerais: responda sobre a plataforma
- Se nao souber algo do veiculo: oriente a perguntar pelo WhatsApp

REGRAS: Nunca invente dados. Seja direto, amigavel e use linguagem simples. Sem markdown ou asteriscos.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      mensagem: string;
      historico: { role: "user" | "assistant"; content: string }[];
      truck: TruckContext;
    };

    const { mensagem, historico = [], truck } = body;

    if (!mensagem?.trim()) {
      return NextResponse.json({ erro: "Mensagem vazia" }, { status: 400 });
    }

    // Converte historico do front (role/content) para formato Gemini (role/parts)
    const historicoFiltrado = historico
      .filter(msg => msg.content && msg.content.trim() !== "")
      .map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    // Gemini nao aceita historico comecando com mensagem do modelo
    if (historicoFiltrado.length > 0 && historicoFiltrado[0].role === "model") {
      historicoFiltrado.shift();
    }

    const conteudosDoChat = [
      ...historicoFiltrado,
      { role: "user", parts: [{ text: mensagem }] },
    ];

    const resposta = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: conteudosDoChat,
      config: {
        systemInstruction: buildSystemPrompt(truck ?? {}),
        temperature: 0.2,
        maxOutputTokens: 400,
      },
    });

    const texto = resposta.text ?? "Nao consegui processar sua pergunta.";

    return NextResponse.json({ resposta: texto });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[chat-anuncio]", msg);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
