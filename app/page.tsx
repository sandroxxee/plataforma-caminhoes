import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { FeaturedAds } from "@/components/theme/FeaturedAds";
import { HeroMarketplace } from "@/components/theme/HeroMarketplace";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { BrandsSection } from "@/components/theme/BrandsSection";
import type { TruckCardData } from "@/components/theme/TruckCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Caminh\u00f5es \u00e0 Venda | An\u00fancios de caminh\u00f5es e implementos",
  description:
    "Veja caminh\u00f5es usados, seminovos e implementos anunciados no Caminh\u00f5es \u00e0 Venda. Plataforma para comprar, vender e anunciar com contato direto pelo WhatsApp.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("trucks")
    .select(`
      id,
      titulo,
      marca,
      modelo,
      ano_modelo,
      ano_fabricacao,
      preco,
      cidade,
      estado,
      carroceria,
      tracao,
      whatsapp,
      destaque,
      created_at,
      truck_images (
        image_url,
        principal,
        ordem
      )
    `)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .order("created_at", { ascending: false })
    .limit(12);

  const trucks = (data || []) as TruckCardData[];

  return (
    <main className="market-page">
      <PublicHeader />

      <div className="market-main">
        <HeroMarketplace />

        {/* Marcas */}
        <BrandsSection />

        {/* Grid de an\u00fancios recentes */}
        <FeaturedAds trucks={trucks} />

        {/* Como funciona */}
        <div className="market-container">
          <HowItWorksSection />
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
