import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Como funciona | Caminhões à Venda",
  description: "Entenda como comprar, vender e anunciar caminhões na plataforma Caminhões à Venda.",
};

export default function ComoFuncionaPage() {
  return (
    <main className="public-page">
      <PublicHeader />

      <section className="wrap public-hero">
        <div>
          <span className="mini">Como funciona</span>
          <h1>Compra e venda de caminhões de forma simples.</h1>
          <p>Encontre caminhões reais, veja fotos e informações principais, compare os anúncios e fale direto com o anunciante pelo WhatsApp.</p>
        </div>
        <aside>
          <strong>3 fluxos</strong>
          <span>Comprar, anunciar e negociar com mais clareza.</span>
        </aside>
      </section>

      <section className="wrap public-card-grid">
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

      <section className="wrap steps-grid">
        <article>
          <span className="mini">Fluxo do comprador</span>
          <h2>Escolha, confira e chame no WhatsApp.</h2>
          <ol>
            <li>Entrar no site e ver os caminhões disponíveis.</li>
            <li>Filtrar por marca, modelo, tração ou carroceria.</li>
            <li>Abrir o anúncio e analisar as informações.</li>
            <li>Chamar o anunciante no WhatsApp para negociar.</li>
          </ol>
        </article>

        <article>
          <span className="mini">Fluxo do anunciante</span>
          <h2>Cadastre, envie e aguarde aprovação.</h2>
          <ol>
            <li>Criar cadastro no site.</li>
            <li>Informar dados principais do caminhão.</li>
            <li>Enviar fotos reais do veículo.</li>
            <li>Aguardar análise e aprovação do anúncio.</li>
          </ol>
        </article>
      </section>

      <section className="wrap public-cta">
        <div>
          <span className="mini">Pronto para negociar?</span>
          <h2>Veja o estoque ou anuncie seu caminhão.</h2>
        </div>
        <div className="actions">
          <Link className="btn ghost" href="/anuncios">Ver estoque</Link>
          <Link className="btn primary" href="/cadastro">Anunciar caminhão</Link>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .public-page{min-height:100vh;color:var(--site-text);background:radial-gradient(circle at 82% -12%,color-mix(in srgb,var(--site-green) 18%,transparent),transparent 34%),radial-gradient(circle at 8% 4%,color-mix(in srgb,var(--site-gold) 10%,transparent),transparent 27%),linear-gradient(180deg,var(--site-bg),var(--site-bg-2));overflow-x:hidden;padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}.mini{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 28%,transparent);color:var(--site-green);font-size:12px;font-weight:950;letter-spacing:.06em;text-transform:uppercase}.public-hero{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:20px;align-items:stretch;margin-top:10px;padding:30px;border-radius:30px;background:linear-gradient(115deg,var(--site-surface),color-mix(in srgb,var(--site-surface) 70%,transparent)),radial-gradient(circle at 82% 18%,color-mix(in srgb,var(--site-green) 22%,transparent),transparent 28%);border:1px solid var(--site-line);box-shadow:var(--site-shadow);overflow:hidden}.public-hero h1{margin:14px 0 10px;max-width:900px;font-size:clamp(34px,4.4vw,58px);line-height:.98;letter-spacing:-.06em}.public-hero p{margin:0;max-width:760px;color:var(--site-muted);font-size:16px;line-height:1.55;font-weight:720}.public-hero aside{display:flex;flex-direction:column;justify-content:flex-end;padding:20px;border-radius:24px;background:var(--site-surface-2);border:1px solid var(--site-line)}.public-hero aside strong{font-size:40px;line-height:1;color:var(--site-green);letter-spacing:-.05em}.public-hero aside span{margin-top:8px;color:var(--site-muted);font-weight:900}.public-card-grid,.steps-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:18px}.steps-grid{grid-template-columns:1fr 1fr}.public-card-grid article,.steps-grid article,.public-cta{background:var(--site-surface);border:1px solid var(--site-line);border-radius:24px;box-shadow:var(--site-shadow-soft);padding:24px}.public-card-grid article>span{width:40px;height:40px;border-radius:16px;background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;display:grid;place-items:center;font-weight:950;margin-bottom:16px}.public-card-grid b{display:block;color:var(--site-green);font-size:13px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}.public-card-grid h2,.steps-grid h2,.public-cta h2{margin:10px 0 10px;font-size:clamp(24px,3vw,38px);line-height:1.05;letter-spacing:-.045em}.public-card-grid p{margin:0 0 18px;color:var(--site-muted);line-height:1.6;font-size:16px}.public-card-grid a{min-height:44px;padding:0 16px;border-radius:999px;background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;text-decoration:none;font-weight:950;display:inline-flex;align-items:center}.steps-grid ol{margin:16px 0 0;padding-left:22px;color:var(--site-muted);font-size:16px;line-height:1.8}.public-cta{margin-top:18px;display:flex;align-items:center;justify-content:space-between;gap:18px}.actions{display:flex;flex-wrap:wrap;gap:12px}.btn{min-height:50px;display:inline-flex;align-items:center;justify-content:center;padding:0 20px;border-radius:999px;border:1px solid var(--site-line);font-weight:950;text-decoration:none;text-transform:uppercase;font-size:12px;letter-spacing:.04em}.primary{background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#03220f;border-color:transparent;box-shadow:0 12px 28px color-mix(in srgb,var(--site-green) 22%,transparent)}.ghost{background:var(--site-surface-2);color:var(--site-text)}@media(max-width:900px){.public-hero,.public-card-grid,.steps-grid{grid-template-columns:1fr}.public-cta{display:block}.actions{margin-top:18px}}@media(max-width:640px){.wrap{width:calc(100vw - 22px)}.public-hero{padding:22px;border-radius:24px}.public-hero h1{font-size:34px}.actions{display:grid}.btn{width:100%}}
      `}</style>
    </main>
  );
}
