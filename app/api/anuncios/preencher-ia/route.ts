import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── Caminhão ───────────────────────────────────────────────────────────────
const MARCAS_CAMINHAO = ["Mercedes-Benz", "Scania", "Volvo", "Volkswagen", "Ford", "Iveco", "DAF"];
const CARROCERIAS_CAMINHAO = [
  "Caçamba basculante", "Caçamba meia-cana", "Graneleira", "Chassis", "Tanque",
  "Prancha", "Plataforma", "Baú seco", "Baú frigorífico", "Cavalo mecânico", "Munck", "Outra",
];
const TRACOES = ["4x2", "6x2", "6x4", "8x2", "8x4", "Truck", "Bitruck", "Traçado"];

// ─── Carreta ────────────────────────────────────────────────────────────────
const MARCAS_CARRETA = [
  "Randon", "Guerra", "Noma", "Librelato", "Facchini",
  "Krone", "Triel", "Rodovale", "São Paulo Implementos", "Brascontainer", "Outra",
];
const TIPOS_CARRETA = [
  "Graneleira", "Porta-contêiner", "Prancha", "Frigorífica",
  "Tanque", "Sider", "Baú", "Caçamba", "Dolly",
  "Plataforma", "Cegonheiro", "Florestal", "Outra",
];
const EIXOS_CARRETA = ["1 eixo", "2 eixos", "3 eixos", "4 eixos", "Outra"];

// ─── Máquina ────────────────────────────────────────────────────────────────
const MARCAS_MAQUINA = [
  "Caterpillar", "Komatsu", "Volvo", "Liebherr", "Doosan",
  "Hitachi", "John Deere", "Case", "New Holland", "Hyundai",
  "Kubota", "JCB", "Manitou", "Atlas Copco", "Terex", "Outra",
];
const TIPOS_MAQUINA = [
  "Escavadeira hidráulica", "Motoniveladora", "Pá carregadeira",
  "Retroescavadeira", "Trator agrícola", "Trator de esteira",
  "Compactador", "Miniescavadeira", "Minicarregadeira (skid steer)",
  "Guindaste", "Plataforma elevatória", "Rolo compactador",
  "Perfuratriz", "Outro",
];

// ─── Implemento ──────────────────────────────────────────────────────────────
const MARCAS_IMPLEMENTO = [
  "Randon", "Guerra", "Noma", "Librelato", "Facchini",
  "Krone", "Triel", "Rodovale", "Outra",
];
const TIPOS_IMPLEMENTO = [
  "Graneleira", "Basculante", "Baú seco", "Baú frigorífico",
  "Tanque", "Prancha", "Porta-contêiner", "Sider",
  "Cegonheiro", "Florestal", "Outro",
];

// ─── Compartilhado ───────────────────────────────────────────────────────────
const CONSERVACOES = ["Novo", "Semi-novo", "Bom", "Regular", "Para reparo"];
const ESTADOS = ["SC", "PR", "RS", "SP", "MG", "MS", "MT", "GO", "BA", "RJ", "ES", "Outro"];

type TipoAnuncio = "Caminhão" | "Carretas" | "Máquinas" | "Implemento";

type SugestaoAnuncio = {
  marca?: string;
  modelo?: string;
  ano?: string;
  preco?: string;
  cidade?: string;
  estado?: string;
  carroceria?: string;   // tipo do veículo/implemento (nome do campo unificado para o prompt)
  tracao?: string;       // apenas caminhão
  whatsapp?: string;
  descricao?: string;
  observacoes?: string[];
};

function onlyDigits(value: string) { return value.replace(/\D/g, ""); }

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function pickFromList(textoNormalizado: string, lista: string[]) {
  return lista.find((item) => textoNormalizado.includes(normalizeText(item)));
}

// ─── Extratores locais ───────────────────────────────────────────────────────

function extrairMarcaCaminhao(t: string) {
  if (/\bmb\b|mercedes|benz|\batego\b|\baxor\b|\baccelo\b|\b1113\b|\b1513\b|\b1618\b|\b2428\b|\b2544\b/.test(t)) return "Mercedes-Benz";
  if (/volks|vw|constellation|worker/.test(t)) return "Volkswagen";
  if (/scania|\br440\b|\br420\b|\br450\b|\br500\b|\bp310\b|\bp340\b|\bp360\b|\bp420\b/.test(t)) return "Scania";
  if (/volvo|\bfh\b|\bfm\b|\bvm\b/.test(t)) return "Volvo";
  if (/iveco|stralis|tector|daily/.test(t)) return "Iveco";
  if (/\bdaf\b|xf105|xf530/.test(t)) return "DAF";
  if (/ford|cargo|\bf4000\b/.test(t)) return "Ford";
  return "";
}

