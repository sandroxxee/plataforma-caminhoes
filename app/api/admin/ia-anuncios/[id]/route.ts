import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ZipEntry = {
  name: string;
  data: Uint8Array;
};

const encoder = new TextEncoder();
let crcTable: number[] | null = null;

function safeFilePart(value: string | null | undefined) {
  return String(value || "anuncio")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80) || "anuncio";
}

function getCrcTable() {
  if (crcTable) return crcTable;

  crcTable = Array.from({ length: 256 }, (_, index) => {
    let crc = index;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    return crc >>> 0;
  });

  return crcTable;
}

function crc32(data: Uint8Array) {
  const table = getCrcTable();
  let crc = 0xffffffff;

  for (const byte of data) {
    crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function uint16(value: number) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value, 0);
  return buffer;
}

function uint32(value: number) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value >>> 0, 0);
  return buffer;
}

function makeZip(entries: ZipEntry[]) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const data = Buffer.from(entry.data);
    const crc = crc32(data);

    const localHeader = Buffer.concat([
      uint32(0x04034b50),
      uint16(20),
      uint16(0x0800),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(crc),
      uint32(data.length),
      uint32(data.length),
      uint16(name.length),
      uint16(0),
      name,
    ]);

    localParts.push(localHeader, data);

    const centralHeader = Buffer.concat([
      uint32(0x02014b50),
      uint16(20),
      uint16(20),
      uint16(0x0800),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(crc),
      uint32(data.length),
      uint32(data.length),
      uint16(name.length),
      uint16(0),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(0),
      uint32(offset),
      name,
    ]);

    centralParts.push(centralHeader);
    offset += localHeader.length + data.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const localFiles = Buffer.concat(localParts);
  const end = Buffer.concat([
    uint32(0x06054b50),
    uint16(0),
    uint16(0),
    uint16(entries.length),
    uint16(entries.length),
    uint32(centralDirectory.length),
    uint32(localFiles.length),
    uint16(0),
  ]);

  return Buffer.concat([localFiles, centralDirectory, end]);
}

function textEntry(name: string, content: string): ZipEntry {
  return { name, data: encoder.encode(content) };
}

function buildTrainingText(truck: any) {
  const fotos = (truck.truck_images || [])
    .sort((a: any, b: any) => (a.ordem || 0) - (b.ordem || 0))
    .map((img: any, index: number) => `${index + 1}. ${img.image_url}`)
    .join("\n");

  return [
    "BASE PARA IA RESPONDER SOBRE ESTE ANUNCIO",
    "",
    `Titulo: ${truck.titulo || "Nao informado"}`,
    `Marca: ${truck.marca || "Nao informado"}`,
    `Modelo: ${truck.modelo || "Nao informado"}`,
    `Ano fabricacao: ${truck.ano_fabricacao || "Nao informado"}`,
    `Ano modelo: ${truck.ano_modelo || "Nao informado"}`,
    `Preco: ${truck.preco ? Number(truck.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "Sob consulta"}`,
    `Cidade/UF: ${[truck.cidade, truck.estado].filter(Boolean).join("/") || "Nao informado"}`,
    `Carroceria: ${truck.carroceria || "Nao informado"}`,
    `Tracao: ${truck.tracao || "Nao informado"}`,
    `WhatsApp: ${truck.whatsapp || "Nao informado"}`,
    "",
    "Descricao original:",
    truck.descricao || "Nao informado",
    "",
    "Fotos do anuncio:",
    fotos || "Sem fotos cadastradas",
    "",
    "Orientacao para resposta:",
    "Responder com linguagem comercial simples, objetiva e brasileira. Destacar ano, modelo, estado geral, valor, localizacao e chamar para contato no WhatsApp. Nao inventar informacoes que nao estejam nesta base.",
  ].join("\n");
}

function getImageExtension(url: string, contentType: string | null) {
  const pathname = new URL(url).pathname.toLowerCase();
  const fromPath = pathname.match(/\.(jpg|jpeg|png|webp|gif)$/)?.[1];
  if (fromPath) return fromPath === "jpeg" ? "jpg" : fromPath;
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("gif")) return "gif";
  return "jpg";
}

async function fetchImageEntry(url: string, index: number): Promise<ZipEntry | null> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type");
    const extension = getImageExtension(url, contentType);
    const arrayBuffer = await response.arrayBuffer();

    return {
      name: `fotos/foto-${String(index + 1).padStart(2, "0")}.${extension}`,
      data: new Uint8Array(arrayBuffer),
    };
  } catch {
    return null;
  }
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Login obrigatorio." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  const { data: truck, error } = await supabase
    .from("trucks")
    .select(`
      id,
      titulo,
      marca,
      modelo,
      ano_fabricacao,
      ano_modelo,
      preco,
      cidade,
      estado,
      carroceria,
      tracao,
      descricao,
      whatsapp,
      status,
      truck_images (
        image_url,
        principal,
        ordem
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error || !truck) {
    return NextResponse.json({ error: "Anuncio nao encontrado." }, { status: 404 });
  }

  const sortedImages = [...(truck.truck_images || [])]
    .filter((image: any) => image.image_url)
    .sort((a: any, b: any) => {
      if (a.principal && !b.principal) return -1;
      if (!a.principal && b.principal) return 1;
      return (a.ordem || 0) - (b.ordem || 0);
    });

  const imageEntries = (await Promise.all(
    sortedImages.map((image: any, index: number) => fetchImageEntry(image.image_url, index))
  )).filter(Boolean) as ZipEntry[];

  const payload = {
    tipo: "pacote_ia_anuncio_caminhoes_a_venda",
    gerado_em: new Date().toISOString(),
    anuncio: truck,
    fotos_baixadas: imageEntries.length,
    fotos_cadastradas: sortedImages.length,
    texto_para_ia: buildTrainingText(truck),
  };

  const entries: ZipEntry[] = [
    textEntry("anuncio.txt", buildTrainingText(truck)),
    textEntry("dados-do-anuncio.json", JSON.stringify(payload, null, 2)),
    textEntry("links-das-fotos.txt", sortedImages.map((image: any, index: number) => `${index + 1}. ${image.image_url}`).join("\n") || "Sem fotos cadastradas"),
    ...imageEntries,
  ];

  const zip = makeZip(entries);
  const fileName = `pacote-ia-${safeFilePart(truck.titulo)}-${String(truck.id).slice(0, 8)}.zip`;

  return new NextResponse(zip, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
