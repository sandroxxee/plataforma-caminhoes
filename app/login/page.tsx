import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginPage() {
  return (
    <main className="page">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Caminhões à Venda">
          <Image src="/logo-horizontal-web.png" alt="Caminhões à Venda" width={230} height={84} priority />
        </Link>
        <nav>
          <Link href="/anuncios">Ver caminhões</Link>
          <Link href="/cadastro" className="create">Criar conta</Link>
        </nav>
      </header>

      <section className="wrap">
        <div className="copy">
          <span>Área do anunciante</span>
          <h1>Acesse sua conta e gerencie seus anúncios.</h1>
          <p>Entre no painel para cadastrar caminhões, acompanhar publicações e manter seus dados organizados.</p>

          <div className="benefits" aria-label="Benefícios do painel">
            <div><b>01</b><strong>Cadastro organizado</strong><small>Dados, valor, cidade e WhatsApp em um só lugar.</small></div>
            <div><b>02</b><strong>Fotos reais</strong><small>Envie imagens do caminhão para revisão.</small></div>
            <div><b>03</b><strong>Publicação controlada</strong><small>O anúncio aparece após aprovação.</small></div>
          </div>
        </div>

        <div className="form-area">
          <LoginForm />
        </div>
      </section>

      <style>{`
        .page {
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(circle at 12% 8%, rgba(34,197,94,.20), transparent 28%),
            radial-gradient(circle at 86% 16%, rgba(34,197,94,.13), transparent 26%),
            linear-gradient(135deg, #020506 0%, #06110e 54%, #020506 100%);
          color: white;
          padding-bottom: 54px;
        }

        .page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .11;
          background-image:
            linear-gradient(rgba(34,197,94,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,.10) 1px, transparent 1px);
          background-size: 78px 78px;
          mask-image: linear-gradient(to bottom, black, transparent 82%);
        }

        .topbar {
          position: relative;
          z-index: 2;
          width: min(1120px, calc(100vw - 32px));
          min-height: 86px;
          margin: 18px auto 0;
          padding: 10px 14px 10px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.035)),
            linear-gradient(180deg, rgba(13,18,20,.92), rgba(7,12,13,.84));
          border: 1px solid rgba(255,255,255,.14);
          box-shadow: 0 18px 58px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,255,255,.08);
          backdrop-filter: blur(18px);
        }

        .brand {
          width: min(230px, 32vw);
          min-width: 180px;
          height: 58px;
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .brand img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 12px 20px rgba(0,0,0,.38));
        }

        nav {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        nav a {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 15px;
          border-radius: 14px;
          color: white;
          text-decoration: none;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .05em;
          text-transform: uppercase;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.12);
        }

        nav a.create {
          background: #22c55e;
          color: #052e16;
          border-color: rgba(34,197,94,.72);
          box-shadow: 0 14px 34px rgba(34,197,94,.18);
        }

        .wrap {
          position: relative;
          z-index: 1;
          width: min(1120px, calc(100vw - 32px));
          min-height: calc(100vh - 190px);
          margin: 0 auto;
          padding-top: 46px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 430px;
          gap: 54px;
          align-items: center;
        }

        .copy span {
          display: inline-flex;
          min-height: 34px;
          align-items: center;
          padding: 0 13px;
          border-radius: 999px;
          color: #bbf7d0;
          background: rgba(34,197,94,.12);
          border: 1px solid rgba(34,197,94,.32);
          font-size: 12px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: .07em;
        }

        .copy h1 {
          max-width: 690px;
          margin: 18px 0 16px;
          font-size: clamp(42px, 5.4vw, 72px);
          line-height: .98;
          letter-spacing: -.06em;
        }

        .copy p {
          max-width: 610px;
          margin: 0;
          color: #d7dee8;
          font-size: 18px;
          line-height: 1.6;
        }

        .benefits {
          margin-top: 28px;
          display: grid;
          gap: 10px;
          max-width: 620px;
        }

        .benefits div {
          min-height: 72px;
          display: grid;
          grid-template-columns: 44px 1fr;
          column-gap: 14px;
          align-items: center;
          padding: 13px 15px;
          border-radius: 16px;
          background: rgba(255,255,255,.055);
          border: 1px solid rgba(255,255,255,.10);
        }

        .benefits b {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: #22c55e;
          color: #052e16;
          font-size: 13px;
        }

        .benefits strong {
          display: block;
          color: #f8fafc;
          font-size: 15px;
        }

        .benefits small {
          display: block;
          margin-top: 3px;
          color: #aeb7c3;
          line-height: 1.35;
        }

        .form-area {
          align-self: center;
        }

        @media (max-width: 900px) {
          .topbar,
          .wrap {
            width: calc(100vw - 24px);
          }

          .topbar {
            margin-top: 12px;
            padding: 10px 12px;
          }

          .brand {
            min-width: 0;
            width: 178px;
          }

          nav a {
            padding: 0 12px;
          }

          .wrap {
            min-height: auto;
            grid-template-columns: 1fr;
            gap: 28px;
            padding-top: 28px;
          }

          .copy h1 {
            font-size: 40px;
          }
        }

        @media (max-width: 520px) {
          .topbar {
            align-items: flex-start;
            flex-direction: column;
          }

          nav {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .copy span {
            display: none;
          }

          .benefits {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