function extrairMarcaCarreta(t: string) {
  if (/randon/.test(t)) return "Randon";
  if (/guerra/.test(t)) return "Guerra";
  if (/\bnoma\b/.test(t)) return "Noma";
  if (/librelato/.test(t)) return "Librelato";
  if (/facchini/.test(t)) return "Facchini";
  if (/krone/.test(t)) return "Krone";
  if (/triel/.test(t)) return "Triel";
  if (/rodovale/.test(t)) return "Rodovale";
  return "";
}

function extrairMarcaMaquina(t: string) {
  if (/caterpillar|\bcat\b/.test(t)) return "Caterpillar";
  if (/komatsu/.test(t)) return "Komatsu";
  if (/volvo/.test(t)) return "Volvo";
  if (/liebherr/.test(t)) return "Liebherr";
  if (/doosan|daewoo/.test(t)) return "Doosan";
  if (/hitachi/.test(t)) return "Hitachi";
  if (/john deere/.test(t)) return "John Deere";
  if (/\bcase\b/.test(t)) return "Case";
  if (/new holland/.test(t)) return "New Holland";
  if (/hyundai/.test(t)) return "Hyundai";
  if (/kubota/.test(t)) return "Kubota";
  if (/\bjcb\b/.test(t)) return "JCB";
  if (/manitou/.test(t)) return "Manitou";
  if (/terex/.test(t)) return "Terex";
  return "";
}

function extrairTipoCarreta(t: string) {
  if (/porta.?conteiner|conteiner/.test(t)) return "Porta-contêiner";
  if (/frigorifico|frigorifica/.test(t)) return "Frigorífica";
  if (/graneleir/.test(t)) return "Graneleira";
  if (/prancha/.test(t)) return "Prancha";
  if (/tanque/.test(t)) return "Tanque";
  if (/sider/.test(t)) return "Sider";
  if (/cacamba/.test(t)) return "Caçamba";
  if (/dolly/.test(t)) return "Dolly";
  if (/plataforma/.test(t)) return "Plataforma";
  if (/cegonheiro/.test(t)) return "Cegonheiro";
  if (/florestal/.test(t)) return "Florestal";
  if (/bau/.test(t)) return "Baú";
  return "Outra";
}

function extrairTipoMaquina(t: string) {
  if (/escavadeira/.test(t)) return "Escavadeira hidráulica";
  if (/motoniveladora/.test(t)) return "Motoniveladora";
  if (/pa carregadeira|pa.carregadeira/.test(t)) return "Pá carregadeira";
  if (/retroescavadeira/.test(t)) return "Retroescavadeira";
  if (/trator agricola|trator agr/.test(t)) return "Trator agrícola";
  if (/trator de esteira|esteira/.test(t)) return "Trator de esteira";
  if (/compactador/.test(t)) return "Compactador";
  if (/miniescavadeira|mini escavadeira/.test(t)) return "Miniescavadeira";
  if (/minicarregadeira|skid steer/.test(t)) return "Minicarregadeira (skid steer)";
  if (/guindaste/.test(t)) return "Guindaste";
  if (/plataforma elevatoria/.test(t)) return "Plataforma elevatória";
  if (/rolo compactador/.test(t)) return "Rolo compactador";
  return "Outro";
}

function extrairModelo(texto: string) {
  const padroes = [
    /\b(r\s?\d{3})\b/i, /\b(p\s?\d{3})\b/i,
    /\b(fh\s?\d{3})\b/i, /\b(fm\s?\d{3})\b/i,
    /\b(constellation\s?\d{2}[\s.-]?\d{3})\b/i,
    /\b(\d{2}[\s.-]?\d{3})\b/i,
    /\b(axor\s?\d{4})\b/i, /\b(atego\s?\d{4})\b/i,
    /\b(cargo\s?\d{4})\b/i, /\b(xf\s?\d{3})\b/i,
    /\b(stralis\s?\d{3})\b/i,
    /\b(\d{3}[A-Z])\b/i,
  ];
  for (const re of padroes) {
    const m = texto.match(re);
    if (m?.[1]) return m[1].replace(/\s+/g, " ").toUpperCase();
  }
  return "";
}

function extrairAno(texto: string) {
  return texto.match(/\b(19[8-9]\d|20[0-3]\d)\b/g)?.[0] || "";
}

function extrairPreco(texto: string) {
  const norm = normalizeText(texto);
  const mil = norm.match(/(?:r\$\s*)?(\d{2,3})(?:[\.,]\d{3})?\s*(?:mil|k)\b/);
  if (mil?.[1]) return String(Number(mil[1]) * 1000);
  const completo = texto.match(/(?:R\$\s*)?(\d{2,3}(?:\.\d{3})+|\d{5,7})/i);
  if (completo?.[1]) return onlyDigits(completo[1]);
  return "";
}

