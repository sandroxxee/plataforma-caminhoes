import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginPage() {
  return (
    <main className="page">
      <header className="topbar">
        <Link href="/" className="brand">Caminhões em Oferta</Link>
        <nav>
          <Link href="/anuncios">Estoque</Link>
          <Link href="/cadastro">Criar conta</Link>
        </nav>
      </header>

      <section className="wrap">
        <div className="copy">
          <span>Entrar</span>
          <h1>Acesse sua conta.</h1>
          <p>Entre com e-mail e senha para acessar o painel.</p>
        </div>

        <LoginForm />
      </section>

      <style>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 18% 6%, rgba(34,197,94,.16), transparent 28%),
            linear-gradient(135deg, #020617 0%, #061512 58%, #020617 100%);
          color: white;
          padding-bottom: 46px;
        }

        .topbar {
          width: min(1120px, calc(100vw - 32px));
          min-height: 76px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-bottom: 1px solid rgba(255,255,255,.10);
        }

        .brand,
        nav a {
          color: white;
          text-decoration: none;
          font-weight: 950;
        }

        .brand {
          font-size: 20px;
        }

        nav {
          display: flex;
          gap: 10px;
        }

        nav a {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border-radius: 14px;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.10);
        }

        .wrap {
          width: min(1080px, calc(100vw - 32px));
          margin: 0 auto;
          padding-top: 52px;
          display: grid;
          grid-template-columns: 1fr 430px;
          gap: 34px;
          align-items: start;
        }

        .copy span {
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

        .copy h1 {
          margin: 18px 0 14px;
          font-size: clamp(40px, 6vw, 64px);
          line-height: .96;
          letter-spacing: -.06em;
        }

        .copy p {
          margin: 0;
          color: #cbd5e1;
          font-size: 18px;
          line-height: 1.6;
        }

        @media (max-width: 850px) {
          .topbar,
          .wrap {
            width: calc(100vw - 24px);
          }

          .topbar {
            padding: 10px 0;
            align-items: flex-start;
            flex-direction: column;
          }

          .wrap {
            grid-template-columns: 1fr;
            padding-top: 28px;
          }
        }
      `}</style>
    </main>
  );
}
