import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { criarConta } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams?: Promise<{
    erro?: string;
  }>;
};

export default async function CadastroPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const erro = params.erro ? decodeURIComponent(params.erro) : "";

  return (
    <main className="page">
      <PublicHeader />

      <section className="wrap">
        <div className="copy">
          <span>Cadastro</span>
          <h1>Crie sua conta para anunciar caminhões.</h1>
          <p>
            Cadastro simples: nome, e-mail válido, telefone/WhatsApp e senha. Cidade fica somente no cadastro do anúncio.
          </p>

          <div className="info-box">
            <strong>Sem complicar</strong>
            <p>
              O e-mail é usado para entrar na conta. O telefone fica salvo como WhatsApp de contato.
            </p>
          </div>
        </div>

        <form action={criarConta} className="card">
          <h2>Criar conta</h2>

          {erro && <div className="error">{erro}</div>}

          <label>
            Nome
            <input name="nome" type="text" placeholder="Seu nome" required minLength={3} autoComplete="name" />
          </label>

          <label>
            E-mail válido
            <input name="email" type="email" placeholder="seuemail@exemplo.com" required autoComplete="email" />
          </label>

          <label>
            Telefone ou WhatsApp
            <input name="telefone" type="tel" placeholder="49 99999-9999" required autoComplete="tel" minLength={10} />
          </label>

          <label>
            Senha
            <input name="senha" type="password" placeholder="Mínimo 6 caracteres" required minLength={6} autoComplete="new-password" />
          </label>

          <button type="submit">Criar conta</button>

          <p className="login-text">
            Já tem conta? <Link href="/login">Entrar agora</Link>
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
          width: min(1120px, calc(100vw - 32px));
          margin: 0 auto;
          padding-top: 48px;
          display: grid;
          grid-template-columns: 1fr 450px;
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
          font-size: clamp(38px, 6vw, 64px);
          line-height: .96;
          letter-spacing: -.06em;
        }

        .copy p {
          margin: 0;
          color: #cbd5e1;
          font-size: 18px;
          line-height: 1.6;
        }

        .info-box {
          margin-top: 22px;
          padding: 18px;
          border-radius: 22px;
          background: rgba(34,197,94,.09);
          border: 1px solid rgba(34,197,94,.20);
        }

        .info-box strong {
          color: #86efac;
          display: block;
          margin-bottom: 8px;
        }

        .info-box p {
          font-size: 15px;
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

        input::placeholder {
          color: #64748b;
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
