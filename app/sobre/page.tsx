import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function SobrePage() {
  return (
    <main className="market-page trust-page">
      <PublicHeader />

      <div
        className="market-container"
        style={{
          display: "grid",
          gap: 18,
          paddingTop: 22,
        }}
      >
        <section
          className="trust-hero"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 16,
            alignItems: "stretch",
          }}
        >
          <div
            className="market-hero-copy"
            style={{
              minHeight: 0,
            }}
          >
            <span className="trust-eyebrow">Sobre a plataforma</span>
            <h1>Um site para conectar compradores e vendedores de caminhões.</h1>
            <p>
              Nosso objetivo é reunir anúncios recentes em um só lugar, facilitar a busca de quem procura caminhões e ajudar quem vende a apresentar melhor suas oportunidades.
            </p>
          </div>
          <aside
            className="market-section"
            style={{
              display: "grid",
              gap: 6,
              padding: 20,
            }}
          >
            <strong>Direto</strong>
            <span>Fotos, dados e WhatsApp sem complicar.</span>
          </aside>
        </section>

        <section
          className="trust-grid two"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          <article
            className="market-section"
            style={{
              display: "grid",
              gap: 10,
              padding: 22,
            }}
          >
            <span>01</span>
            <b>Para quem compra</b>
            <h2>Encontre caminhões com informação clara.</h2>
            <p>Veja fotos, valor, cidade, configuração e chame direto no WhatsApp para confirmar disponibilidade e negociar.</p>
            <Link href="/anuncios">Procurar caminhões</Link>
          </article>

          <article
            className="market-section"
            style={{
              display: "grid",
              gap: 10,
              padding: 22,
            }}
          >
            <span>02</span>
            <b>Para quem vende</b>
            <h2>Anuncie com mais organização e alcance.</h2>
            <p>Cadastre dados, fotos, valor e contato. O anúncio passa por revisão antes de aparecer publicamente.</p>
            <Link href="/anunciar">Quero anunciar</Link>
          </article>
        </section>

        <section
          className="trust-card market-section"
          style={{
            display: "grid",
            gap: 10,
            padding: 24,
          }}
        >
          <span className="trust-eyebrow">Nossa direção</span>
          <h2>Mais que listar caminhões, queremos melhorar a experiência de compra e venda.</h2>
          <p>A plataforma Caminhões à Venda foi criada para aproximar compradores e vendedores com anúncios organizados, recentes e fáceis de consultar.</p>
          <p>A ideia é evoluir sempre: melhorar fotos, informações, apresentação dos anúncios, atendimento e confiança para que cada negociação comece de forma mais clara.</p>
        </section>

        <section
          className="trust-values"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          <div
            className="market-section"
            style={{
              display: "grid",
              gap: 6,
              padding: 20,
            }}
          ><strong>Anúncios recentes</strong><span>Estoque apresentado de forma organizada para facilitar a busca.</span></div>
          <div
            className="market-section"
            style={{
              display: "grid",
              gap: 6,
              padding: 20,
            }}
          ><strong>Compra e venda</strong><span>Um ponto de encontro entre quem procura e quem anuncia caminhões.</span></div>
          <div
            className="market-section"
            style={{
              display: "grid",
              gap: 6,
              padding: 20,
            }}
          ><strong>Evolução constante</strong><span>Melhorias contínuas para deixar a plataforma mais prática e confiável.</span></div>
        </section>

        <section
          className="trust-cta market-section"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            padding: 24,
          }}
        >
          <div>
            <span className="trust-eyebrow">Caminhões à venda</span>
            <h2>Veja o estoque ou anuncie seu caminhão.</h2>
          </div>
          <div className="trust-actions end">
            <Link className="trust-btn ghost" href="/anuncios">Ver caminhões</Link>
            <Link className="trust-btn primary" href="/anunciar">Anunciar</Link>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
