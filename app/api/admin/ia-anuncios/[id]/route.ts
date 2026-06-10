import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function safeFilePart(value: string | null | undefined) {
  return String(value || "anuncio")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80) || "anuncio";
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

  const payload = {
    tipo: "base_ia_anuncio_caminhoes_a_venda",
    gerado_em: new Date().toISOString(),
    anuncio: truck,
    texto_para_ia: buildTrainingText(truck),
  };

  const fileName = `base-ia-${safeFilePart(truck.titulo)}-${String(truck.id).slice(0, 8)}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
