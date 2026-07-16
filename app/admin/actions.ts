"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/painel");

  return supabase;
}

export async function aprovarAnuncio(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") || "");

  if (!id) return;

  await supabase
    .from("trucks")
    .update({ status: "aprovado", vendido: false })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/pendentes");
  revalidatePath("/admin/anuncios");
  revalidatePath("/anuncios");
  revalidatePath(`/anuncios/${id}`);
}

export async function reprovarAnuncio(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") || "");

  if (!id) return;

  await supabase
    .from("trucks")
    .update({ status: "reprovado" })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/pendentes");
  revalidatePath("/admin/anuncios");
  revalidatePath("/anuncios");
  revalidatePath(`/anuncios/${id}`);
}

export async function excluirAnuncioAdmin(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") || "");

  if (!id) return;

  const { data: images } = await supabase
    .from("truck_images")
    .select("storage_path")
    .eq("truck_id", id);

  const paths = (images || [])
    .map((img) => img.storage_path)
    .filter(Boolean);

  if (paths.length > 0) {
    await supabase.storage.from("truck-images").remove(paths);
  }

  await supabase.from("truck_images").delete().eq("truck_id", id);
  await supabase.from("trucks").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/pendentes");
  revalidatePath("/admin/anuncios");
  revalidatePath("/anuncios");
}

export async function vincularAnunciosParceiroAction(truckIds: string[], whatsapp: string) {
  try {
    const supabase = await requireAdmin();

    if (!truckIds || truckIds.length === 0 || !whatsapp) {
      throw new Error("Parâmetros inválidos.");
    }

    const { error } = await supabase
      .from("trucks")
      .update({ whatsapp })
      .in("id", truckIds);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin/anuncios");
    revalidatePath("/parcerias/parceiros");
    
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Erro ao vincular anúncios." };
  }
}

export async function toggleSeloAction(id: string, campo: "destaque" | "verificado" | "abaixo_fipe", valorAtual: boolean) {
  try {
    const supabase = await requireAdmin();

    if (!id || !campo) {
      throw new Error("Parâmetros inválidos.");
    }

    const { error } = await supabase
      .from("trucks")
      .update({ [campo]: !valorAtual })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/admin/anuncios");
    revalidatePath("/anuncios");
    revalidatePath(`/anuncios/${id}`);

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Erro ao atualizar selo." };
  }
}

export async function getEnvStatusAction() {
  await requireAdmin();
  return {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    NODE_ENV: process.env.NODE_ENV || "development",
    NODE_VERSION: process.version
  };
}

export async function testDatabaseAction() {
  try {
    const start = Date.now();
    const supabase = await requireAdmin();
    
    // Executa uma query simples de contagem ou leitura para verificar conectividade
    const { data: rawData, error: rawError } = await supabase.from("trucks").select("id").limit(1);
    if (rawError) throw rawError;

    const latency = Date.now() - start;
    return { success: true, latency, dbVersion: "PostgreSQL (Supabase Cloud)" };
  } catch (err: any) {
    return { success: false, error: err?.message || "Falha na conexão com o banco de dados." };
  }
}

export async function testGeminiAction() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY não está configurada.");
    }
    const start = Date.now();
    
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Olá! Teste rápido. Responda apenas com a palavra 'OK'.",
    });
    
    const latency = Date.now() - start;
    const answer = response.text?.trim() || "Sem resposta";
    return { success: true, latency, answer };
  } catch (err: any) {
    return { success: false, error: err?.message || "Falha na API do Gemini." };
  }
}

export async function revalidateAllAction() {
  try {
    await requireAdmin();
    revalidatePath("/");
    revalidatePath("/caminhoes");
    revalidatePath("/admin/anuncios");
    revalidatePath("/admin/pendentes");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Erro ao revalidar." };
  }
}



