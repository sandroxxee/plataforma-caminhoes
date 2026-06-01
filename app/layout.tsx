import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Manrope, Oswald } from "next/font/google";
import "./globals.css";
import "./typography.css";

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

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const siteUrl = "https://www.caminhoesavenda.com.br";
const ogImage = "/og-caminhoesavenda.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Caminhões à Venda | Compra, venda e anúncios de caminhões",
    template: "%s | Caminhões à Venda",
  },
  description:
    "Compra, venda e anúncios de caminhões usados e seminovos. Veja ofertas reais, confira preço e fale direto com o anunciante pelo WhatsApp.",
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
    "classificados de caminhões",
  ],
  authors: [{ name: "Caminhões à Venda" }],
  creator: "Caminhões à Venda",
  publisher: "Caminhões à Venda",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Caminhões à Venda",
    title: "Caminhões à Venda | Compra, venda e anúncios de caminhões",
    description: "Anuncie seu caminhão, acompanhe ofertas e encontre compradores do ramo em um só lugar.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Caminhões à Venda - compra, venda e anúncios de caminhões",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caminhões à Venda | Compra, venda e anúncios de caminhões",
    description: "Anuncie seu caminhão, acompanhe ofertas e encontre compradores do ramo em um só lugar.",
    images: [ogImage],
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
  themeColor: "#f0f2f5",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${manrope.variable} ${oswald.variable}`}>
      <body>{children}</body>
    </html>
  );
}
