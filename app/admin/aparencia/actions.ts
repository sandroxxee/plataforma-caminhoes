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

  // 1. Busca o registro atual do banco para extrair o histórico existente
  const { data: currentRecord } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", "home")
    .maybeSingle();

  const currentContent = currentRecord?.content || {};
  let history = Array.isArray(currentContent.history) ? currentContent.history : [];

  // 2. Se já houver conteúdo salvo, empilha a versão anterior no histórico (limite de 5 versões)
  if (Object.keys(currentContent).length > 0) {
    const newHistoryEntry = {
      data: new Date().toLocaleString("pt-BR"),
      content: { ...currentContent, history: undefined }, // Evita aninhamento recursivo de histórico
    };
    history = [newHistoryEntry, ...history].slice(0, 5);
  }

  // 3. Monta o novo conteúdo a partir dos dados do formulário
  const content = { ...defaultHomeContent } as HomeContent;

  (Object.keys(defaultHomeContent) as (keyof HomeContent)[]).forEach((key) => {
    if (key === "history") return;
    const value = String(formData.get(key) || "").trim();
    if (value) {
      content[key] = value as any;
    }
  });

  // Salva o histórico atualizado de volta no JSON
  content.history = history;

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
