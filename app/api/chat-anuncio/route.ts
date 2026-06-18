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

type HistoricoMsg = {
  role: string;
  parts: { text: string }[];
};

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
Voce esta na pagina do seguinte veiculo:
Veiculo: ${truck.marca} ${truck.modelo} ${truck.ano_modelo ?? truck.ano_fabricacao ?? ""}
Preco: ${preco}
Quilometragem: ${km}
Motor: ${truck.motor ?? "nao informado"}
Cambio: ${truck.cambio ?? "nao informado"}
Combustivel: ${truck.combustivel ?? "nao informado"}
Carroceria: ${truck.carroceria ?? "nao informado"}
Tracao: ${truck.tracao ?? "nao informado"}
Cor: ${truck.cor ?? "nao informada"}
Localizacao: ${truck.cidade ?? ""} / ${truck.estado ?? ""}
Descricao do vendedor: ${truck.descricao ?? "nenhuma"}
`
    : "\nVoce esta no site Caminhoes a Venda, mas nao ha um veiculo especifico nesta conversa.\n";

  return `Voce e o assistente inteligente do site Caminhoes a Venda (caminhoesavenda.com), um marketplace de caminhoes, carretas, implementos e maquinas.
${contextoVeiculo}
VOCE AJUDA QUALQUER PESSOA:
- Comprador perguntando sobre o veiculo: responda com base nos dados acima
- Comprador querendo contato com o vendedor: oriente a usar o botao de WhatsApp no anuncio
- Vendedor querendo editar, atualizar preco ou melhorar o anuncio: oriente a acessar o painel em /painel
- Vendedor com duvida sobre como anunciar: explique que e gratis, basta criar uma conta em /cadastro
- Duvidas gerais sobre o site: responda com base no que sabe da plataforma
- Se nao souber algo especifico do veiculo que nao esteja nos dados acima, seja honesto e oriente a perguntar pelo WhatsApp do vendedor

REGRAS:
- Nunca invente dados tecnicos ou informacoes que nao estejam nos dados do veiculo acima
- Seja objetivo, amigavel e use linguagem simples e direta
- Nao faca comparacoes com outros veiculos ou mencione precos de mercado
- Respostas curtas e uteis, sem enrolacao
- Nunca use markdown, asteriscos ou formatacao especial`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      mensagem: string;
      historico: HistoricoMsg[];
      truck: TruckContext;
    };

    const { mensagem, historico = [], truck } = body;

    if (!mensagem?.trim()) {
      return NextResponse.json({ erro: "Mensagem vazia" }, { status: 400 });
    }

    const chat = ai.chats.create({
      model: "gemini-1.5-flash",
      config: {
        systemInstruction: buildSystemPrompt(truck ?? {}),
        temperature: 0.5,
      },
      history: historico.slice(-6),
    });

    const response = await chat.sendMessage({ message: mensagem });

    return NextResponse.json({ resposta: response.text ?? "Nao consegui processar sua pergunta." });
  } catch (err) {
    console.error("[chat-anuncio]", err);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}
