import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Anunciar caminhão | Caminhões à Venda",
  description: "Veja como anunciar seu caminhão no Caminhões à Venda.",
};

export default function AnunciarPage() {
  return (
    <main className="market-page trust-page">
      <PublicHeader />

      <section className="market-container trust-hero">
        <div>
          <span className="trust-eyebrow">Anunciar caminhão</span>
          <h1>Venda com apresentação organizada e contato direto.</h1>
          <p>
            Cadastre fotos reais, dados principais, valor, cidade e WhatsApp. O anúncio fica mais claro para o comprador e mais fácil de negociar.
          </p>
          <div className="trust-actions">
            <Link href="/cadastro" className="trust-btn primary">Começar anúncio</Link>
            <Link href="/anuncios" className="trust-btn ghost">Ver caminhões</Link>
          </div>
        </div>
        <aside>
          <strong>4 passos</strong>
          <span>Dados, fotos, revisão e publicação.</span>
        </aside>
      </section>

      <section className="market-container trust-grid three">
        <article>
          <span>01</span>
          <b>Dados principais</b>
          <ul>
            <li>Marca, modelo e ano</li>
            <li>Tração e carroceria</li>
            <li>Cidade, valor e WhatsApp</li>
            <li>Se aceita troca ou não</li>
          </ul>
        </article>
        <article>
          <span>02</span>
          <b>Fotos reais</b>
          <ul>
            <li>Frente, lateral e traseira</li>
            <li>Cabine, pneus e carroceria</li>
            <li>Imagens limpas e atuais</li>
            <li>Sem aparência artificial</li>
          </ul>
        </article>
        <article>
          <span>03</span>
          <b>Publicação</b>
          <p>O anúncio pode passar por revisão antes de aparecer publicamente. Isso mantém a plataforma organizada e confiável.</p>
        </article>
      </section>

      <section className="market-container trust-cta">
        <div>
          <span className="trust-eyebrow">Próximo passo</span>
          <h2>Crie sua conta e envie o caminhão para aprovação.</h2>
          <p>A troca entra como opção dentro do anúncio. O foco é deixar tudo simples, claro e direto.</p>
        </div>
        <Link href="/cadastro">Criar conta e anunciar</Link>
      </section>

      <SiteFooter />
    </main>
  );
}
