import type { MetadataRoute } from "next";

const siteUrl = "https://caminhaoavenda.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/anuncios", "/anunciar", "/sobre"],
        disallow: ["/admin", "/painel", "/logout", "/api", "/teste-supabase"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
