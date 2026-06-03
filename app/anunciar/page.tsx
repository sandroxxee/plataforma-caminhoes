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

      <style>{`
        .trust-page{padding-bottom:30px}.trust-hero{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:18px;align-items:stretch;padding:32px;margin-top:18px;border-radius:var(--radius);background:var(--surface);border:1px solid var(--line);box-shadow:var(--shadow)}.trust-eyebrow{display:inline-flex;min-height:28px;width:fit-content;align-items:center;padding:0 10px;border-radius:999px;background:var(--blueSoft);color:var(--blue);font-size:12px;font-weight:950;letter-spacing:.04em;text-transform:uppercase}.trust-hero h1,.trust-cta h2{margin:12px 0 10px;font-size:clamp(34px,4.5vw,58px);line-height:1.02;letter-spacing:-.045em}.trust-hero p,.trust-cta p{margin:0;color:var(--muted);font-size:17px;font-weight:700;line-height:1.55;max-width:760px}.trust-hero aside{display:flex;flex-direction:column;justify-content:flex-end;padding:20px;border-radius:18px;background:var(--soft);border:1px solid var(--line)}.trust-hero aside strong{font-size:38px;line-height:1;color:var(--blue);letter-spacing:-.04em}.trust-hero aside span{margin-top:8px;color:var(--muted);font-weight:850}.trust-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.trust-btn,.trust-cta>a{min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding:0 18px;border-radius:999px;font-weight:950}.trust-btn.primary,.trust-cta>a{background:var(--blue);color:#fff;box-shadow:0 7px 16px rgba(24,119,242,.22)}.trust-btn.ghost{background:var(--soft);border:1px solid var(--line);color:var(--text)}.trust-grid{display:grid;gap:14px;margin-top:18px}.trust-grid.three{grid-template-columns:repeat(3,1fr)}.trust-grid article,.trust-cta{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:22px}.trust-grid article>span{width:40px;height:40px;border-radius:14px;background:var(--blueSoft);color:var(--blue);display:grid;place-items:center;font-weight:950;margin-bottom:14px}.trust-grid b{display:block;font-size:20px;margin-bottom:10px}.trust-grid ul{margin:0;padding-left:20px;color:var(--muted);line-height:1.8;font-weight:700}.trust-grid p{margin:0;color:var(--muted);line-height:1.65;font-weight:700}.trust-cta{margin-top:18px;display:flex;align-items:center;justify-content:space-between;gap:20px}.trust-cta h2{font-size:clamp(28px,3.5vw,44px)}@media(max-width:900px){.trust-hero,.trust-grid.three{grid-template-columns:1fr}.trust-cta{display:block}.trust-cta>a{margin-top:18px}}@media(max-width:640px){.trust-hero{padding:22px}.trust-hero h1{font-size:34px}.trust-actions{display:grid}.trust-btn,.trust-cta>a{width:100%}}
      `}</style>
    </main>
  );
}
