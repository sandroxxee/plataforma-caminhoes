import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

const PwaRegister = dynamic(() => import("@/components/PwaRegister"), {
  ssr: false,
  loading: () => null,
});

const WhatsappClickTracker = dynamic(() => import("@/components/WhatsappClickTracker"), {
  ssr: false,
  loading: () => null,
});

const CopyProtection = dynamic(() => import("@/components/CopyProtection"), {
  ssr: false,
  loading: () => null,
});

const MobileBottomNav = dynamic(() => import("@/components/MobileBottomNav"), {
  ssr: false,
  loading: () => null,
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = "https://caminhoesavenda.com";
const ogImage = "/og-caminhoes-a-venda.jpg";

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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Caminhões à Venda",
    title: "Caminhões à Venda | Anúncios de caminhões e implementos",
    description: "Anuncie caminhões e implementos, veja ofertas aprovadas e fale direto pelo WhatsApp com segurança e organização.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Caminhões à Venda - anúncios de caminhões e implementos",
      },
    ],
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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body>
        <PwaRegister />
        <WhatsappClickTracker />
        <CopyProtection />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
