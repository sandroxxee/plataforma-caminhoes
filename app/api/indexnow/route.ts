import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gerarSlugComId } from "@/lib/slug";

export const dynamic = "force-dynamic";

const siteUrl = "https://caminhoesavenda.com";
const siteHost = "caminhoesavenda.com";
const indexNowKey = "9f6c2a4e7b8d41c2a0f5e6b3c9d8a1f4";
const indexNowEndpoint = "https://api.indexnow.org/indexnow";

const staticUrls = [
  siteUrl,
  `${siteUrl}/comprar/caminhoes`,
  `${siteUrl}/anunciar`,
  `${siteUrl}/sobre`,
  `${siteUrl}/como-funciona`,
];

function isAuthorized(request: Request) {
  const secret = process.env.INDEXNOW_SECRET;
  const requestSecret = request.headers.get("x-indexnow-secret");
  return Boolean(secret && requestSecret && secret === requestSecret);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, version: "1.0+", error: "Acesso negado." },
      { status: 401 }
    );
  }

  const supabase = await createClient();

  const { data: trucks, error } = await supabase
    .from("trucks")
    .select("id,marca,modelo,ano_modelo,ano_fabricacao,cidade,estado")
    .eq("status", "aprovado")
    .eq("vendido", false)
    .limit(5000);

  if (error) {
    return NextResponse.json(
      { ok: false, version: "1.0+", error: "N\u00e3o foi poss\u00edvel buscar an\u00fancios aprovados." },
      { status: 500 }
    );
  }

  const truckUrls = (trucks || []).map(
    (truck) => `${siteUrl}/comprar/caminhoes/${gerarSlugComId(truck)}`
  );

  const urlList = Array.from(new Set([...staticUrls, ...truckUrls]));

  const response = await fetch(indexNowEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: siteHost,
      key: indexNowKey,
      keyLocation: `${siteUrl}/${indexNowKey}.txt`,
      urlList,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return NextResponse.json(
      { ok: false, version: "1.0+", error: "IndexNow recusou o envio.", status: response.status, details: body },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, version: "1.0+", sent: urlList.length, urls: urlList });
}

export async function GET() {
  return NextResponse.json(
    { ok: true, version: "1.0+", route: "IndexNow ativo. Use POST com x-indexnow-secret para enviar URLs p\u00fablicas e an\u00fancios aprovados." },
    { status: 200 }
  );
}
