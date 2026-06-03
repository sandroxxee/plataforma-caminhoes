import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function SobrePage() {
  return (
    <main className="market-page trust-page">
      <PublicHeader />

      <section className="market-container trust-hero">
        <div>
          <span className="trust-eyebrow">Sobre a plataforma</span>
          <h1>Um site para conectar compradores e vendedores de caminhões.</h1>
          <p>
            Nosso objetivo é reunir anúncios recentes em um só lugar, facilitar a busca de quem procura caminhões e ajudar quem vende a apresentar melhor suas oportunidades.
          </p>
        </div>
        <aside>
          <strong>Direto</strong>
          <span>Fotos, dados e WhatsApp sem complicar.</span>
        </aside>
      </section>

      <section className="market-container trust-grid two">
        <article>
          <span>01</span>
          <b>Para quem compra</b>
          <h2>Encontre caminhões com informação clara.</h2>
          <p>Veja fotos, valor, cidade, configuração e chame direto no WhatsApp para confirmar disponibilidade e negociar.</p>
          <Link href="/anuncios">Procurar caminhões</Link>
        </article>

        <article>
          <span>02</span>
          <b>Para quem vende</b>
          <h2>Anuncie com mais organização e alcance.</h2>
          <p>Cadastre dados, fotos, valor e contato. O anúncio passa por revisão antes de aparecer publicamente.</p>
          <Link href="/anunciar">Quero anunciar</Link>
        </article>
      </section>

      <section className="market-container trust-card">
        <span className="trust-eyebrow">Nossa direção</span>
        <h2>Mais que listar caminhões, queremos melhorar a experiência de compra e venda.</h2>
        <p>A plataforma Caminhões à Venda foi criada para aproximar compradores e vendedores com anúncios organizados, recentes e fáceis de consultar.</p>
        <p>A ideia é evoluir sempre: melhorar fotos, informações, apresentação dos anúncios, atendimento e confiança para que cada negociação comece de forma mais clara.</p>
      </section>

      <section className="market-container trust-values">
        <div><strong>Anúncios recentes</strong><span>Estoque apresentado de forma organizada para facilitar a busca.</span></div>
        <div><strong>Compra e venda</strong><span>Um ponto de encontro entre quem procura e quem anuncia caminhões.</span></div>
        <div><strong>Evolução constante</strong><span>Melhorias contínuas para deixar a plataforma mais prática e confiável.</span></div>
      </section>

      <section className="market-container trust-cta">
        <div>
          <span className="trust-eyebrow">Caminhões à venda</span>
          <h2>Veja o estoque ou anuncie seu caminhão.</h2>
        </div>
        <div className="trust-actions end">
          <Link className="trust-btn ghost" href="/anuncios">Ver caminhões</Link>
          <Link className="trust-btn primary" href="/anunciar">Anunciar</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
