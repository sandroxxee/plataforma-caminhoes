"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function cadastrar(formData: FormData) {
  const supabase = await createClient();

  const nome = String(formData.get("nome") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const cidade = String(formData.get("cidade") || "").trim();
  const estado = String(formData.get("estado") || "SC").trim();

  if (!nome || !email || !password) redirect("/cadastro?erro=campos");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome, whatsapp, cidade, estado } },
  });

  if (error || !data.user) redirect("/cadastro?erro=cadastro");

  await supabase.from("profiles").upsert({
    id: data.user.id,
    email,
    nome,
    whatsapp,
    cidade,
    estado,
    role: "anunciante",
  });

  redirect("/painel");
}
