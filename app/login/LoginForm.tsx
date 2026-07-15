"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SocialLoginButtons } from "@/components/SocialLoginButtons";

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
      setErro("Não foi possível confirmar sua sessão. Tente entrar novamente.");
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
        <div>
          <h2>Entrar</h2>
          <p>Acesse sua conta para gerenciar seus anúncios.</p>
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
        {carregando ? "Entrando..." : "Entrar"}
      </button>

      <SocialLoginButtons />

      <p className="login-text">
        Ainda não tem conta? <Link href="/cadastro">Criar cadastro</Link>
      </p>

      <style>{`
        .card{padding:26px;border-radius:var(--radius);background:var(--surface);border:1px solid var(--line);box-shadow:var(--shadow)}.form-head{display:flex;align-items:center;gap:14px;margin-bottom:20px}.form-icon{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;background:var(--blueSoft);color:var(--blue)}.card h2{margin:0 0 4px;font-size:28px;letter-spacing:-.035em}.form-head p{margin:0;color:var(--muted);font-size:14px;line-height:1.4;font-weight:700}.error{padding:13px 14px;border-radius:14px;color:#991b1b;background:#fee2e2;border:1px solid #fecaca;margin-bottom:14px;font-weight:850}label{display:grid;gap:7px;color:var(--text);font-size:14px;font-weight:850;margin-bottom:13px}input{width:100%;min-height:52px;border-radius:14px;border:1px solid var(--line);background:var(--soft);color:var(--text);padding:0 14px;font-size:15px;outline:none;box-sizing:border-box}input:focus{background:#fff;border-color:var(--blue);box-shadow:0 0 0 4px rgba(24,119,242,.12)}button{width:100%;min-height:54px;border:0;border-radius:14px;background:var(--blue);color:#fff;font-size:16px;font-weight:950;cursor:pointer;margin-top:4px;box-shadow:0 7px 16px rgba(24,119,242,.22)}button:disabled{opacity:.72;cursor:not-allowed}.login-text{margin:16px 0 0;color:var(--muted);text-align:center;font-size:15px;font-weight:700}.login-text a{color:var(--blue);font-weight:950;text-decoration:none}@media(max-width:850px){.card{padding:20px;border-radius:22px}}
      `}</style>
    </form>
  );
}
