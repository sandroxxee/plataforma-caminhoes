import Link from "next/link";
import { Header } from "@/components/Header";
import { cadastrarUsuario } from "./actions";

type Props = {
  searchParams?: Promise<{
    erro?: string;
  }>;
};

export default async function CadastroPage({ searchParams }: Props) {
  const params = await searchParams;
  const erro = params?.erro;

  return (
    <>
      <Header />

      <main className="page auth-page">
        <div className="auth-card glass">
          <span className="badge">Conta de anunciante</span>

          <h1>Criar conta</h1>

          <p className="muted">
            Crie sua conta para cadastrar caminhões, acompanhar status e enviar
            anúncios para aprovação.
          </p>

          {erro ? (
            <div className="alert error">
              Erro: {decodeURIComponent(erro)}
            </div>
          ) : null}

          <form action={cadastrarUsuario} className="form-grid">
            <div className="field">
              <label>Nome completo</label>
              <input name="nome" placeholder="Seu nome" required />
            </div>

            <div className="field">
              <label>WhatsApp</label>
              <input name="whatsapp" placeholder="Ex: 5549999362681" required />
            </div>

            <div className="field">
              <label>E-mail</label>
              <input name="email" type="email" placeholder="seu@email.com" required />
            </div>

            <div className="field">
              <label>Senha</label>
              <input name="senha" type="password" placeholder="Mínimo 6 caracteres" required />
            </div>

            <div className="field">
              <label>Tipo de conta</label>
              <select name="tipo_conta" defaultValue="particular">
                <option value="particular">Particular</option>
                <option value="vendedor">Vendedor</option>
                <option value="loja">Loja</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>

            <div className="field">
              <label>Cidade</label>
              <input name="cidade" placeholder="Ex: Xanxerê" />
            </div>

            <div className="field">
              <label>Estado</label>
              <select name="estado" defaultValue="SC">
                <option value="SC">SC</option>
                <option value="PR">PR</option>
                <option value="RS">RS</option>
                <option value="SP">SP</option>
                <option value="MG">MG</option>
              </select>
            </div>

            <button className="btn primary" type="submit">
              Criar minha conta
            </button>
          </form>

          <p className="muted" style={{ marginTop: 16 }}>
            Já tem conta? <Link href="/login">Entrar</Link>
          </p>
        </div>
      </main>
    </>
  );
}