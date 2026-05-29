import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginPage() {
  return (
    <main className="login-page">
      <header className="login-topbar">
        <Link href="/" className="brand" aria-label="Caminhões à Venda">
          <Image src="/logo-horizontal-web.png" alt="Caminhões à Venda" width={230} height={84} priority />
        </Link>
        <nav>
          <Link href="/anuncios">Ver caminhões</Link>
          <Link href="/cadastro" className="create">Criar conta</Link>
        </nav>
      </header>

      <section className="login-shell">
        <div className="login-copy">
          <span>Área do anunciante</span>
          <h1>Acesse sua conta.</h1>
          <p>Entre com e-mail e senha para gerenciar seus anúncios.</p>
        </div>

        <div className="login-card-wrap">
          <LoginForm />
        </div>
      </section>

      <style>{`
        .login-page {
          min-height: 100vh;
          color: white;
          background:
            radial-gradient(circle at 18% 6%, rgba(34,197,94,.16), transparent 28%),
            linear-gradient(135deg, #020506 0%, #06110e 58%, #020506 100%);
          overflow-x: hidden;
          padding-bottom: 44px;
        }

        .login-topbar {
          width: min(1080px, calc(100vw - 32px));
          min-height: 78px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-bottom: 1px solid rgba(255,255,255,.10);
        }

        .brand {
          width: 210px;
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
          color: white;
          text-decoration: none;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .04em;
          text-transform: uppercase;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.10);
        }

        nav a.create {
          background: #22c55e;
          color: #052e16;
          border-color: rgba(34,197,94,.72);
        }

        .login-shell {
          width: min(1080px, calc(100vw - 32px));
          min-height: calc(100vh - 130px);
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 420px;
          gap: 42px;
          align-items: center;
        }

        .login-copy span {
          display: inline-flex;
          min-height: 32px;
          align-items: center;
          padding: 0 13px;
          border-radius: 999px;
          color: #bbf7d0;
          background: rgba(34,197,94,.12);
          border: 1px solid rgba(34,197,94,.28);
          font-size: 12px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .login-copy h1 {
          max-width: 560px;
          margin: 18px 0 14px;
          font-size: clamp(42px, 5vw, 64px);
          line-height: .98;
          letter-spacing: -.055em;
        }

        .login-copy p {
          max-width: 520px;
          margin: 0;
          color: #cbd5e1;
          font-size: 18px;
          line-height: 1.6;
        }

        .login-card-wrap {
          width: 100%;
        }

        @media (max-width: 850px) {
          .login-topbar,
          .login-shell {
            width: calc(100vw - 24px);
          }

          .login-topbar {
            padding: 10px 0;
            align-items: flex-start;
            flex-direction: column;
          }

          .brand {
            width: 178px;
          }

          nav {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .login-shell {
            min-height: auto;
            grid-template-columns: 1fr;
            gap: 24px;
            padding-top: 28px;
          }

          .login-copy h1 {
            font-size: 40px;
          }
        }
      `}</style>
    </main>
  );
}
