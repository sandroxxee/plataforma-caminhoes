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

      {/* ── HERO ── */}
      <section className="market-container trust-hero cf-hero">
        <div>
          <span className="trust-eyebrow">Como funciona</span>
          <h1>Compra e venda de caminhões de forma simples.</h1>
          <p>
            Encontre caminhões reais, veja fotos e informações principais,
            compare os anúncios e fale direto com o anunciante pelo WhatsApp.
          </p>
          <div className="trust-actions">
            <Link className="trust-btn primary" href="/anuncios">Ver caminhões</Link>
            <Link className="trust-btn ghost" href="/cadastro">Anunciar meu caminhão</Link>
          </div>
        </div>

        {/* Aside com números de impacto */}
        <aside className="cf-hero-aside">
          <div className="cf-stat">
            <strong>100%</strong>
            <span>Contato direto com o vendedor</span>
          </div>
          <div className="cf-divider" />
          <div className="cf-stat">
            <strong>Grátis</strong>
            <span>Para compradores navegarem</span>
          </div>
          <div className="cf-divider" />
          <div className="cf-stat">
            <strong>✅</strong>
            <span>Anúncios aprovados pela equipe</span>
          </div>
        </aside>
      </section>

      {/* ── 3 PASSOS ── */}
      <section className="market-container trust-grid three cf-steps-grid">
        <article className="cf-step-card">
          <div className="cf-step-num">01</div>
          <b className="cf-step-tag">Para comprar</b>
          <h2>Procure no estoque.</h2>
          <p>
            Navegue pelo estoque, use os filtros, abra o anúncio e confira
            fotos, ano, tração, carroceria, cidade, preço e descrição.
          </p>
          <Link href="/anuncios">Ver caminhões →</Link>
        </article>

        <article className="cf-step-card cf-step-featured">
          <div className="cf-step-num">02</div>
          <b className="cf-step-tag">Para vender</b>
          <h2>Cadastre o anúncio.</h2>
          <p>
            Crie sua conta, cadastre os dados do caminhão, envie fotos reais
            e aguarde aprovação para aparecer publicamente.
          </p>
          <Link href="/cadastro">Criar conta →</Link>
        </article>

        <article className="cf-step-card">
          <div className="cf-step-num">03</div>
          <b className="cf-step-tag">Segurança</b>
          <h2>Confira antes de fechar.</h2>
          <p>
            A plataforma divulga anúncios. Antes de fechar negócio, confira
            documentos, procedência, estado do veículo e dados do vendedor.
          </p>
          <Link href="/sobre">Entender melhor →</Link>
        </article>
      </section>

      {/* ── FLUXOS ── */}
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

      {/* ── CTA FINAL ── */}
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
        /* Hero aside com números */
        .cf-hero-aside {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
          padding: 24px;
          border-radius: 18px;
          background: var(--soft);
          border: 1px solid var(--line);
        }
        .cf-stat {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 18px 4px;
        }
        .cf-stat strong {
          font-size: clamp(28px, 3.5vw, 44px);
          line-height: 1;
          color: var(--blue);
          letter-spacing: -.04em;
        }
        .cf-stat span {
          font-size: 14px;
          color: var(--muted);
          font-weight: 750;
          line-height: 1.4;
        }
        .cf-divider {
          height: 1px;
          background: var(--line);
          margin: 0 4px;
        }

        /* Cards dos 3 passos */
        .cf-step-card {
          position: relative;
          transition: box-shadow .2s, transform .2s;
        }
        .cf-step-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 40px rgba(15,23,42,.14);
        }
        .cf-step-num {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: var(--blueSoft);
          color: var(--blue);
          display: grid;
          place-items: center;
          font-weight: 950;
          font-size: 15px;
          margin-bottom: 14px;
        }
        .cf-step-featured .cf-step-num {
          background: var(--blue);
          color: #fff;
        }
        .cf-step-tag {
          display: block;
          color: var(--blue);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: .05em;
          margin-bottom: 8px;
        }
        .cf-step-featured {
          border-color: var(--blue) !important;
          box-shadow: 0 0 0 1px var(--blue), 0 14px 34px rgba(24,119,242,.12) !important;
        }

        /* Mobile */
        @media (max-width: 900px) {
          .cf-hero-aside {
            flex-direction: row;
            gap: 0;
            padding: 16px;
          }
          .cf-stat { flex: 1; padding: 12px 8px; text-align: center; align-items: center; }
          .cf-divider { width: 1px; height: auto; margin: 8px 0; }
        }
        @media (max-width: 560px) {
          .cf-stat strong { font-size: 26px; }
          .cf-stat span { font-size: 12px; }
        }
      `}</style>
    </main>
  );
}
