"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
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
      setErro("Não foi possível manter a sessão. Tente entrar novamente.");
      setCarregando(false);
      return;
    }

    let destino = "/painel";

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      destino = "/admin/pendentes";
    }

    /*
      Recarrega a página de destino de verdade.
      Isso força o servidor a ler os cookies recém-gravados pelo Supabase.
    */
    window.location.assign(destino);
  }

  return (
    <form onSubmit={handleSubmit} className="card">
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

      <button type="submit" disabled={carregando}>
        {carregando ? "Entrando..." : "Entrar"}
      </button>

      <p className="login-text">
        Ainda não tem conta? <Link href="/cadastro">Criar cadastro</Link>
      </p>

      <style>{`
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
