"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function limparTelefone(telefone: string) {
  return telefone.replace(/\D/g, "");
}

function erroCadastro(mensagem: string) {
  redirect(`/cadastro?erro=${encodeURIComponent(mensagem)}`);
}

export async function criarConta(formData: FormData) {
  const nome = String(formData.get("nome") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const telefone = String(formData.get("telefone") || "").trim();
  const senha = String(formData.get("senha") || "");

  if (!nome || nome.length < 3) {
    erroCadastro("Informe seu nome.");
  }

  if (!email || !validarEmail(email)) {
    erroCadastro("Informe um e-mail válido.");
  }

  const telefoneLimpo = limparTelefone(telefone);

  if (!telefoneLimpo || telefoneLimpo.length < 10) {
    erroCadastro("Informe um telefone ou WhatsApp válido com DDD.");
  }

  if (!senha || senha.length < 6) {
    erroCadastro("A senha precisa ter no mínimo 6 caracteres.");
  }

  const supabase = await createClient();

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
      erroCadastro("Este e-mail já está cadastrado. Entre na sua conta.");
    }

    erroCadastro(signupError.message);
  }

  /*
    Importante:
    Em alguns projetos, depois do signUp o Supabase cria o usuário,
    mas não mantém sessão ativa dependendo da configuração de confirmação de e-mail/cookies.
    Por isso fazemos login com e-mail e senha logo após criar a conta.
    Assim o usuário não cai de volta no /login quando clica em qualquer botão.
  */
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (loginError) {
    erroCadastro("Conta criada, mas não entrou automaticamente. Entre pela tela de login.");
  }

  const userId = loginData.user?.id || signupData.user?.id;

  if (userId) {
    await supabase.from("profiles").upsert({
      id: userId,
      email,
      nome,
      telefone: telefoneLimpo,
      role: "anunciante",
    });
  }

  redirect("/painel");
}
