import Link from "next/link";
import { Header } from "@/components/Header";
import { entrarUsuario } from "./actions";

export default function LoginPage() {
  return (
    <>
      <Header />

      <main className="page auth-page">
        <div className="auth-card glass">
          <span className="badge">Acesso do anunciante</span>

          <h1>Entrar na conta</h1>

          <p className="muted">
            Acesse seu painel para cadastrar caminhões, acompanhar anúncios e ver
            o status de aprovação.
          </p>

          <form action={entrarUsuario} className="form-grid">
            <div className="field">
              <label>E-mail</label>
              <input
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="field">
              <label>Senha</label>
              <input
                name="senha"
                type="password"
                placeholder="Sua senha"
                required
              />
            </div>

            <button className="btn primary" type="submit">
              Entrar
            </button>
          </form>

          <p className="muted" style={{ marginTop: 16 }}>
            Ainda não tem conta? <Link href="/cadastro">Criar conta</Link>
          </p>
        </div>
      </main>
    </>
  );
}