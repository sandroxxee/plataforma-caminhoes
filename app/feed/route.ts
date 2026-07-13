import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gerarSlugComId } from "@/lib/slug";
import { formatImageUrl } from "@/lib/truck-utils";

const BASE = "https://www.caminhoesavenda.com";
const DEFAULT_IMAGE = `${BASE}/og-caminhoes-a-venda.jpg`;

function esc(s?: string | null) {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatPrice(v?: number | null): string {
  if (!v || v <= 0) return "";
  return v.toFixed(2);
}

export const revalidate = 3600; // regenera a cada 1 hora

export async function GET() {
  const supabase = await createClient();
  const PAGE = 500;
  const all: Record<string, unknown>[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("trucks")
      .select(
        "id,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,combustivel,cor,descricao,updated_at,truck_images(image_url,principal,ordem)"
      )
      .eq("status", "aprovado")
      .eq("vendido", false)
      .order("updated_at", { ascending: false })
      .range(from, from + PAGE - 1);

    if (error || !data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  const items = all
    .map((t) => {
      const slug = gerarSlugComId({
        id: t.id as string,
        marca: t.marca as string,
        modelo: t.modelo as string,
        ano_modelo: t.ano_modelo as number,
        ano_fabricacao: t.ano_fabricacao as number,
        cidade: t.cidade as string,
        estado: t.estado as string,
      });
      const url = `${BASE}/anuncios/${slug}`;
      const price = formatPrice(t.preco as number);
      if (!price) return null; // Google Shopping exige preço

      const images = (t.truck_images as { image_url: string; principal: boolean; ordem: number }[]) || [];
      const mainImg = formatImageUrl(images.find((i) => i.principal)?.image_url || images[0]?.image_url) || DEFAULT_IMAGE;

      const title = [
        t.marca, t.modelo,
        t.ano_modelo || t.ano_fabricacao,
        t.carroceria,
      ].filter(Boolean).join(" ");

      const desc = esc(
        (t.descricao as string)?.trim() ||
        `${title}${t.cidade ? ` em ${t.cidade}/${t.estado}` : ""}. Entre em contato para mais informações.`
      );

      return `
    <item>
      <g:id>${esc(t.id as string)}</g:id>
      <g:title>${esc(title)}</g:title>
      <g:description>${desc.slice(0, 5000)}</g:description>
      <g:link>${esc(url)}</g:link>
      <g:image_link>${esc(mainImg)}</g:image_link>
      <g:price>${price} BRL</g:price>
      <g:availability>in_stock</g:availability>
      <g:condition>used</g:condition>
      <g:brand>${esc(t.marca as string)}</g:brand>
      <g:product_type>Veículos &gt; Caminhões${t.carroceria ? ` &gt; ${esc(t.carroceria as string)}` : ""}</g:product_type>
      <g:google_product_category>918</g:google_product_category>
      ${t.cor ? `<g:color>${esc(t.cor as string)}</g:color>` : ""}
      ${t.combustivel ? `<g:fuel_type>${esc(t.combustivel as string)}</g:fuel_type>` : ""}
      <g:model>${esc(t.modelo as string)}</g:model>
      ${t.ano_modelo || t.ano_fabricacao ? `<g:year>${t.ano_modelo || t.ano_fabricacao}</g:year>` : ""}
      ${t.estado ? `<g:shipping_label>${esc(t.estado as string)}</g:shipping_label>` : ""}
    </item>`;
    })
    .filter(Boolean)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Caminhões à Venda — Feed Google Shopping</title>
    <link>${BASE}</link>
    <description>Caminhões, Carretas, Máquinas e Implementos à venda no Brasil</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
