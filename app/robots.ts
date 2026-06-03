import type { MetadataRoute } from "next";

const siteUrl = "https://caminhoesavenda.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/anuncios", "/anunciar", "/sobre", "/como-funciona"],
        disallow: [
          "/admin",
          "/painel",
          "/login",
          "/cadastro",
          "/conta",
          "/logout",
          "/api",
          "/teste-supabase",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
