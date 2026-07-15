import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { gerarSlugComId } from "@/lib/slug";

const BASE = "https://www.caminhoesavenda.com";

const MARCAS = [
  "Mercedes-Benz", "Scania", "Volvo", "Volkswagen",
  "Ford", "Iveco", "DAF", "MAN", "Agrale",
];

const ESTADOS = [
  "SC", "PR", "RS", "SP", "MG", "MS", "MT",
  "GO", "BA", "RJ", "ES", "PE", "CE", "PA", "AM",
];

const CATEGORIAS: { path: string; param: string }[] = [
  { path: "caminhoes",   param: "estado" },
  { path: "carretas",    param: "estado" },
  { path: "implementos", param: "estado" },
  { path: "maquinas",    param: "estado" },
  { path: "pecas",       param: "estado" },
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
  const lastAnuncio = trucks[0]?.updated_at ?? new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                              lastModified: lastAnuncio, changeFrequency: "daily",   priority: 1.00 },
    { url: `${BASE}/comprar/caminhoes`,        lastModified: lastAnuncio, changeFrequency: "daily",   priority: 0.95 },
    { url: `${BASE}/comprar/carretas`,         lastModified: lastAnuncio, changeFrequency: "daily",   priority: 0.92 },
    { url: `${BASE}/comprar/implementos`,      lastModified: lastAnuncio, changeFrequency: "daily",   priority: 0.92 },
    { url: `${BASE}/comprar/maquinas`,         lastModified: lastAnuncio, changeFrequency: "daily",   priority: 0.90 },
    { url: `${BASE}/comprar/pecas`,            lastModified: lastAnuncio, changeFrequency: "daily",   priority: 0.88 },
    { url: `${BASE}/anunciar`,                 changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE}/planos`,                   changeFrequency: "weekly",  priority: 0.80 },
    { url: `${BASE}/parceiros`,                changeFrequency: "weekly",  priority: 0.72 },
    { url: `${BASE}/revendas`,                 changeFrequency: "weekly",  priority: 0.70 },
    { url: `${BASE}/como-funciona`,            changeFrequency: "monthly", priority: 0.65 },
    { url: `${BASE}/sobre`,                    changeFrequency: "monthly", priority: 0.60 },
    { url: `${BASE}/contato`,                  changeFrequency: "monthly", priority: 0.60 },
    { url: `${BASE}/politica-de-privacidade`,  changeFrequency: "yearly",  priority: 0.30 },
  ];

  const marcaUrls: MetadataRoute.Sitemap = MARCAS.map((m) => ({
    url: `${BASE}/comprar/caminhoes?marca=${encodeURIComponent(m)}`,
    changeFrequency: "daily" as const,
    priority: 0.88,
  }));

  const estadoUrls: MetadataRoute.Sitemap = CATEGORIAS.flatMap(({ path, param }) =>
    ESTADOS.map((uf) => ({
      url: `${BASE}/comprar/${path}?${param}=${uf}`,
      changeFrequency: "daily" as const,
      priority: path === "caminhoes" ? 0.82 : 0.75,
    }))
  );

  const marcaEstadoUrls: MetadataRoute.Sitemap = MARCAS.flatMap((m) =>
    ESTADOS.map((uf) => ({
      url: `${BASE}/comprar/caminhoes?marca=${encodeURIComponent(m)}&estado=${uf}`,
      changeFrequency: "weekly" as const,
      priority: 0.72,
    }))
  );

  const anuncioUrls: MetadataRoute.Sitemap = trucks.map((t) => ({
    url: `${BASE}/comprar/caminhoes/${gerarSlugComId(t)}`,
    lastModified: t.updated_at ?? undefined,
    changeFrequency: "weekly" as const,
    priority: 0.80,
  }));

  return [
    ...staticPages,
    ...marcaUrls,
    ...estadoUrls,
    ...marcaEstadoUrls,
    ...anuncioUrls,
  ];
}