function extrairTracao(t: string) {
  const m = t.match(/\b(4x2|6x2|6x4|8x2|8x4)\b/);
  if (m?.[1]) return m[1];
  if (/bitruck|bi truck/.test(t)) return "Bitruck";
  if (/truck/.test(t)) return "Truck";
  if (/tracado|tracada/.test(t)) return "Traçado";
  return "";
}

function extrairEixos(t: string) {
  const m = t.match(/\b([1-4])\s*eixos?\b/);
  if (m?.[1]) return `${m[1]} eixo${Number(m[1]) > 1 ? "s" : ""}`;
  return "";
}

function extrairEstado(t: string) {
  return t.match(/\b(sc|pr|rs|sp|mg|ms|mt|go|ba|rj|es)\b/i)?.[1]?.toUpperCase() || "SC";
}

function extrairCidade(texto: string) {
  return texto.match(/(?:cidade|local|em|de)\s*[:\-]?\s*([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+){0,3})/)?.[1]?.trim() || "";
}

// ─── Preenchimento local por tipo ────────────────────────────────────────────

function preenchimentoLocal(texto: string, tipo: TipoAnuncio): SugestaoAnuncio {
  const t = normalizeText(texto);

  let marca = "";
  let carroceria = "";

  if (tipo === "Carretas") {
    marca = extrairMarcaCarreta(t) || pickFromList(t, MARCAS_CARRETA) || "";
    carroceria = extrairTipoCarreta(t);
  } else if (tipo === "Máquinas") {
    marca = extrairMarcaMaquina(t) || pickFromList(t, MARCAS_MAQUINA) || "";
    carroceria = extrairTipoMaquina(t);
  } else if (tipo === "Implemento") {
    marca = extrairMarcaCarreta(t) || pickFromList(t, MARCAS_IMPLEMENTO) || "";
    carroceria = extrairTipoCarreta(t); // listas similares
  } else {
    marca = extrairMarcaCaminhao(t) || pickFromList(t, MARCAS_CAMINHAO) || "";
    carroceria = ""; // extrairCarroceria abaixo
    if (!carroceria) {
      if (/cavalo|quinta roda/.test(t)) carroceria = "Cavalo mecânico";
      else if (/tanque/.test(t)) carroceria = "Tanque";
      else if (/bau frigorifico|frigorifico/.test(t)) carroceria = "Baú frigorífico";
      else if (/bau/.test(t)) carroceria = "Baú seco";
      else if (/cacamba meia/.test(t)) carroceria = "Caçamba meia-cana";
      else if (/cacamba|basculante/.test(t)) carroceria = "Caçamba basculante";
      else if (/graneleir/.test(t)) carroceria = "Graneleira";
      else if (/prancha/.test(t)) carroceria = "Prancha";
      else if (/plataforma/.test(t)) carroceria = "Plataforma";
      else if (/munck|guindauto/.test(t)) carroceria = "Munck";
      else if (/chassi/.test(t)) carroceria = "Chassis";
      else carroceria = "Outra";
    }
  }

  const sugestao: SugestaoAnuncio = {
    marca,
    modelo: extrairModelo(texto),
    ano: extrairAno(texto),
    preco: extrairPreco(texto),
    cidade: extrairCidade(texto),
    estado: extrairEstado(t),
    carroceria,
    tracao: tipo === "Caminhão" ? extrairTracao(t) : extrairEixos(t),
    whatsapp: "",
    observacoes: [],
  };

  if (!sugestao.modelo) sugestao.observacoes?.push("Modelo não identificado.");
  if (!sugestao.ano) sugestao.observacoes?.push("Ano não identificado.");
  if (!sugestao.preco) sugestao.observacoes?.push("Valor não identificado.");
  if (!sugestao.cidade) sugestao.observacoes?.push("Cidade não identificada.");

  const partes = [sugestao.marca, sugestao.modelo, sugestao.ano ? `ano ${sugestao.ano}` : ""].filter(Boolean);
  sugestao.descricao = `${partes.join(" ")} à venda.\n\n${texto.trim()}`.trim();

  return sugestao;
}

// ─── Validação de saída ───────────────────────────────────────────────────────

