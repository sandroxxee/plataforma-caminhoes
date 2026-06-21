import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "img.logo.dev",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
    formats: ["image/webp"],
    deviceSizes: [400, 800, 1200],
    imageSizes: [200, 400],
  },

  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
    ];
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },

  async redirects() {
    return [
      { source: "/anuncios", destination: "/comprar/caminhoes", permanent: true },
      { source: "/anuncios/:path*", destination: "/comprar/caminhoes/:path*", permanent: true },

      { source: "/carretas", destination: "/comprar/carretas", permanent: true },
      { source: "/carretas/:path*", destination: "/comprar/carretas/:path*", permanent: true },

      { source: "/implementos", destination: "/comprar/implementos", permanent: true },
      { source: "/implementos/:path*", destination: "/comprar/implementos/:path*", permanent: true },

      { source: "/maquinas", destination: "/comprar/maquinas", permanent: true },
      { source: "/maquinas/:path*", destination: "/comprar/maquinas/:path*", permanent: true },

      { source: "/pecas", destination: "/comprar/pecas", permanent: true },
      { source: "/pecas/:path*", destination: "/comprar/pecas/:path*", permanent: true },

      { source: "/revendas", destination: "/parcerias/revendas", permanent: true },
      { source: "/revendas/:path*", destination: "/parcerias/revendas/:path*", permanent: true },

      { source: "/parceiros", destination: "/parcerias/parceiros", permanent: true },
      { source: "/parceiros/:path*", destination: "/parcerias/parceiros/:path*", permanent: true },

      { source: "/sobre", destination: "/institucional/sobre", permanent: true },
      { source: "/contato", destination: "/institucional/contato", permanent: true },
      { source: "/como-funciona", destination: "/institucional/ajuda", permanent: true },
      { source: "/politica-de-privacidade", destination: "/institucional/privacidade", permanent: true },
    ];
  },
};

export default nextConfig;
