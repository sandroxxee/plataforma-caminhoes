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

  const temVeiculo = Boolean(truck?.marca);

  const contextoVeiculo = temVeiculo
    ? `
Você está na página do seguinte veículo:
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
`
    : "\nVocê está no site Caminhões à Venda, mas não há um veículo específico nesta conversa.\n";

  return `Você é o assistente inteligente do site Caminhões à Venda (caminhoesavenda.com), um marketplace de caminhões, carretas, implementos e máquinas.
${contextoVeiculo}
VOCÊ AJUDA QUALQUER PESSOA:
- **Comprador** perguntando sobre o veículo → responda com base nos dados acima
- **Comprador** querendo contato com o vendedor → oriente a usar o botão de WhatsApp no anúncio
- **Vendedor** querendo editar, atualizar preço ou melhorar o anúncio → oriente a acessar o painel em /painel
- **Vendedor** com dúvida sobre como anunciar → explique que é grátis, basta criar uma conta em /cadastro
- **Dúvidas gerais** sobre o site, planos, funcionalidades → responda com base no que sabe da plataforma
- Se não souber algo específico do veículo que não esteja nos dados acima, seja honesto e oriente a perguntar diretamente pelo WhatsApp do vendedor

REGRAS:
- Nunca invente dados técnicos, histórico de manutenção ou informações que não estejam nos dados do veículo
- Seja objetivo, amigável e use linguagem simples e direta
- Não faça comparações com outros veículos ou mencione preços de mercado
- Respostas curtas e úteis — sem enrolação`;
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

    const resposta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 400,
      messages: [
        { role: "system", content: buildSystemPrompt(truck ?? {}) },
        ...historico.slice(-6),
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
