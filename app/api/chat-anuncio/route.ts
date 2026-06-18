import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

type Mensagem = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(truck: TruckContext): string {
  const preco = truck.preco
    ? `R$ ${Number(truck.preco).toLocaleString("pt-BR")}`
    : "não informado";
  const km = truck.quilometragem
    ? `${Number(truck.quilometragem).toLocaleString("pt-BR")} km`
    : "não informado";

  return `Você é um assistente especializado no seguinte anúncio de veículo:

**Veículo:** ${truck.marca} ${truck.modelo} ${truck.ano_modelo ?? truck.ano_fabricacao ?? ""}
**Preço:** ${preco}
**Quilometragem:** ${km}
**Motor:** ${truck.motor ?? "não informado"}
**Câmbio:** ${truck.cambio ?? "não informado"}
**Combustível:** ${truck.combustivel ?? "não informado"}
**Carroceria:** ${truck.carroceria ?? "não informado"}
**Tração:** ${truck.tracao ?? "não informado"}
**Cor:** ${truck.cor ?? "não informada"}
**Localização:** ${truck.cidade ?? ""} / ${truck.estado ?? ""}
**Descrição do vendedor:** ${truck.descricao ?? "nenhuma"}

REGRAS:
- Responda apenas dúvidas relacionadas a este veículo.
- Se a informação não constar acima, diga que não tem essa informação e oriente o comprador a perguntar diretamente pelo WhatsApp.
- Nunca invente dados técnicos, histórico de manutenção ou informações que não estejam acima.
- Seja objetivo, amigável e use linguagem simples.
- Não mencione preços de outros veículos ou faça comparações de mercado.
- Se perguntarem o WhatsApp do vendedor, informe que ele pode ser acessado clicando no botão de contato no anúncio.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      mensagem: string;
      historico: Mensagem[];
      truck: TruckContext;
    };

    const { mensagem, historico = [], truck } = body;

    if (!mensagem?.trim()) {
      return NextResponse.json({ erro: "Mensagem vazia" }, { status: 400 });
    }

    if (!truck?.marca) {
      return NextResponse.json({ erro: "Contexto do anúncio ausente" }, { status: 400 });
    }

    const resposta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 400,
      messages: [
        { role: "system", content: buildSystemPrompt(truck) },
        ...historico.slice(-6), // mantém últimas 6 mensagens para contexto
        { role: "user", content: mensagem },
      ],
    });

    const texto = resposta.choices[0]?.message?.content ?? "Não consegui processar sua pergunta.";

    return NextResponse.json({ resposta: texto });
  } catch (err) {
    console.error("[chat-anuncio]", err);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}
