import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Como funciona | Caminhões à Venda",
  description: "Entenda como comprar, vender e anunciar caminhões na plataforma Caminhões à Venda.",
};

export default function ComoFuncionaPage() {
  return (
    <main className="market-page trust-page">
      <PublicHeader />

      <section className="market-container trust-hero">
        <div>
          <span className="trust-eyebrow">Como funciona</span>
          <h1>Compra e venda de caminhões de forma simples.</h1>
          <p>Encontre caminhões reais, veja fotos e informações principais, compare os anúncios e fale direto com o anunciante pelo WhatsApp.</p>
        </div>
        <aside>
          <strong>3 fluxos</strong>
          <span>Comprar, anunciar e negociar com mais clareza.</span>
        </aside>
      </section>

      <section className="market-container trust-grid three">
        <article>
          <span>01</span>
          <b>Para comprar</b>
          <h2>Procure no estoque.</h2>
          <p>Navegue pelo estoque, use os filtros, abra o anúncio e confira fotos, ano, tração, carroceria, cidade, preço e descrição.</p>
          <Link href="/anuncios">Ver caminhões</Link>
        </article>

        <article>
          <span>02</span>
          <b>Para vender</b>
          <h2>Cadastre o anúncio.</h2>
          <p>Crie sua conta, cadastre os dados do caminhão, envie fotos reais e aguarde aprovação para aparecer publicamente.</p>
          <Link href="/cadastro">Criar conta</Link>
        </article>

        <article>
          <span>03</span>
          <b>Segurança</b>
          <h2>Confira antes de fechar.</h2>
          <p>A plataforma divulga anúncios. Antes de fechar negócio, confira documentos, procedência, estado do veículo e dados do vendedor.</p>
          <Link href="/sobre">Entender melhor</Link>
        </article>
      </section>

      <section className="market-container trust-steps">
        <article>
          <span className="trust-eyebrow">Fluxo do comprador</span>
          <h2>Escolha, confira e chame no WhatsApp.</h2>
          <ol>
            <li>Entrar no site e ver os caminhões disponíveis.</li>
            <li>Filtrar por marca, modelo, tração ou carroceria.</li>
            <li>Abrir o anúncio e analisar as informações.</li>
            <li>Chamar o anunciante no WhatsApp para negociar.</li>
          </ol>
        </article>

        <article>
          <span className="trust-eyebrow">Fluxo do anunciante</span>
          <h2>Cadastre, envie e aguarde aprovação.</h2>
          <ol>
            <li>Criar cadastro no site.</li>
            <li>Informar dados principais do caminhão.</li>
            <li>Enviar fotos reais do veículo.</li>
            <li>Aguardar análise e aprovação do anúncio.</li>
          </ol>
        </article>
      </section>

      <section className="market-container trust-cta">
        <div>
          <span className="trust-eyebrow">Pronto para negociar?</span>
          <h2>Veja o estoque ou anuncie seu caminhão.</h2>
        </div>
        <div className="trust-actions end">
          <Link className="trust-btn ghost" href="/anuncios">Ver estoque</Link>
          <Link className="trust-btn primary" href="/cadastro">Anunciar caminhão</Link>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .trust-page{padding-bottom:30px}.trust-hero{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:18px;align-items:stretch;padding:32px;margin-top:18px;border-radius:var(--radius);background:var(--surface);border:1px solid var(--line);box-shadow:var(--shadow)}.trust-eyebrow{display:inline-flex;min-height:28px;width:fit-content;align-items:center;padding:0 10px;border-radius:999px;background:var(--blueSoft);color:var(--blue);font-size:12px;font-weight:950;letter-spacing:.04em;text-transform:uppercase}.trust-hero h1,.trust-steps h2,.trust-cta h2{margin:12px 0 10px;font-size:clamp(34px,4.5vw,58px);line-height:1.02;letter-spacing:-.045em}.trust-hero p{margin:0;color:var(--muted);font-size:17px;font-weight:700;line-height:1.55;max-width:820px}.trust-hero aside{display:flex;flex-direction:column;justify-content:flex-end;padding:20px;border-radius:18px;background:var(--soft);border:1px solid var(--line)}.trust-hero aside strong{font-size:38px;line-height:1;color:var(--blue);letter-spacing:-.04em}.trust-hero aside span{margin-top:8px;color:var(--muted);font-weight:850}.trust-grid{display:grid;gap:14px;margin-top:18px}.trust-grid.three{grid-template-columns:repeat(3,1fr)}.trust-grid article,.trust-steps article,.trust-cta{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:22px}.trust-grid article>span{width:40px;height:40px;border-radius:14px;background:var(--blueSoft);color:var(--blue);display:grid;place-items:center;font-weight:950;margin-bottom:14px}.trust-grid b{display:block;color:var(--blue);font-size:13px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}.trust-grid h2{margin:0 0 10px;font-size:clamp(23px,2.6vw,34px);line-height:1.05;letter-spacing:-.035em}.trust-grid p{margin:0 0 16px;color:var(--muted);line-height:1.65;font-weight:700}.trust-grid article>a,.trust-btn{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 16px;border-radius:999px;font-weight:950}.trust-grid article>a,.trust-btn.primary{background:var(--blue);color:#fff}.trust-btn.ghost{background:var(--soft);border:1px solid var(--line);color:var(--text)}.trust-steps{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px}.trust-steps h2{font-size:clamp(26px,3.2vw,40px)}.trust-steps ol{margin:16px 0 0;padding-left:22px;color:var(--muted);font-size:16px;line-height:1.8;font-weight:700}.trust-cta{margin-top:18px;display:flex;align-items:center;justify-content:space-between;gap:20px}.trust-cta h2{font-size:clamp(28px,3.5vw,44px)}.trust-actions{display:flex;flex-wrap:wrap;gap:10px}.trust-actions.end{justify-content:flex-end}@media(max-width:900px){.trust-hero,.trust-grid.three,.trust-steps{grid-template-columns:1fr}.trust-cta{display:block}.trust-actions.end{justify-content:flex-start;margin-top:18px}}@media(max-width:640px){.trust-hero{padding:22px}.trust-hero h1{font-size:34px}.trust-actions{display:grid}.trust-btn{width:100%}}
      `}</style>
    </main>
  );
}
