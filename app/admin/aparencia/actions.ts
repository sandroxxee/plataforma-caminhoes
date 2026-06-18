"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { defaultHomeContent, type HomeContent } from "@/lib/site-content";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");
  return supabase;
}

export async function salvarAparencia(formData: FormData) {
  const supabase = await requireAdmin();
  const content  = { ...defaultHomeContent } as HomeContent;

  (Object.keys(defaultHomeContent) as (keyof HomeContent)[]).forEach((key) => {
    const value = String(formData.get(key) || "").trim();
    if (value) content[key] = value;
  });

  const { error } = await supabase.from("site_content").upsert({
    id: "home",
    content,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(`Não foi possível salvar: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/admin/aparencia");
  redirect("/admin/aparencia?salvo=1");
}
