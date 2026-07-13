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

