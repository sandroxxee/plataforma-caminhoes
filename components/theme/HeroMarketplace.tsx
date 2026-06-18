import "./HeroMarketplace.css";
import Link from "next/link";
import { getHomeContent } from "@/lib/site-content";
import { createClient } from "@/lib/supabase/server";
import { Search } from "lucide-react";

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
            Anúncios aprovados, contato direto pelo WhatsApp com vendedores verificados. Sem intermediários.
          </p>
        </div>
      </div>

      {/* Barra de Busca estilo Marketplace (fora da imagem) */}
      <div className="hero-search-bar">
        <div className="search-input-wrap">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="O que você está procurando? (Ex: Scania R450, Volvo FH...)" 
            className="search-input"
          />
        </div>
        <Link href="/anuncios" className="search-btn">
          Ver Ofertas
        </Link>
        <Link href="/anunciar" className="anunciar-btn">
          Anunciar Grátis
        </Link>
      </div>
    </div>
  );
}
