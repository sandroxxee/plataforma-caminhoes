import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

const whatsappHref =
  "https://wa.me/5500000000000?text=Ol%C3%A1,%20quero%20anunciar%20um%20caminh%C3%A3o%20na%20Caminh%C3%B5es%20%C3%A0%20Venda";

export const metadata = {
  title: "Anunciar caminhão | Caminhões à Venda",
  description: "Veja como anunciar seu caminhão no Caminhões à Venda.",
};

export default function AnunciarPage() {
  return (
    <main className="announce-page">
      <PublicHeader />

      <section className="announce-hero-wrap" aria-labelledby="announce-hero-title">
        <div className="announce-hero">
          <div className="announce-hero-content">
            <span className="announce-eyebrow">Anunciar caminhão</span>
            <h1 id="announce-hero-title">CAMINHÕES À VENDA</h1>
            <p className="announce-hero-subtitle">
              Venda seu caminhão com apresentação organizada, fotos reais e
              contato direto pelo WhatsApp.
            </p>
            <p className="announce-hero-support">
              Anúncios claros, compradores mais confiantes e negociação mais
              simples.
            </p>

            <div className="announce-hero-actions" aria-label="Ações para anunciar">
              <Link href="/login" className="announce-btn announce-btn-primary">
                Começar anúncio
              </Link>
              <Link href="/anuncios" className="announce-btn announce-btn-secondary">
                Ver caminhões
              </Link>
              <a
                href={whatsappHref}
                className="announce-btn announce-btn-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="announce-hero-visual" aria-hidden="true">
            <div className="announce-truck-card">
              <div className="announce-truck-skyline" />
              <div className="announce-truck-body">
                <span className="announce-truck-cabin" />
                <span className="announce-truck-cargo" />
                <span className="announce-truck-wheel announce-truck-wheel-front" />
                <span className="announce-truck-wheel announce-truck-wheel-back" />
              </div>
              <div className="announce-truck-caption">
                <strong>Anúncio premium</strong>
                <span>Fotos reais • WhatsApp • Revisão</span>
              </div>
            </div>
            <div className="announce-floating-stat announce-floating-stat-top">
              <strong>Contato direto</strong>
              <span>negocie pelo WhatsApp</span>
            </div>
            <div className="announce-floating-stat announce-floating-stat-bottom">
              <strong>Dados claros</strong>
              <span>mais confiança na compra</span>
            </div>
          </div>
        </div>
      </section>

      <section className="announce-card-grid" aria-label="Como preparar seu anúncio">
        <article className="announce-info-card">
          <span className="announce-card-number">01</span>
          <h2>Dados principais</h2>
          <ul>
            <li>Marca, modelo e ano</li>
            <li>Tração e carroceria</li>
            <li>Cidade, valor e WhatsApp</li>
          </ul>
        </article>

        <article className="announce-info-card">
          <span className="announce-card-number">02</span>
          <h2>Fotos reais</h2>
          <ul>
            <li>Frente, lateral e traseira</li>
            <li>Cabine, pneus e carroceria</li>
            <li>Imagens limpas e atuais</li>
          </ul>
        </article>

        <article className="announce-info-card">
          <span className="announce-card-number">03</span>
          <h2>Publicação</h2>
          <ul>
            <li>Revisão antes de aparecer publicamente</li>
            <li>Plataforma organizada</li>
            <li>Mais confiança para o comprador</li>
          </ul>
        </article>
      </section>

      <section className="announce-next-step" aria-labelledby="announce-next-step-title">
        <div>
          <span className="announce-eyebrow">Próximo passo</span>
          <h2 id="announce-next-step-title">
            Crie sua conta e envie o caminhão para aprovação.
          </h2>
          <p>
            A troca entra como opção dentro do anúncio. O foco é deixar tudo
            simples, claro e direto.
          </p>
        </div>
        <Link href="/login" className="announce-btn announce-btn-primary">
          Criar conta e anunciar
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
