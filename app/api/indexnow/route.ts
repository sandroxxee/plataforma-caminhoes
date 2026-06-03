import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const siteUrl = "https://caminhoesavenda.com";
const indexNowKey = "9f6c2a4e7b8d41c2a0f5e6b3c9d8a1f4";
const indexNowEndpoint = "https://api.indexnow.org/indexnow";

function isAuthorized(request: Request) {
  const secret = process.env.INDEXNOW_SECRET;
  const requestSecret = request.headers.get("x-indexnow-secret");

  return Boolean(secret && requestSecret && secret === requestSecret);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Acesso negado." },
      { status: 401 }
    );
  }

  const supabase = await createClient();

  const { data: trucks, error } = await supabase
    .from("trucks")
    .select("id")
    .eq("status", "aprovado")
    .limit(5000);

  if (error) {
    return NextResponse.json(
      { ok: false, error: "Não foi possível buscar anúncios aprovados." },
      { status: 500 }
    );
  }

  const urlList = [
    siteUrl,
    `${siteUrl}/anuncios`,
    ...(trucks || []).map((truck) => `${siteUrl}/anuncios/${truck.id}`),
  ];

  const response = await fetch(indexNowEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      host: "caminhoesavenda.com",
      key: indexNowKey,
      keyLocation: `${siteUrl}/${indexNowKey}.txt`,
      urlList,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");

    return NextResponse.json(
      {
        ok: false,
        error: "IndexNow recusou o envio.",
        status: response.status,
        details: body,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    sent: urlList.length,
    urls: urlList,
  });
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      route: "IndexNow ativo. Use POST com x-indexnow-secret para enviar URLs aprovadas.",
    },
    { status: 200 }
  );
}
