import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://plataforma-caminhoes.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Caminhões em Oferta | Compra, venda e troca de caminhões",
    template: "%s | Caminhões em Oferta",
  },
  description:
    "Plataforma de anúncios de caminhões usados e seminovos. Veja ofertas reais, confira preço e fale direto com o anunciante pelo WhatsApp.",
  keywords: [
    "caminhões em oferta",
    "comprar caminhão",
    "vender caminhão",
    "caminhões usados",
    "caminhões seminovos",
    "anúncios de caminhões",
    "caminhão traçado",
    "caminhão 6x4",
    "caminhão 8x4",
    "plataforma de caminhões",
  ],
  authors: [{ name: "Caminhões em Oferta" }],
  creator: "Caminhões em Oferta",
  publisher: "Caminhões em Oferta",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Caminhões em Oferta",
    title: "Caminhões em Oferta | Compra, venda e troca de caminhões",
    description:
      "Veja caminhões reais, confira preço e fale direto com o anunciante pelo WhatsApp.",
    images: [
      {
        url: "/logo-horizontal.png",
        width: 900,
        height: 260,
        alt: "Caminhões em Oferta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caminhões em Oferta | Compra, venda e troca de caminhões",
    description:
      "Plataforma de anúncios de caminhões usados e seminovos com contato direto pelo WhatsApp.",
    images: ["/logo-horizontal.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
