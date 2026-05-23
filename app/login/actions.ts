"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function entrarUsuario(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") || "");
  const senha = String(formData.get("senha") || "");

  if (!email || !senha) {
    redirect("/login?erro=campos");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    redirect("/login?erro=login");
  }

  redirect("/painel");
}