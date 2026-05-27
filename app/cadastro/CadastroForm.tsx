"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function limparTelefone(telefone: string) {
  return telefone.replace(/\D/g, "");
}

export function CadastroForm() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    const formData = new FormData(event.currentTarget);

    const nome = String(formData.get("nome") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const telefone = String(formData.get("telefone") || "").trim();
    const senha = String(formData.get("senha") || "");

    if (!nome || nome.length < 3) {
      setErro("Informe seu nome.");
      setCarregando(false);
      return;
    }

    if (!email || !validarEmail(email)) {
      setErro("Informe um e-mail válido.");
      setCarregando(false);
      return;
    }

    const telefoneLimpo = limparTelefone(telefone);

    if (!telefoneLimpo || telefoneLimpo.length < 10) {
      setErro("Informe um telefone ou WhatsApp válido com DDD.");
      setCarregando(false);
      return;
    }

    if (!senha || senha.length < 6) {
      setErro("A senha precisa ter no mínimo 6 caracteres.");
      setCarregando(false);
      return;
    }

    const supabase = createClient();

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          full_name: nome,
          name: nome,
          telefone: telefoneLimpo,
        },
      },
    });

    if (signupError) {
      const msg = signupError.message.toLowerCase();

      if (
        msg.includes("already") ||
        msg.includes("registered") ||
        msg.includes("exists") ||
        msg.includes("user already")
      ) {
        setErro("Este e-mail já está cadastrado. Entre na sua conta.");
      } else {
        setErro(signupError.message);
      }

      setCarregando(false);
      return;
    }

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (loginError) {
      setErro("Conta criada, mas não entrou automaticamente. Entre pela tela de login.");
      setCarregando(false);
      return;
    }

    const userId = loginData.user?.id || signupData.user?.id;

    if (userId) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        email,
        nome,
        telefone: telefoneLimpo,
        role: "anunciante",
      });

      if (profileError) {
        setErro("Conta criada, mas não foi possível preparar o perfil. Tente entrar novamente.");
        setCarregando(false);
        return;
      }
    }

    router.replace("/painel");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card">
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

      <button type="submit" disabled={carregando}>
        {carregando ? "Criando conta..." : "Criar conta"}
      </button>

      <p className="login-text">
        Já tem conta? <Link href="/login">Entrar agora</Link>
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
