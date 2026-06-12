import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { gerarSlugComId } from "@/lib/slug";

const siteUrl = "https://caminhoesavenda.com";

const staticPages: MetadataRoute.Sitemap = [
  { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
  { url: `${siteUrl}/anuncios`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
  { url: `${siteUrl}/implementos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
  { url: `${siteUrl}/parceiros`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${siteUrl}/planos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${siteUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${siteUrl}/anunciar`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
  { url: `${siteUrl}/politica-de-privacidade`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: trucks, error } = await supabase
    .from("trucks")
    .select("id,marca,modelo,ano_modelo,ano_fabricacao,cidade,estado,updated_at,created_at")
    .eq("status", "aprovado")
    .eq("vendido", false)
    .limit(5000);

  if (error || !trucks) return staticPages;

  const approvedTruckPages: MetadataRoute.Sitemap = trucks.map((truck) => ({
    url: `${siteUrl}/anuncios/${gerarSlugComId(truck)}`,
    lastModified: truck.updated_at || truck.created_at
      ? new Date(truck.updated_at || truck.created_at)
      : new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticPages, ...approvedTruckPages];
}
