import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Content } from "@google/genai";

export const runtime = "nodejs";

// Alterado para ler a chave correta que está configurada no seu .env.local
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

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
    : "não informado";
  const km = truck.quilometragem
    ? `${Number(truck.quilometragem).toLocaleString("pt-BR")} km`
    : "não informado";

  return `Você é um assistente especializado no seguinte anúncio de veículo:

Veículo: ${truck.marca} ${truck.modelo} ${truck.ano_modelo ?? truck.ano_fabricacao ?? ""}
Preço: ${preco}
Quilometragem: ${km}
Motor: ${truck.motor ?? "não informado"}
Câmbio: ${truck.cambio ?? "não informado"}
Combustível: ${truck.combustivel ?? "não informado"}
Carroceria: ${truck.carroceria ?? "não informado"}
Tração: ${truck.tracao ?? "não informado"}
Cor: ${truck.cor ?? "não informada"}
Localização: ${truck.cidade ?? ""} / ${truck.estado ?? ""}
Descrição do vendedor: ${truck.descricao ?? "nenhuma"}

REGRAS ABSOLUTAS:
- Nunca use asteriscos, markdown, negrito ou qualquer tipo de formatação especial nas suas respostas.
- Responda apenas dúvidas relacionadas a este veículo.
- Se a informação não constar acima, diga de forma direta que não tem essa informação e oriente o comprador a perguntar diretamente pelo WhatsApp.
- Nunca invente dados técnicos, histórico de manutenção ou informações que não estejam acima.
- Seja objetivo, amigável e use linguagem simples.
- Não mencione preços de outros veículos ou faça comparações de mercado.
- Se perguntarem o WhatsApp do vendedor, informe que ele pode ser acessado clicando no botão de contato no anúncio.`;
}

export async function POST(req: NextRequest) {
  try {
    // Validação de segurança para garantir que a chave de API existe antes de chamar a IA
    if (!apiKey) {
      console.error("[chat-anuncio] Erro: Chave de API da Google ausente no ambiente.");
      return NextResponse.json({ erro: "Configuração de IA ausente no servidor local." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const body = await req.json() as {
      mensagem: string;
      historico: { role: "user" | "assistant"; content: string }[];
      truck: TruckContext;
    };

    const { mensagem, historico = [], truck } = body;

    if (!mensagem?.trim()) {
      return NextResponse.json({ erro: "Mensagem vazia" }, { status: 400 });
    }

    if (!truck?.marca) {
      return NextResponse.json({ erro: "Contexto do anúncio ausente" }, { status: 400 });
    }

    // Filtra e converte o histórico do frontend para o formato do Gemini
    const historicoFiltrado = historico
      .filter(msg => msg.content && msg.content.trim() !== "")
      .map((msg) => ({
        role: (msg.role === "assistant" ? "model" : "user") as "user" | "model",
        parts: [{ text: msg.content }],
      }));

    // Gemini nao aceita historico comecando com mensagem do modelo
    if (historicoFiltrado.length > 0 && historicoFiltrado[0].role === "model") {
      historicoFiltrado.shift();
    }

    // Corrigido de 'mensaje' para 'mensagem' na linha abaixo
    const conteudosDoChat: Content[] = [
      ...historicoFiltrado,
      { role: "user", parts: [{ text: mensagem }] },
    ];

    const resposta = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: conteudosDoChat,
      config: {
        systemInstruction: buildSystemPrompt(truck),
        temperature: 0.2,
        maxOutputTokens: 400,
      },
    });

    const texto = resposta.text ?? "Não consegui processar sua pergunta.";

    return NextResponse.json({ resposta: texto });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[chat-anuncio] Erro interno:", msg);
    return NextResponse.json({ erro: "Erro ao processar resposta do chat." }, { status: 500 });
  }
}