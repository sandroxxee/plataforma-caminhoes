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
          <h1 className="hero-title">
            Compre e venda <span className="hero-title-accent">caminhões com confiança</span>
          </h1>
          <p className="hero-sub">
            Anúncios aprovados, contato direto pelo WhatsApp<br className="hero-br" />
            com vendedores verificados. Sem intermediários.
          </p>
          <div className="hero-actions">
            <Link href="/anuncios" className="hero-btn-primary">
              <span>🔍 Ver caminhões disponíveis</span>
            </Link>
            <Link href="/anunciar" className="hero-btn-secondary">
              <span>➕ Anunciar grátis</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
