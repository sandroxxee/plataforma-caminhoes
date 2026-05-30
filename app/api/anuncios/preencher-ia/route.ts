import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MARCAS = ["Mercedes-Benz", "Scania", "Volvo", "Volkswagen", "Ford", "Iveco", "DAF"];
const CARROCERIAS = [
  "Caçamba basculante",
  "Caçamba meia-cana",
  "Graneleira",
  "Chassis",
  "Tanque",
  "Prancha",
  "Plataforma",
  "Baú seco",
  "Baú frigorífico",
  "Cavalo mecânico",
  "Munck",
  "Outra",
];
const TRACOES = ["4x2", "6x2", "6x4", "8x2", "8x4", "Truck", "Bitruck", "Traçado"];
const ESTADOS = ["SC", "PR", "RS", "SP", "MG", "MS", "MT", "GO", "BA", "RJ", "ES", "Outro"];

type SugestaoAnuncio = {
  marca?: string;
  modelo?: string;
  ano?: string;
  preco?: string;
  cidade?: string;
  estado?: string;
  carroceria?: string;
  tracao?: string;
  whatsapp?: string;
  descricao?: string;
  observacoes?: string[];
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function pickFromList(textoNormalizado: string, lista: string[]) {
  return lista.find((item) => textoNormalizado.includes(normalizeText(item)));
}

function extrairMarca(textoNormalizado: string) {
  if (/\bmb\b|mercedes|benz|\batego\b|\baxor\b|\baccelo\b|\b1113\b|\b1513\b|\b1618\b|\b2428\b|\b2544\b/.test(textoNormalizado)) return "Mercedes-Benz";
  if (/volks|vw|constellation|worker|\b24[\s.-]?280\b|\b24[\s.-]?260\b|\b23[\s.-]?220\b/.test(textoNormalizado)) return "Volkswagen";
  if (/scania|\br440\b|\br420\b|\br450\b|\br500\b|\bp310\b|\bp340\b|\bp360\b|\bp420\b/.test(textoNormalizado)) return "Scania";
  if (/volvo|\bfh\b|\bfm\b|\bvm\b|\bnh\b/.test(textoNormalizado)) return "Volvo";
  if (/iveco|stralis|tector|daily/.test(textoNormalizado)) return "Iveco";
  if (/\bdaf\b|xf105|xf 105|xf530|xf 530/.test(textoNormalizado)) return "DAF";
  if (/ford|cargo|\bf4000\b|\bf-4000\b/.test(textoNormalizado)) return "Ford";
  return "";
}

function extrairModelo(texto: string, marca: string) {
  const exemplos = [
    /\b(r\s?\d{3})\b/i,
    /\b(p\s?\d{3})\b/i,
    /\b(fh\s?\d{3})\b/i,
    /\b(fm\s?\d{3})\b/i,
    /\b(vm\s?\d{3})\b/i,
    /\b(constellation\s?\d{2}[\s.-]?\d{3})\b/i,
    /\b(\d{2}[\s.-]?\d{3})\b/i,
    /\b(\d{4})\b/i,
    /\b(axor\s?\d{4})\b/i,
    /\b(atego\s?\d{4})\b/i,
    /\b(cargo\s?\d{4})\b/i,
    /\b(xf\s?\d{3})\b/i,
    /\b(stralis\s?\d{3})\b/i,
  ];

  for (const regex of exemplos) {
    const match = texto.match(regex);
    if (match?.[1]) return match[1].replace(/\s+/g, " ").replace(/[.-]/g, ".").toUpperCase();
  }

  return marca ? "" : "";
}

function extrairAno(texto: string) {
  const anos = texto.match(/\b(19[8-9]\d|20[0-3]\d)\b/g);
  return anos?.[0] || "";
}

function extrairPreco(texto: string) {
  const normalizado = normalizeText(texto);

  const valorComMil = normalizado.match(/(?:r\$\s*)?(\d{2,3})(?:[\.,]\d{3})?\s*(?:mil|k)\b/);
  if (valorComMil?.[1]) return String(Number(valorComMil[1]) * 1000);

  const valorCompleto = texto.match(/(?:R\$\s*)?(\d{2,3}(?:\.\d{3})+|\d{5,7})/i);
  if (valorCompleto?.[1]) return onlyDigits(valorCompleto[1]);

  return "";
}

function extrairTracao(textoNormalizado: string) {
  const match = textoNormalizado.match(/\b(4x2|6x2|6x4|8x2|8x4)\b/);
  if (match?.[1]) return match[1];
  if (/bitruck|bi truck/.test(textoNormalizado)) return "Bitruck";
  if (/truck/.test(textoNormalizado)) return "Truck";
  if (/tracado|tracada/.test(textoNormalizado)) return "Traçado";
  return "";
}

function extrairCarroceria(textoNormalizado: string) {
  if (/cavalo|carreta|quinta roda/.test(textoNormalizado)) return "Cavalo mecânico";
  if (/tanque/.test(textoNormalizado)) return "Tanque";
  if (/bau frigorifico|frigorifico/.test(textoNormalizado)) return "Baú frigorífico";
  if (/bau/.test(textoNormalizado)) return "Baú seco";
  if (/cacamba meia/.test(textoNormalizado)) return "Caçamba meia-cana";
  if (/cacamba|basculante/.test(textoNormalizado)) return "Caçamba basculante";
  if (/graneleir/.test(textoNormalizado)) return "Graneleira";
  if (/prancha/.test(textoNormalizado)) return "Prancha";
  if (/plataforma/.test(textoNormalizado)) return "Plataforma";
  if (/munck|guindauto/.test(textoNormalizado)) return "Munck";
  if (/chassi|chassis/.test(textoNormalizado)) return "Chassis";
  return "Outra";
}

function extrairEstado(textoNormalizado: string) {
  const match = textoNormalizado.match(/\b(sc|pr|rs|sp|mg|ms|mt|go|ba|rj|es)\b/i);
  return match?.[1]?.toUpperCase() || "SC";
}

function extrairCidade(texto: string) {
  const match = texto.match(/(?:cidade|local|em|de)\s*[:\-]?\s*([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+){0,3})/);
  return match?.[1]?.trim() || "";
}

function montarDescricao(texto: string, sugestao: SugestaoAnuncio) {
  const partes = [
    sugestao.marca || "Caminhão",
    sugestao.modelo,
    sugestao.tracao,
    sugestao.ano ? `ano ${sugestao.ano}` : "",
  ].filter(Boolean);

  const intro = `${partes.join(" ")} à venda.`.replace(/\s+/g, " ").trim();
  const complemento = texto.length > 20 ? texto.trim() : "Caminhão com boa configuração, pronto para análise e negociação.";
  return `${intro}\n\n${complemento}`.trim();
}

function preenchimentoLocal(texto: string): SugestaoAnuncio {
  const textoNormalizado = normalizeText(texto);
  const marca = extrairMarca(textoNormalizado) || pickFromList(textoNormalizado, MARCAS) || "";
  const sugestao: SugestaoAnuncio = {
    marca,
    modelo: extrairModelo(texto, marca),
    ano: extrairAno(texto),
    preco: extrairPreco(texto),
    cidade: extrairCidade(texto),
    estado: extrairEstado(textoNormalizado),
    carroceria: extrairCarroceria(textoNormalizado),
    tracao: extrairTracao(textoNormalizado),
    whatsapp: "",
    observacoes: [],
  };

  sugestao.descricao = montarDescricao(texto, sugestao);

  if (!sugestao.modelo) sugestao.observacoes?.push("Modelo não identificado com segurança.");
  if (!sugestao.ano) sugestao.observacoes?.push("Ano não identificado.");
  if (!sugestao.preco) sugestao.observacoes?.push("Valor não identificado.");
  if (!sugestao.cidade) sugestao.observacoes?.push("Cidade não identificada.");
  if (!sugestao.tracao) sugestao.observacoes?.push("Tração não identificada.");

  return sugestao;
}

function limparSugestao(data: SugestaoAnuncio): SugestaoAnuncio {
  return {
    marca: MARCAS.includes(data.marca || "") ? data.marca : "",
    modelo: String(data.modelo || "").trim().slice(0, 60),
    ano: onlyDigits(String(data.ano || "")).slice(0, 4),
    preco: onlyDigits(String(data.preco || "")).slice(0, 9),
    cidade: String(data.cidade || "").trim().slice(0, 80),
    estado: ESTADOS.includes(String(data.estado || "").toUpperCase()) ? String(data.estado || "").toUpperCase() : "SC",
    carroceria: CARROCERIAS.includes(data.carroceria || "") ? data.carroceria : "Outra",
    tracao: TRACOES.includes(data.tracao || "") ? data.tracao : "",
    whatsapp: onlyDigits(String(data.whatsapp || "")).slice(0, 15),
    descricao: String(data.descricao || "").trim().slice(0, 1500),
    observacoes: Array.isArray(data.observacoes) ? data.observacoes.slice(0, 6).map(String) : [],
  };
}

async function preencherComOpenAI(texto: string): Promise<SugestaoAnuncio | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const prompt = `Você é um classificador de anúncios de caminhões usados no Brasil. Extraia dados do texto e retorne somente JSON válido.\n\nListas permitidas:\nMarcas: ${MARCAS.join(", ")}\nCarrocerias: ${CARROCERIAS.join(", ")}\nTrações: ${TRACOES.join(", ")}\nEstados: ${ESTADOS.join(", ")}\n\nCampos esperados: marca, modelo, ano, preco, cidade, estado, carroceria, tracao, whatsapp, descricao, observacoes.\nRegras: preco deve ser apenas números em reais, sem R$ e sem pontos. ano deve ter 4 dígitos. Se não souber, use string vazia. Não invente cidade, km, valor ou telefone. A descrição deve ser profissional, direta, em português do Brasil, sem prometer o que não está no texto.\n\nTexto do anúncio:\n${texto}`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: prompt,
        temperature: 0.1,
      }),
    });

    if (!response.ok) return null;

    const result = await response.json();
    const output = String(result.output_text || "").trim();
    const jsonText = output.replace(/^```json/i, "").replace(/^```/i, "").replace(/```$/i, "").trim();
    return JSON.parse(jsonText) as SugestaoAnuncio;
  } catch (error) {
    console.error("Erro ao preencher com IA externa:", error);
    return null;
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erro: "Faça login para usar o preenchimento automático." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const texto = String(body?.texto || "").trim();

  if (texto.length < 10) {
    return NextResponse.json({ erro: "Cole uma descrição maior do caminhão para a IA analisar." }, { status: 400 });
  }

  const sugestaoExterna = await preencherComOpenAI(texto);
  const sugestao = limparSugestao(sugestaoExterna || preenchimentoLocal(texto));

  return NextResponse.json({ sugestao });
}
