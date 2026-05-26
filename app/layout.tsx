import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = "https://www.caminhoesavenda.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Caminhões à Venda | Compra, venda e troca de caminhões",
    template: "%s | Caminhões à Venda",
  },
  description:
    "Encontre caminhões usados e seminovos à venda. Veja fotos, preço, cidade e fale direto com o anunciante pelo WhatsApp.",
  keywords: [
    "caminhões à venda",
    "caminhões a venda",
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
  authors: [{ name: "Caminhões à Venda" }],
  creator: "Caminhões à Venda",
  publisher: "Caminhões à Venda",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Caminhões à Venda",
    title: "Caminhões à Venda | Compra, venda e troca de caminhões",
    description:
      "Encontre caminhões usados e seminovos à venda. Veja fotos, preço, cidade e fale direto com o anunciante pelo WhatsApp.",
    images: [
      {
        url: "/logo-horizontal.png",
        width: 900,
        height: 260,
        alt: "Caminhões à Venda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caminhões à Venda | Compra, venda e troca de caminhões",
    description:
      "Encontre caminhões usados e seminovos à venda com contato direto pelo WhatsApp.",
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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
