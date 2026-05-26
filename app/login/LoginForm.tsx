"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const senha = String(formData.get("senha") || "");

    if (!email || !senha) {
      setErro("Informe e-mail e senha.");
      setCarregando(false);
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro("E-mail ou senha inválidos.");
      setCarregando(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErro("Não foi possível manter a sessão. Tente novamente.");
      setCarregando(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const destino = profile?.role === "admin" ? "/admin/pendentes" : "/painel";

    router.replace(destino);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="form-head">
        <span className="form-icon">🔐</span>
        <div>
          <h2>Entrar no painel</h2>
          <p>Acesse sua conta para gerenciar anúncios.</p>
        </div>
      </div>

      {erro && <div className="error">{erro}</div>}

      <label>
        E-mail
        <input name="email" type="email" placeholder="seuemail@exemplo.com" required autoComplete="email" />
      </label>

      <label>
        Senha
        <input name="senha" type="password" placeholder="Sua senha" required autoComplete="current-password" />
      </label>

      <button type="submit" disabled={carregando}>
        {carregando ? "Entrando..." : "Entrar no painel"}
      </button>

      <p className="login-text">
        Ainda não tem conta? <Link href="/cadastro">Criar cadastro</Link>
      </p>

      <style>{`
        .card {
          padding: 26px;
          border-radius: 28px;
          background:
            radial-gradient(circle at 0 0, rgba(34,197,94,.16), transparent 36%),
            linear-gradient(180deg, rgba(16,23,26,.94), rgba(8,13,15,.94));
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 24px 80px rgba(0,0,0,.28);
        }

        .form-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .form-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: #22c55e;
          color: #052e16;
          box-shadow: 0 14px 34px rgba(34,197,94,.18);
        }

        .card h2 {
          margin: 0 0 4px;
          font-size: 28px;
          letter-spacing: -.035em;
        }

        .form-head p {
          margin: 0;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.4;
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
          min-height: 52px;
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

        button:disabled {
          opacity: .72;
          cursor: not-allowed;
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
          .card {
            padding: 20px;
            border-radius: 22px;
          }
        }
      `}</style>
    </form>
  );
}
