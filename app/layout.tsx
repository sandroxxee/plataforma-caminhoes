import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Inter, Montserrat, Outfit, Roboto } from "next/font/google";
import { ClientShell } from "@/components/ClientShell";
import { CookieBanner } from "@/components/CookieBanner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// import ChatGuard from "@/components/ChatGuard";
import { createClient } from "@/lib/supabase/server";
import { getHomeContent } from "@/lib/site-content";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const siteUrl = "https://www.caminhoesavenda.com";
const ogImage = "/og-caminhoes-a-venda.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Caminhões à Venda | Anúncios de caminhões e implementos",
    template: "%s | Caminhões à Venda",
  },
  description:
    "Plataforma brasileira para anunciar, comprar e vender caminhões usados, seminovos e implementos. Veja anúncios aprovados e fale direto pelo WhatsApp.",
  keywords: [
    "caminhões à venda",
    "caminhões a venda",
    "comprar caminhão",
    "vender caminhão",
    "caminhões usados",
    "caminhões seminovos",
    "anúncios de caminhões",
    "implementos rodoviários",
    "caminhão traçado",
    "caminhão 6x4",
    "caminhão 8x4",
    "classificados de caminhões",
  ],
  authors: [{ name: "Caminhões à Venda" }],
  creator: "Caminhões à Venda",
  publisher: "Caminhões à Venda",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Caminhões à Venda",
    title: "Caminhões à Venda | Anúncios de caminhões e implementos",
    description: "Anuncie caminhões e implementos, veja ofertas aprovadas e fale direto pelo WhatsApp com segurança e organização.",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Caminhões à Venda - anúncios de caminhões e implementos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caminhões à Venda | Anúncios de caminhões e implementos",
    description: "Anuncie caminhões e implementos, veja ofertas aprovadas e fale direto pelo WhatsApp.",
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
  themeColor: "#1877f2",
};

const searchActionSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Caminhões à Venda",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/anuncios?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const supabase = await createClient();
  const content = await getHomeContent(supabase);
  
  const corPrimaria = content.corPrimaria || "#1877f2";
  const fonte = content.fontePrincipal || "manrope";
  const radius = content.arredondamento || "16px";
  const radiusSm = radius === "0px" ? "0px" : radius === "8px" ? "6px" : radius === "24px" ? "14px" : "10px";
  
  const bgClaro = content.bgClaro || "#eef0f4";
  const surfaceClaro = content.surfaceClaro || "#ffffff";
  const bgEscuro = content.bgEscuro || "#080d18";
  const surfaceEscuro = content.surfaceEscuro || "#111827";

  let fontVariable = "var(--font-manrope)";
  if (fonte === "inter") fontVariable = "var(--font-inter)";
  else if (fonte === "montserrat") fontVariable = "var(--font-montserrat)";
  else if (fonte === "outfit") fontVariable = "var(--font-outfit)";
  else if (fonte === "roboto") fontVariable = "var(--font-roboto)";

  // Gerar cor primária hover e soft
  const hexToRgba = (hex: string, alpha: number) => {
    try {
      const cleanHex = hex.replace("#", "");
      const r = parseInt(cleanHex.slice(0, 2), 16);
      const g = parseInt(cleanHex.slice(2, 4), 16);
      const b = parseInt(cleanHex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch {
      return "rgba(24, 119, 242, 0.12)";
    }
  };

  const escurecerCor = (hex: string, amt: number) => {
    try {
      let usePound = false;
      if (hex[0] === "#") {
        hex = hex.slice(1);
        usePound = true;
      }
      let num = parseInt(hex, 16);
      let r = (num >> 16) + amt;
      r = Math.max(0, Math.min(255, r));
      let b = ((num >> 8) & 0x00ff) + amt;
      b = Math.max(0, Math.min(255, b));
      let g = (num & 0x0000ff) + amt;
      g = Math.max(0, Math.min(255, g));
      return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0");
    } catch {
      return "#0f5fc8";
    }
  };

  const corPrimariaHover = escurecerCor(corPrimaria, -24);
  const corPrimariaSoft = hexToRgba(corPrimaria, 0.12);
  const efeitoHover = content.efeitoHover || "flutuar";

  return (
    <html lang="pt-BR" className={`${manrope.variable} ${inter.variable} ${montserrat.variable} ${outfit.variable} ${roboto.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --blue: ${corPrimaria} !important;
            --blue2: ${corPrimariaHover} !important;
            --blueSoft: ${corPrimariaSoft} !important;
            --radius: ${radius} !important;
            --radius-sm: ${radiusSm} !important;
            --font-display: ${fontVariable}, Arial, sans-serif !important;
            --font-title: ${fontVariable}, Arial, sans-serif !important;
            --font-body: ${fontVariable}, Arial, sans-serif !important;
            --bg: ${bgClaro} !important;
            --surface: ${surfaceClaro} !important;
            --soft: ${hexToRgba(bgClaro, 0.5)} !important;
          }
          body.public-theme-dark {
            --bg: ${bgEscuro} !important;
            --surface: ${surfaceEscuro} !important;
            --soft: ${hexToRgba(bgEscuro, 0.4)} !important;
            --blue: ${corPrimaria} !important;
            --blue2: ${corPrimariaHover} !important;
            --blueSoft: ${corPrimariaSoft} !important;
          }
          
          /* Efeitos de Hover Dinâmicos */
          ${efeitoHover === "estatico" ? `
            .tc:hover {
              transform: none !important;
              box-shadow: var(--shadow) !important;
              border-color: var(--line) !important;
            }
            .tc:hover .tc-photo img {
              transform: none !important;
            }
          ` : ""}
          ${efeitoHover === "zoom" ? `
            .tc:hover {
              transform: none !important;
              box-shadow: var(--shadow) !important;
            }
          ` : ""}
          ${efeitoHover === "flutuar" ? `
            .tc:hover .tc-photo img {
              transform: none !important;
            }
          ` : ""}
        `}} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionSchema) }}
        />
        {children}
        <ClientShell />
        <CookieBanner />
        <Analytics />
        <SpeedInsights />
        {/* <ChatGuard /> */}
      </body>
    </html>
  );
}
