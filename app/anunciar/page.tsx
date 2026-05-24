import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Anunciar caminhão | Caminhões em Oferta",
  description: "Veja como anunciar seu caminhão no Caminhões em Oferta.",
};

export default function AnunciarPage() {
  return (
    <main className="page">
      <PublicHeader />

<section className="hero">
        <span>Anunciar caminhão</span>
        <h1>Venda seu caminhão com uma página organizada e contato direto.</h1>
        <p>
          Cadastre seu anúncio com fotos reais, dados principais e descrição. Depois da aprovação,
          ele aparece no estoque público do site.
        </p>

        <div className="actions">
          <Link href="/cadastro" className="primary">Começar anúncio</Link>
          <Link href="/como-funciona">Como funciona</Link>
        </div>
      </section>

      <section className="grid">
        <article>
          <b>O que informar</b>
          <ul>
            <li>Marca, modelo e ano</li>
            <li>Tração e carroceria</li>
            <li>Cidade e valor</li>
            <li>Descrição clara do caminhão</li>
            <li>Fotos reais e atuais</li>
          </ul>
        </article>

        <article>
          <b>O que ajuda a vender</b>
          <ul>
            <li>Fotos de frente, lateral e traseira</li>
            <li>Informar manutenção e procedência</li>
            <li>Deixar claro se aceita troca</li>
            <li>Responder rápido no WhatsApp</li>
            <li>Preço e cidade visíveis</li>
          </ul>
        </article>

        <article>
          <b>Aprovação do anúncio</b>
          <p>
            O anúncio passa por análise antes de aparecer no site. Isso mantém a plataforma mais organizada
            e evita anúncio incompleto ou sem informação importante.
          </p>
        </article>
      </section>

      <section className="cta">
        <div>
          <span>Próximo passo</span>
          <h2>Crie sua conta e envie seu caminhão para aprovação.</h2>
        </div>
        <Link href="/cadastro">Criar conta e anunciar</Link>
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

        .brand,
        nav a,
        .actions a,
        .cta a {
          text-decoration: none;
          font-weight: 950;
        }

        .brand {
          color: white;
          font-size: 20px;
        }

        nav {
          display: flex;
          gap: 10px;
        }

        nav a {
          min-height: 42px;
          padding: 0 14px;
          border-radius: 14px;
          color: white;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.10);
          display: inline-flex;
          align-items: center;
        }

        .hero,
        .grid,
        .cta {
          width: min(1180px, calc(100vw - 32px));
          margin-left: auto;
          margin-right: auto;
        }

        .hero {
          padding: 54px 0 28px;
        }

        .hero span,
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
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .hero h1 {
          max-width: 900px;
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

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 26px;
        }

        .actions a,
        .cta a {
          min-height: 52px;
          padding: 0 20px;
          border-radius: 16px;
          color: white;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .actions .primary,
        .cta a {
          background: #22c55e;
          color: #052e16;
          border-color: transparent;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        article,
        .cta {
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 28px;
          padding: 26px;
        }

        article b {
          color: #86efac;
          display: block;
          margin-bottom: 14px;
          font-size: 18px;
        }

        ul {
          margin: 0;
          padding-left: 20px;
          color: #dbeafe;
          line-height: 1.8;
        }

        article p {
          color: #dbeafe;
          line-height: 1.65;
          margin: 0;
        }

        .cta {
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .cta h2 {
          margin: 14px 0 0;
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.05;
          letter-spacing: -.04em;
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
          .grid,
          .cta {
            width: calc(100vw - 24px);
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .cta {
            display: grid;
          }

          .actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .actions a,
          .cta a {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
