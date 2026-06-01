import type { MetadataRoute } from "next";

const siteUrl = "https://www.caminhoesavenda.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/anuncios", "/anunciar", "/sobre", "/contato"],
        disallow: ["/admin", "/painel", "/logout", "/api", "/teste-supabase"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
