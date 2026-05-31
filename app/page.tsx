import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { FeaturedAds } from "@/components/theme/FeaturedAds";
import { HeroMarketplace } from "@/components/theme/HeroMarketplace";
import type { TruckCardData } from "@/components/theme/TruckCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

        <section className="market-container market-categories" aria-label="Categorias rápidas">
          <Link href="/anuncios?perfil=Cavalo%20mec%C3%A2nico">
            <strong>Cavalos mecânicos</strong>
            <span>Opções para estrada</span>
          </Link>
          <Link href="/anuncios?perfil=Truck">
            <strong>Trucks e tocos</strong>
            <span>Serviço urbano e regional</span>
          </Link>
          <Link href="/anuncios?implemento=Ca%C3%A7amba">
            <strong>Caçambas e tanques</strong>
            <span>Obra, agro e transporte</span>
          </Link>
          <Link href="/anuncios?perfil=Implementos">
            <strong>Implementos</strong>
            <span>Carretas e carrocerias</span>
          </Link>
        </section>

        <FeaturedAds trucks={trucks} />
      </div>

      <SiteFooter />
    </main>
  );
}
