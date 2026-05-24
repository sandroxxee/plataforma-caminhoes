import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://plataforma-caminhoes.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/anuncios", "/cadastro", "/login"],
        disallow: ["/admin", "/painel", "/logout"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
