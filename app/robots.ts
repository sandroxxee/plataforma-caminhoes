import type { MetadataRoute } from "next";

const siteUrl = "https://caminhoesavenda.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/anuncios", "/implementos", "/anunciar", "/politica-de-privacidade"],
        disallow: [
          "/admin",
          "/painel",
          "/login",
          "/cadastro",
          "/conta",
          "/logout",
          "/api",
          "/debug-sessao",
          "/teste-supabase",
          "/planos",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
