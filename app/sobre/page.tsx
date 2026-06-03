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

      <style>{`
        .trust-page{padding-bottom:30px}.trust-hero{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:18px;align-items:stretch;padding:32px;margin-top:18px;border-radius:var(--radius);background:var(--surface);border:1px solid var(--line);box-shadow:var(--shadow)}.trust-eyebrow{display:inline-flex;min-height:28px;width:fit-content;align-items:center;padding:0 10px;border-radius:999px;background:var(--blueSoft);color:var(--blue);font-size:12px;font-weight:950;letter-spacing:.04em;text-transform:uppercase}.trust-hero h1,.trust-card h2,.trust-cta h2{margin:12px 0 10px;font-size:clamp(34px,4.5vw,58px);line-height:1.02;letter-spacing:-.045em}.trust-hero p,.trust-card p{margin:0;color:var(--muted);font-size:17px;font-weight:700;line-height:1.55;max-width:820px}.trust-card p+p{margin-top:10px}.trust-hero aside{display:flex;flex-direction:column;justify-content:flex-end;padding:20px;border-radius:18px;background:var(--soft);border:1px solid var(--line)}.trust-hero aside strong{font-size:38px;line-height:1;color:var(--blue);letter-spacing:-.04em}.trust-hero aside span{margin-top:8px;color:var(--muted);font-weight:850}.trust-grid{display:grid;gap:14px;margin-top:18px}.trust-grid.two{grid-template-columns:repeat(2,1fr)}.trust-grid article,.trust-card,.trust-cta,.trust-values div{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:22px}.trust-grid article>span{width:40px;height:40px;border-radius:14px;background:var(--blueSoft);color:var(--blue);display:grid;place-items:center;font-weight:950;margin-bottom:14px}.trust-grid b{display:block;color:var(--blue);font-size:13px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}.trust-grid h2{margin:0 0 10px;font-size:clamp(24px,3vw,36px);line-height:1.05;letter-spacing:-.035em}.trust-grid p{margin:0 0 16px;color:var(--muted);line-height:1.65;font-weight:700}.trust-grid article>a,.trust-btn{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 16px;border-radius:999px;font-weight:950}.trust-grid article>a,.trust-btn.primary{background:var(--blue);color:#fff}.trust-btn.ghost{background:var(--soft);border:1px solid var(--line);color:var(--text)}.trust-card{margin-top:18px}.trust-card h2{font-size:clamp(28px,3.5vw,44px)}.trust-values{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px}.trust-values div{display:grid;gap:8px}.trust-values strong{font-size:18px}.trust-values span{color:var(--muted);line-height:1.5;font-weight:700}.trust-cta{margin-top:18px;display:flex;align-items:center;justify-content:space-between;gap:20px}.trust-cta h2{font-size:clamp(28px,3.5vw,44px)}.trust-actions{display:flex;flex-wrap:wrap;gap:10px}.trust-actions.end{justify-content:flex-end}@media(max-width:900px){.trust-hero,.trust-grid.two,.trust-values{grid-template-columns:1fr}.trust-cta{display:block}.trust-actions.end{justify-content:flex-start;margin-top:18px}}@media(max-width:640px){.trust-hero{padding:22px}.trust-hero h1{font-size:34px}.trust-actions{display:grid}.trust-btn{width:100%}}
      `}</style>
    </main>
  );
}
