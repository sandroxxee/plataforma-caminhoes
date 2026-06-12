import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE = "https://www.caminhoesvenda.com.br";
const MARCAS = ["mercedes-benz","scania","volvo","volkswagen","ford","iveco","daf"];
const ESTADOS = ["sc","pr","rs","sp","rj","mg","es","ba","go","ms","mt","df","pe","ce","pa"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: trucks } = await supabase
    .from("trucks")
    .select("id, updated_at")
    .eq("status", "aprovado")
    .eq("vendido", false)
    .order("updated_at", { ascending: false })
    .limit(1000);

  const anuncioUrls: MetadataRoute.Sitemap = (trucks || []).map((t) => ({
    url: `${BASE}/anuncios/${t.id}`,
    lastModified: t.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: BASE, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/anuncios`, changeFrequency: "daily", priority: 0.95 },
    ...MARCAS.map((m) => ({ url: `${BASE}/anuncios/${m}`, changeFrequency: "daily" as const, priority: 0.9 })),
    ...ESTADOS.map((uf) => ({ url: `${BASE}/anuncios/estado/${uf}`, changeFrequency: "daily" as const, priority: 0.85 })),
    ...anuncioUrls,
  ];
}
