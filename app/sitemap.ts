import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = "https://caminhoesavenda.com";

const staticPages: MetadataRoute.Sitemap = [
  {
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: `${siteUrl}/anuncios`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.95,
  },
  {
    url: `${siteUrl}/anunciar`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${siteUrl}/sobre`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${siteUrl}/como-funciona`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: trucks, error } = await supabase
    .from("trucks")
    .select("id")
    .eq("status", "aprovado")
    .limit(5000);

  if (error || !trucks) {
    return staticPages;
  }

  const approvedTruckPages: MetadataRoute.Sitemap = trucks.map((truck) => ({
    url: `${siteUrl}/anuncios/${truck.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticPages, ...approvedTruckPages];
}
