"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function erroLogin(mensagem: string) {
  redirect(`/login?erro=${encodeURIComponent(mensagem)}`);
}

export async function entrar(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const senha = String(formData.get("senha") || "");

  if (!email || !senha) {
    erroLogin("Informe e-mail e senha.");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    erroLogin("E-mail ou senha inválidos.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    erroLogin("Não foi possível manter a sessão. Tente novamente.");
  }

  const userId = user!.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profile?.role === "admin") {
    redirect("/admin/pendentes");
  }

  redirect("/painel");
}

export const login = entrar;
export const entrarUsuario = entrar;
