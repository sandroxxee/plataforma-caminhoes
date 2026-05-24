"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function limparTelefone(telefone: string) {
  return telefone.replace(/\D/g, "");
}

export async function criarConta(formData: FormData) {
  const nome = String(formData.get("nome") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const telefone = String(formData.get("telefone") || "").trim();
  const senha = String(formData.get("senha") || "");

  if (!nome || nome.length < 3) {
    redirect("/cadastro?erro=Informe seu nome.");
  }

  if (!email || !validarEmail(email)) {
    redirect("/cadastro?erro=Informe um e-mail válido.");
  }

  const telefoneLimpo = limparTelefone(telefone);

  if (!telefoneLimpo || telefoneLimpo.length < 10) {
    redirect("/cadastro?erro=Informe um telefone ou WhatsApp válido com DDD.");
  }

  if (!senha || senha.length < 6) {
    redirect("/cadastro?erro=A senha precisa ter no mínimo 6 caracteres.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
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

  if (error) {
    const msg = error.message.toLowerCase();

    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists") || msg.includes("user already")) {
      redirect("/cadastro?erro=Este e-mail já está cadastrado. Entre na sua conta.");
    }

    redirect(`/cadastro?erro=${encodeURIComponent(error.message)}`);
  }

  const userId = data.user?.id;

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
