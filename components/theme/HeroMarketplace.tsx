import "./HeroMarketplace.css";
import Link from "next/link";
import { getHomeContent } from "@/lib/site-content";
import { createClient } from "@/lib/supabase/server";

export async function HeroMarketplace() {
  const supabase = await createClient();
  const content  = await getHomeContent(supabase);
  const imgSrc   = content.heroBannerUrl || "/hero-home.jpg";

  return (
    <div className="market-container">
      <div className="hero-wrap">
        <img
          src={imgSrc}
          alt="Caminhões à Venda"
          className="hero-img"
          fetchPriority="high"
          loading="eager"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-sub">
            Anúncios revisados, contato direto pelo WhatsApp,<br className="hero-br" />
            sem intermediários.
          </p>
          <div className="hero-actions">
            <Link href="/anuncios" className="hero-btn-primary">Ver caminhões</Link>
            <Link href="/anunciar" className="hero-btn-secondary">Anunciar grátis</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
