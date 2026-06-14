import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { gerarSlugComId } from "@/lib/slug";

const BASE = "https://www.caminhoesavenda.com";

const MARCAS = [
  "mercedes-benz", "scania", "volvo", "volkswagen",
  "ford", "iveco", "daf", "man", "randon",
  "agrale", "liebherr", "paqueta", "guerra",
];

const ESTADOS = [
  "ac", "al", "am", "ap", "ba", "ce", "df",
  "es", "go", "ma", "mg", "ms", "mt", "pa",
  "pb", "pe", "pi", "pr", "rj", "rn", "ro",
  "rr", "rs", "sc", "se", "sp", "to",
];

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

async function getAllTrucks(): Promise<TruckRow[]> {
  const supabase = await createClient();
  const PAGE = 1000;
  const all: TruckRow[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("trucks")
      .select("id, marca, modelo, ano_modelo, ano_fabricacao, cidade, estado, updated_at")
      .eq("status", "aprovado")
      .eq("vendido", false)
      .order("updated_at", { ascending: false })
      .range(from, from + PAGE - 1);

    if (error || !data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const trucks = await getAllTrucks();

  const anuncioUrls: MetadataRoute.Sitemap = trucks.map((t: TruckRow) => ({
    url: `${BASE}/anuncios/${gerarSlugComId(t)}`,
    lastModified: t.updated_at ?? undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: BASE,                              changeFrequency: "daily",   priority: 1.0  },
    { url: `${BASE}/anuncios`,                changeFrequency: "daily",   priority: 0.95 },
    { url: `${BASE}/implementos`,             changeFrequency: "daily",   priority: 0.90 },
    { url: `${BASE}/anunciar`,                changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE}/planos`,                  changeFrequency: "weekly",  priority: 0.80 },
    { url: `${BASE}/parceiros`,               changeFrequency: "weekly",  priority: 0.70 },
    { url: `${BASE}/revendas`,                changeFrequency: "weekly",  priority: 0.70 },
    { url: `${BASE}/como-funciona`,           changeFrequency: "monthly", priority: 0.65 },
    { url: `${BASE}/sobre`,                   changeFrequency: "monthly", priority: 0.60 },
    { url: `${BASE}/contato`,                 changeFrequency: "monthly", priority: 0.60 },
    { url: `${BASE}/politica-de-privacidade`, changeFrequency: "yearly",  priority: 0.30 },
    ...MARCAS.map((m) => ({
      url: `${BASE}/caminhoes/marca/${m}`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...ESTADOS.map((uf) => ({
      url: `${BASE}/caminhoes/estado/${uf}`,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
    ...anuncioUrls,
  ];
}
