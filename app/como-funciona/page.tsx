import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Como funciona | Caminhões em Oferta",
  description: "Entenda como comprar, vender e anunciar caminhões na plataforma Caminhões em Oferta.",
};

export default function ComoFuncionaPage() {
  return (
    <main className="page">
      <PublicHeader />

<section className="hero">
        <span>Como funciona</span>
        <h1>Compra, venda e troca de caminhões de forma simples.</h1>
        <p>
          Encontre caminhões reais, veja fotos e informações principais, compare os anúncios e fale direto com o anunciante pelo WhatsApp.
        </p>
      </section>

      <section className="cards">
        <article>
          <b>01</b>
          <h2>Para quem quer comprar</h2>
          <p>
            Navegue pelo estoque, use os filtros, abra o anúncio, confira fotos, ano, tração, carroceria, cidade, preço e descrição.
          </p>
          <Link href="/anuncios">Ver caminhões disponíveis</Link>
        </article>

        <article>
          <b>02</b>
          <h2>Para quem quer anunciar</h2>
          <p>
            Crie sua conta, cadastre os dados do caminhão, envie fotos reais e aguarde aprovação para aparecer publicamente.
          </p>
          <Link href="/cadastro">Criar conta para anunciar</Link>
        </article>

        <article>
          <b>03</b>
          <h2>Segurança na negociação</h2>
          <p>
            A plataforma divulga anúncios. Antes de fechar negócio, confira documentos, procedência, estado do veículo e dados do vendedor.
          </p>
          <Link href="/anunciar">Entender anúncio</Link>
        </article>
      </section>

      <section className="steps">
        <div>
          <span>Fluxo do comprador</span>
          <h2>Escolha, confira e chame no WhatsApp.</h2>
        </div>

        <ol>
          <li>Entrar no site e ver os caminhões disponíveis.</li>
          <li>Filtrar por marca, modelo, tração ou carroceria.</li>
          <li>Abrir o anúncio e analisar as informações.</li>
          <li>Chamar o anunciante no WhatsApp para negociar.</li>
        </ol>
      </section>

      <section className="steps">
        <div>
          <span>Fluxo do anunciante</span>
          <h2>Cadastre, envie e aguarde aprovação.</h2>
        </div>

        <ol>
          <li>Criar cadastro no site.</li>
          <li>Informar dados principais do caminhão.</li>
          <li>Enviar fotos reais do veículo.</li>
          <li>Aguardar análise e aprovação do anúncio.</li>
        </ol>
      </section>

      <section className="cta">
        <div>
          <span>Pronto para negociar?</span>
          <h2>Veja o estoque ou anuncie seu caminhão.</h2>
        </div>
        <div className="actions">
          <Link href="/anuncios">Ver estoque</Link>
          <Link href="/cadastro" className="primary">Anunciar caminhão</Link>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 18% 6%, rgba(34,197,94,.16), transparent 28%),
            linear-gradient(135deg, #020617 0%, #061512 58%, #020617 100%);
          color: white;
          padding-bottom: 30px;
        }

        .topbar {
          width: min(1180px, calc(100vw - 32px));
          min-height: 76px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-bottom: 1px solid rgba(255,255,255,.10);
        }

        .brand {
          color: white;
          text-decoration: none;
          font-weight: 950;
          font-size: 20px;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        nav a,
        .actions a,
        .cards a {
          text-decoration: none;
          font-weight: 950;
          border-radius: 14px;
        }

        nav a {
          color: white;
          min-height: 42px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.10);
        }

        nav .login,
        .actions .primary,
        .cards a {
          background: #22c55e;
          color: #052e16;
          border-color: transparent;
        }

        .hero,
        .cards,
        .steps,
        .cta {
          width: min(1180px, calc(100vw - 32px));
          margin-left: auto;
          margin-right: auto;
        }

        .hero {
          padding: 50px 0 24px;
        }

        .hero span,
        .steps span,
        .cta span {
          display: inline-flex;
          min-height: 32px;
          align-items: center;
          padding: 0 13px;
          border-radius: 999px;
          color: #86efac;
          background: rgba(34,197,94,.12);
          border: 1px solid rgba(34,197,94,.22);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 850px;
          margin: 18px 0 14px;
          font-size: clamp(40px, 6vw, 72px);
          line-height: .96;
          letter-spacing: -.06em;
        }

        .hero p {
          max-width: 780px;
          margin: 0;
          color: #dbeafe;
          font-size: 19px;
          line-height: 1.6;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 10px;
        }

        .cards article,
        .steps,
        .cta {
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 28px;
        }

        .cards article {
          padding: 24px;
        }

        .cards b {
          color: #86efac;
          font-size: 14px;
        }

        .cards h2 {
          margin: 12px 0 10px;
          font-size: 25px;
          line-height: 1.1;
        }

        .cards p {
          color: #cbd5e1;
          line-height: 1.6;
          margin: 0 0 18px;
        }

        .cards a,
        .actions a {
          min-height: 48px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .steps {
          margin-top: 16px;
          padding: 28px;
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 24px;
        }

        .steps h2,
        .cta h2 {
          margin: 14px 0 0;
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.05;
          letter-spacing: -.04em;
        }

        ol {
          margin: 0;
          padding-left: 22px;
          color: #dbeafe;
          font-size: 18px;
          line-height: 1.8;
        }

        .cta {
          margin-top: 16px;
          padding: 28px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: center;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .actions a {
          color: white;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
        }

        @media (max-width: 850px) {
          .topbar {
            width: calc(100vw - 24px);
            padding: 10px 0;
            align-items: flex-start;
            flex-direction: column;
          }

          nav {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 4px;
          }

          .hero,
          .cards,
          .steps,
          .cta {
            width: calc(100vw - 24px);
          }

          .cards,
          .steps {
            grid-template-columns: 1fr;
          }

          .cta {
            display: grid;
          }

          .actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .actions a {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