function limparSugestao(data: SugestaoAnuncio, tipo: TipoAnuncio): SugestaoAnuncio {
  let marcasValidas: string[];
  let carroceriasValidas: string[];

  if (tipo === "Carretas") {
    marcasValidas = MARCAS_CARRETA;
    carroceriasValidas = TIPOS_CARRETA;
  } else if (tipo === "Máquinas") {
    marcasValidas = MARCAS_MAQUINA;
    carroceriasValidas = TIPOS_MAQUINA;
  } else if (tipo === "Implemento") {
    marcasValidas = MARCAS_IMPLEMENTO;
    carroceriasValidas = TIPOS_IMPLEMENTO;
  } else {
    marcasValidas = MARCAS_CAMINHAO;
    carroceriasValidas = CARROCERIAS_CAMINHAO;
  }

  return {
    marca: marcasValidas.includes(data.marca || "") ? data.marca : "",
    modelo: String(data.modelo || "").trim().slice(0, 60),
    ano: onlyDigits(String(data.ano || "")).slice(0, 4),
    preco: onlyDigits(String(data.preco || "")).slice(0, 9),
    cidade: String(data.cidade || "").trim().slice(0, 80),
    estado: ESTADOS.includes(String(data.estado || "").toUpperCase()) ? String(data.estado || "").toUpperCase() : "SC",
    carroceria: carroceriasValidas.includes(data.carroceria || "") ? data.carroceria : "",
    tracao: TRACOES.includes(data.tracao || "") ? data.tracao : "",
    whatsapp: onlyDigits(String(data.whatsapp || "")).slice(0, 15),
    descricao: String(data.descricao || "").trim().slice(0, 1500),
    conservacao: CONSERVACOES.includes(data.conservacao || "") ? data.conservacao : "",
    observacoes: Array.isArray(data.observacoes) ? data.observacoes.slice(0, 6).map(String) : [],
  } as SugestaoAnuncio;
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────

async function preencherComOpenAI(texto: string, tipo: TipoAnuncio): Promise<SugestaoAnuncio | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  let marcas: string[];
  let tiposOuCarrocerias: string;
  let tracaoOuEixos: string;
  let extras = "";

  if (tipo === "Carretas") {
    marcas = MARCAS_CARRETA;
    tiposOuCarrocerias = `Tipos de carreta (campo carroceria): ${TIPOS_CARRETA.join(", ")}`;
    tracaoOuEixos = `Eixos (campo tracao): ${EIXOS_CARRETA.join(", ")}`;
  } else if (tipo === "Máquinas") {
    marcas = MARCAS_MAQUINA;
    tiposOuCarrocerias = `Tipos de máquina (campo carroceria): ${TIPOS_MAQUINA.join(", ")}`;
    tracaoOuEixos = "Não há campo de tração para máquinas. Deixe tracao vazio.";
    extras = "Se houver horímetro (horas trabalhadas), inclua como campo quilometragem (somente números).";
  } else if (tipo === "Implemento") {
    marcas = MARCAS_IMPLEMENTO;
    tiposOuCarrocerias = `Tipos de implemento (campo carroceria): ${TIPOS_IMPLEMENTO.join(", ")}`;
    tracaoOuEixos = `Eixos (campo tracao): ${EIXOS_CARRETA.join(", ")}`;
  } else {
    marcas = MARCAS_CAMINHAO;
    tiposOuCarrocerias = `Carrocerias (campo carroceria): ${CARROCERIAS_CAMINHAO.join(", ")}`;
    tracaoOuEixos = `Trações (campo tracao): ${TRACOES.join(", ")}`;
  }

  const prompt = `Você é um classificador de anúncios de veículos e equipamentos usados no Brasil. Extraia dados do texto e retorne SOMENTE JSON válido, sem markdown.

Tipo de anúncio: ${tipo}

Listas permitidas:
Marcas: ${marcas.join(", ")}
${tiposOuCarrocerias}
${tracaoOuEixos}
Estados: ${ESTADOS.join(", ")}
Conservação (campo conservacao): ${CONSERVACOES.join(", ")}

Campos esperados: marca, modelo, ano, preco, cidade, estado, carroceria, tracao, whatsapp, descricao, observacoes, conservacao.
Regras:
- preco: somente números em reais (sem R$, pontos ou vírgulas)
- ano: 4 dígitos
- se não souber, use string vazia
- não invente cidade, valor ou telefone
- descricao: profissional, direta, em português do Brasil
- observacoes: array de strings com o que não foi possível identificar
${extras}

Texto do anúncio:
${texto}`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
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

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erro: "Faça login para usar o preenchimento automático." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const texto = String(body?.texto || "").trim();
  const tipo: TipoAnuncio = ["Carretas", "Máquinas", "Implemento"].includes(body?.tipo_anuncio)
    ? body.tipo_anuncio
    : "Caminhão";

  if (texto.length < 10) {
    return NextResponse.json({ erro: "Cole uma descrição maior para a IA analisar." }, { status: 400 });
  }

  const sugestaoExterna = await preencherComOpenAI(texto, tipo);
  const sugestao = limparSugestao(sugestaoExterna || preenchimentoLocal(texto, tipo), tipo);

  return NextResponse.json({ sugestao });
}
