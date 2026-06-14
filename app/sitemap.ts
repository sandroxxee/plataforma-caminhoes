import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { gerarSlugComId } from "@/lib/slug";

const BASE = "https://www.caminhoesavenda.com";

const MARCAS = ["mercedes-benz","scania","volvo","volkswagen","ford","iveco","daf"];
const ESTADOS = ["sc","pr","rs","sp","rj","mg","es","ba","go","ms","mt","df","pe","ce","pa"];

type TruckRow = {
  id: string;
  marca?: string | null;
  modelo?: string | null;
  ano_modelo?: number | null;
  ano_fabricacao?: number | null;
  cidade?: string | null;
  estado?: string | null;
  updated_at?: string | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: trucks } = await supabase
    .from("trucks")
    .select("id, marca, modelo, ano_modelo, ano_fabricacao, cidade, estado, updated_at")
    .eq("status", "aprovado")
    .eq("vendido", false)
    .order("updated_at", { ascending: false })
    .limit(1000);

  const anuncioUrls: MetadataRoute.Sitemap = (trucks || []).map((t: TruckRow) => ({
    url: `${BASE}/anuncios/${gerarSlugComId(t)}`,
    lastModified: t.updated_at ?? undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    // home
    { url: BASE,                              changeFrequency: "daily",   priority: 1.0 },
    // listagens principais
    { url: `${BASE}/anuncios`,                changeFrequency: "daily",   priority: 0.95 },
    { url: `${BASE}/implementos`,             changeFrequency: "daily",   priority: 0.90 },
    // conversão
    { url: `${BASE}/anunciar`,                changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE}/planos`,                  changeFrequency: "weekly",  priority: 0.80 },
    // institucional
    { url: `${BASE}/parceiros`,               changeFrequency: "weekly",  priority: 0.70 },
    { url: `${BASE}/revendas`,                changeFrequency: "weekly",  priority: 0.70 },
    { url: `${BASE}/como-funciona`,           changeFrequency: "monthly", priority: 0.65 },
    { url: `${BASE}/sobre`,                   changeFrequency: "monthly", priority: 0.60 },
    { url: `${BASE}/contato`,                 changeFrequency: "monthly", priority: 0.60 },
    { url: `${BASE}/politica-de-privacidade`, changeFrequency: "yearly",  priority: 0.30 },
    // SEO long-tail: marca
    ...MARCAS.map((m) => ({
      url: `${BASE}/caminhoes/marca/${m}`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    // SEO long-tail: estado
    ...ESTADOS.map((uf) => ({
      url: `${BASE}/caminhoes/estado/${uf}`,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
    // anúncios individuais
    ...anuncioUrls,
  ];
}
