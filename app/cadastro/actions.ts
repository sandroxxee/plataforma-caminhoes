"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function cadastrarUsuario(formData: FormData) {
  const supabase = await createClient();

  const nome = String(formData.get("nome") || "");
  const whatsapp = String(formData.get("whatsapp") || "");
  const email = String(formData.get("email") || "");
  const senha = String(formData.get("senha") || "");
  const tipoConta = String(formData.get("tipo_conta") || "particular");
  const cidade = String(formData.get("cidade") || "");
  const estado = String(formData.get("estado") || "");

  if (!nome || !whatsapp || !email || !senha) {
    redirect("/cadastro?erro=preencha-os-campos");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: {
        nome,
        whatsapp,
        tipo_conta: tipoConta,
        cidade,
        estado,
      },
    },
  });

  if (error) {
    redirect(`/cadastro?erro=${encodeURIComponent(error.message)}`);
  }

  redirect("/painel");
}