import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Anunciar caminhão | Caminhões à Venda",
  description: "Veja como anunciar seu caminhão no Caminhões à Venda.",
};

export default function AnunciarPage() {
  return (
    <main className="public-page">
      <PublicHeader />

      <section className="wrap public-hero">
        <div>
          <span className="mini">Anunciar caminhão</span>
          <h1>Venda com apresentação organizada e contato direto.</h1>
          <p>Envie fotos reais, dados principais, valor, cidade e WhatsApp. O anúncio fica mais claro para o comprador e mais fácil de negociar.</p>
          <div className="hero-actions">
            <Link href="/cadastro" className="btn primary">Começar anúncio</Link>
            <Link href="/anuncios" className="btn ghost">Ver caminhões</Link>
          </div>
        </div>
        <aside>
          <strong>4 passos</strong>
          <span>Dados, fotos, revisão e publicação.</span>
        </aside>
      </section>

      <section className="wrap public-card-grid">
        <article>
          <span>01</span>
          <b>Dados principais</b>
          <ul><li>Marca, modelo e ano</li><li>Tração e carroceria</li><li>Cidade, valor e WhatsApp</li><li>Se aceita troca ou não</li></ul>
        </article>
        <article>
          <span>02</span>
          <b>Fotos reais</b>
          <ul><li>Frente, lateral e traseira</li><li>Cabine, pneus e carroceria</li><li>Imagens limpas e atuais</li><li>Sem aparência artificial</li></ul>
        </article>
        <article>
          <span>03</span>
          <b>Publicação</b>
          <p>O anúncio pode passar por revisão antes de aparecer publicamente. Isso mantém a plataforma organizada e confiável.</p>
        </article>
      </section>

      <section className="wrap public-cta">
        <div>
          <span className="mini">Próximo passo</span>
          <h2>Crie sua conta e envie o caminhão para aprovação.</h2>
          <p>A troca entra como opção dentro do anúncio. O foco é deixar tudo simples, claro e direto.</p>
        </div>
        <Link href="/cadastro">Criar conta e anunciar</Link>
      </section>

      <SiteFooter />

      <style>{`
        .public-page{min-height:100vh;color:var(--site-text);background:radial-gradient(circle at 82% -12%,color-mix(in srgb,var(--site-green) 18%,transparent),transparent 34%),radial-gradient(circle at 8% 4%,color-mix(in srgb,var(--site-gold) 10%,transparent),transparent 27%),linear-gradient(180deg,var(--site-bg),var(--site-bg-2));overflow-x:hidden;padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}.mini{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 28%,transparent);color:var(--site-green);font-size:12px;font-weight:950;letter-spacing:.06em;text-transform:uppercase}.public-hero{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:20px;align-items:stretch;margin-top:10px;padding:30px;border-radius:30px;background:linear-gradient(115deg,var(--site-surface),color-mix(in srgb,var(--site-surface) 70%,transparent)),radial-gradient(circle at 82% 18%,color-mix(in srgb,var(--site-green) 22%,transparent),transparent 28%);border:1px solid var(--site-line);box-shadow:var(--site-shadow);overflow:hidden}.public-hero h1{margin:14px 0 10px;max-width:840px;font-size:clamp(34px,4.4vw,58px);line-height:.98;letter-spacing:-.06em}.public-hero p{margin:0;max-width:760px;color:var(--site-muted);font-size:16px;line-height:1.55;font-weight:720}.public-hero aside{display:flex;flex-direction:column;justify-content:flex-end;padding:20px;border-radius:24px;background:var(--site-surface-2);border:1px solid var(--site-line)}.public-hero aside strong{font-size:40px;line-height:1;color:var(--site-green);letter-spacing:-.05em}.public-hero aside span{margin-top:8px;color:var(--site-muted);font-weight:900}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}.btn,.public-cta>a{min-height:50px;display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:0 20px;border-radius:999px;border:1px solid var(--site-line);font-size:12px;font-weight:950;letter-spacing:.04em;text-transform:uppercase;text-decoration:none}.primary,.public-cta>a{background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;border-color:transparent;box-shadow:0 14px 34px color-mix(in srgb,var(--site-green) 22%,transparent)}.ghost{background:var(--site-surface-2);color:var(--site-text)}.public-card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:18px}.public-card-grid article,.public-cta{background:var(--site-surface);border:1px solid var(--site-line);border-radius:24px;box-shadow:var(--site-shadow-soft);padding:24px}.public-card-grid article>span{width:40px;height:40px;border-radius:16px;background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;display:grid;place-items:center;font-weight:950;margin-bottom:16px}.public-card-grid b{display:block;color:var(--site-text);font-size:20px;margin-bottom:12px}.public-card-grid ul{margin:0;padding-left:20px;color:var(--site-muted);line-height:1.85}.public-card-grid p{margin:0;color:var(--site-muted);line-height:1.65}.public-cta{margin-top:18px;display:flex;align-items:center;justify-content:space-between;gap:22px}.public-cta h2{margin:14px 0 8px;font-size:clamp(28px,4vw,44px);line-height:1.05;letter-spacing:-.045em}.public-cta p{margin:0;color:var(--site-muted);font-size:17px;line-height:1.55}@media(max-width:900px){.public-hero,.public-card-grid{grid-template-columns:1fr}.public-cta{display:block}.public-cta>a{margin-top:18px}}@media(max-width:640px){.wrap{width:calc(100vw - 22px)}.public-hero{padding:22px;border-radius:24px}.public-hero h1{font-size:34px}.hero-actions{display:grid}.btn,.public-cta>a{width:100%}}
      `}</style>
    </main>
  );
}
