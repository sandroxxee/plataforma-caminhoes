import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes("olx.com.br")) {
      return NextResponse.json(
        { error: "URL inválida. Cole um link da OLX." },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Não foi possível acessar o anúncio. Tente novamente." },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Extrai dados do JSON embutido na página (OLX usa __NEXT_DATA__)
    // Usa [\s\S]*? no lugar do flag /s para compatibilidade com targets antigos
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);

    let titulo = "";
    let preco = "";
    let descricao = "";
    let cidade = "";
    let estado = "";
    let imagens: string[] = [];

    if (nextDataMatch) {
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        const ad = nextData?.props?.pageProps?.ad;

        if (ad) {
          titulo = ad.subject || "";
          preco = ad.price?.value?.raw?.toString() || "";
          descricao = ad.body || "";
          cidade = ad.location?.municipality || "";
          estado = ad.location?.state || "";
          imagens = (ad.images || []).map(
            (img: { original?: string; large?: string; thumbnail?: string }) =>
              img.original || img.large || img.thumbnail || ""
          ).filter(Boolean).slice(0, 10);
        }
      } catch {
        // JSON inválido — tenta extração manual
      }
    }

    if (!titulo) {
      const tituloMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
      titulo = tituloMatch?.[1]?.trim() || "";
    }

    if (!preco) {
      const precoMatch = html.match(/R\$\s?([\d.,]+)/);
      preco = precoMatch?.[1]?.replace(/\./g, "").replace(",", ".") || "";
    }

    if (!descricao) {
      const descMatch = html.match(/<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      descricao = descMatch?.[1]?.replace(/<[^>]+>/g, "").trim() || "";
    }

    if (imagens.length === 0) {
      const imgMatches = html.matchAll(/"(https:\/\/img\.olx\.com\.br\/images\/[^"]+)"/g);
      for (const match of imgMatches) {
        if (!imagens.includes(match[1])) imagens.push(match[1]);
        if (imagens.length >= 10) break;
      }
    }

    if (!titulo && !preco) {
      return NextResponse.json(
        { error: "Não foi possível extrair dados desse anúncio. Verifique o link." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      titulo,
      preco: preco ? Number(preco.replace(/[^0-9.]/g, "")) : null,
      descricao,
      cidade,
      estado,
      imagens,
      fonte: "olx",
    });
  } catch (error) {
    console.error("Erro ao importar OLX:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar o link." },
      { status: 500 }
    );
  }
}
