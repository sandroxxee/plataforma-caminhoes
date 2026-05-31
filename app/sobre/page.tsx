import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function SobrePage() {
  return (
    <main className="public-page">
      <PublicHeader />

      <section className="wrap public-hero">
        <div>
          <span className="mini">Sobre a plataforma</span>
          <h1>Um site para conectar compradores e vendedores de caminhões.</h1>
          <p>Nosso objetivo é reunir anúncios recentes em um só lugar, facilitar a busca de quem procura caminhões e ajudar quem vende a apresentar melhor suas oportunidades.</p>
        </div>
        <aside>
          <strong>Direto</strong>
          <span>Fotos, dados e WhatsApp sem complicar.</span>
        </aside>
      </section>

      <section className="wrap public-card-grid two">
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

      <section className="wrap mission-card">
        <span className="mini">Nossa direção</span>
        <h2>Mais que listar caminhões, queremos melhorar a experiência de compra e venda.</h2>
        <p>A plataforma Caminhões à Venda foi criada para aproximar compradores e vendedores com anúncios organizados, recentes e fáceis de consultar.</p>
        <p>A ideia é evoluir sempre: melhorar fotos, informações, apresentação dos anúncios, atendimento e confiança para que cada negociação comece de forma mais clara.</p>
      </section>

      <section className="wrap value-grid">
        <div><strong>Anúncios recentes</strong><span>Estoque apresentado de forma organizada para facilitar a busca.</span></div>
        <div><strong>Compra e venda</strong><span>Um ponto de encontro entre quem procura e quem anuncia caminhões.</span></div>
        <div><strong>Evolução constante</strong><span>Melhorias contínuas para deixar a plataforma mais prática e confiável.</span></div>
      </section>

      <section className="wrap public-cta">
        <div>
          <span className="mini">Caminhões à venda</span>
          <h2>Veja o estoque ou anuncie seu caminhão.</h2>
        </div>
        <div className="actions">
          <Link className="btn primary" href="/anuncios">Ver caminhões</Link>
          <Link className="btn ghost" href="/anunciar">Anunciar</Link>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .public-page{min-height:100vh;color:var(--site-text);background:radial-gradient(circle at 82% -12%,color-mix(in srgb,var(--site-green) 18%,transparent),transparent 34%),radial-gradient(circle at 8% 4%,color-mix(in srgb,var(--site-gold) 10%,transparent),transparent 27%),linear-gradient(180deg,var(--site-bg),var(--site-bg-2));overflow-x:hidden;padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}.mini{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 28%,transparent);color:var(--site-green);font-size:12px;font-weight:950;letter-spacing:.06em;text-transform:uppercase}.public-hero{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:20px;align-items:stretch;margin-top:10px;padding:30px;border-radius:30px;background:linear-gradient(115deg,var(--site-surface),color-mix(in srgb,var(--site-surface) 70%,transparent)),radial-gradient(circle at 82% 18%,color-mix(in srgb,var(--site-green) 22%,transparent),transparent 28%);border:1px solid var(--site-line);box-shadow:var(--site-shadow);overflow:hidden}.public-hero h1{margin:14px 0 10px;max-width:900px;font-size:clamp(34px,4.4vw,58px);line-height:.98;letter-spacing:-.06em}.public-hero p{margin:0;max-width:760px;color:var(--site-muted);font-size:16px;line-height:1.55;font-weight:720}.public-hero aside{display:flex;flex-direction:column;justify-content:flex-end;padding:20px;border-radius:24px;background:var(--site-surface-2);border:1px solid var(--site-line)}.public-hero aside strong{font-size:40px;line-height:1;color:var(--site-green);letter-spacing:-.05em}.public-hero aside span{margin-top:8px;color:var(--site-muted);font-weight:900}.public-card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:18px}.public-card-grid.two{grid-template-columns:1fr 1fr}.public-card-grid article,.mission-card,.public-cta,.value-grid div{background:var(--site-surface);border:1px solid var(--site-line);border-radius:24px;box-shadow:var(--site-shadow-soft);padding:24px}.public-card-grid article>span{width:40px;height:40px;border-radius:16px;background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;display:grid;place-items:center;font-weight:950;margin-bottom:16px}.public-card-grid b{display:block;color:var(--site-green);font-size:13px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}.public-card-grid h2,.mission-card h2,.public-cta h2{margin:10px 0 10px;font-size:clamp(26px,3.3vw,40px);line-height:1.05;letter-spacing:-.045em}.public-card-grid p,.mission-card p{margin:0 0 18px;color:var(--site-muted);line-height:1.6;font-size:16px}.public-card-grid article>a{min-height:44px;padding:0 16px;border-radius:999px;background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;text-decoration:none;font-weight:950;display:inline-flex;align-items:center}.mission-card{margin-top:18px}.mission-card p:last-child{margin-bottom:0}.value-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px}.value-grid div{display:grid;gap:8px}.value-grid strong{font-size:18px}.value-grid span{color:var(--site-muted);line-height:1.5}.public-cta{margin-top:18px;display:flex;align-items:center;justify-content:space-between;gap:18px}.actions{display:flex;flex-wrap:wrap;gap:12px}.btn{min-height:50px;display:inline-flex;align-items:center;justify-content:center;padding:0 20px;border-radius:999px;border:1px solid var(--site-line);font-weight:950;text-decoration:none;text-transform:uppercase;font-size:12px;letter-spacing:.04em}.primary{background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#03220f;border-color:transparent;box-shadow:0 12px 28px color-mix(in srgb,var(--site-green) 22%,transparent)}.ghost{background:var(--site-surface-2);color:var(--site-text)}@media(max-width:900px){.public-hero,.public-card-grid,.public-card-grid.two,.value-grid{grid-template-columns:1fr}.public-cta{display:block}.actions{margin-top:18px}}@media(max-width:640px){.wrap{width:calc(100vw - 22px)}.public-hero{padding:22px;border-radius:24px}.public-hero h1{font-size:34px}.actions{display:grid}.btn{width:100%}}
      `}</style>
    </main>
  );
}
