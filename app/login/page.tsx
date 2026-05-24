import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { entrar } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams?: Promise<{
    erro?: string;
  }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const erro = params.erro ? decodeURIComponent(params.erro) : "";

  return (
    <main className="page">
      <PublicHeader />

      <section className="wrap">
        <div className="copy">
          <span>Entrar</span>
          <h1>Acesse sua conta.</h1>
          <p>Entre com e-mail e senha para acessar seu painel, criar anúncios ou administrar a plataforma.</p>
        </div>

        <form action={entrar} className="card">
          <h2>Login</h2>

          {erro && <div className="error">{erro}</div>}

          <label>
            E-mail
            <input name="email" type="email" placeholder="seuemail@exemplo.com" required autoComplete="email" />
          </label>

          <label>
            Senha
            <input name="senha" type="password" placeholder="Sua senha" required autoComplete="current-password" />
          </label>

          <button type="submit">Entrar</button>

          <p className="login-text">
            Ainda não tem conta? <Link href="/cadastro">Criar cadastro</Link>
          </p>
        </form>
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

        .card {
          padding: 26px;
          border-radius: 28px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.11);
          box-shadow: 0 24px 80px rgba(0,0,0,.24);
        }

        .card h2 {
          margin: 0 0 18px;
          font-size: 28px;
        }

        .error {
          padding: 13px 14px;
          border-radius: 16px;
          color: #fecaca;
          background: rgba(239,68,68,.12);
          border: 1px solid rgba(239,68,68,.24);
          margin-bottom: 14px;
          font-weight: 850;
        }

        label {
          display: grid;
          gap: 7px;
          color: #dbeafe;
          font-size: 14px;
          font-weight: 850;
          margin-bottom: 13px;
        }

        input {
          width: 100%;
          min-height: 50px;
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(2,6,23,.66);
          color: white;
          padding: 0 14px;
          font-size: 15px;
          outline: none;
          box-sizing: border-box;
        }

        input:focus {
          border-color: rgba(34,197,94,.65);
          box-shadow: 0 0 0 4px rgba(34,197,94,.12);
        }

        button {
          width: 100%;
          min-height: 54px;
          border: 0;
          border-radius: 16px;
          background: #22c55e;
          color: #052e16;
          font-size: 16px;
          font-weight: 950;
          cursor: pointer;
          margin-top: 4px;
        }

        .login-text {
          margin: 16px 0 0;
          color: #cbd5e1;
          text-align: center;
          font-size: 15px;
        }

        .login-text a {
          color: #86efac;
          font-weight: 950;
          text-decoration: none;
        }

        @media (max-width: 850px) {
          .wrap {
            width: calc(100vw - 24px);
            grid-template-columns: 1fr;
            padding-top: 28px;
          }

          .card {
            padding: 20px;
            border-radius: 22px;
          }
        }
      `}</style>
    </main>
  );
}
