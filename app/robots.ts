import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/painel", "/conta", "/logout"],
      },
    ],
    sitemap: "https://www.caminhoesavenda.com/sitemap.xml",
    host: "https://www.caminhoesavenda.com",
  };
}
