"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function getLoggedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

function tituloAutomatico(marca: string, modelo: string, tracao: string, ano: number) {
  return `${marca} ${modelo} ${tracao} - Ano ${ano}`.replace(/\s+/g, " ").trim();
}

async function enviarFotos(supabase: any, userId: string, truckId: string, formData: FormData) {
  const fotoPrincipal = formData.get("foto_principal") as File | null;
  const fotosExtras = formData.getAll("fotos_extras") as File[];
  const imagensParaEnviar: { file: File; principal: boolean; ordem: number }[] = [];

  if (fotoPrincipal && fotoPrincipal.size > 0) {
    imagensParaEnviar.push({ file: fotoPrincipal, principal: true, ordem: 0 });
  }

  fotosExtras
    .filter((file) => file && file.size > 0)
    .slice(0, 8)
    .forEach((file, index) => {
      imagensParaEnviar.push({ file, principal: false, ordem: index + 1 });
    });

  for (const item of imagensParaEnviar) {
    const extensao = item.file.name.split(".").pop() || "jpg";
    const nomeArquivo = `${userId}/${truckId}/${Date.now()}-${item.ordem}.${extensao}`;

    const { error: uploadError } = await supabase.storage
      .from("truck-images")
      .upload(nomeArquivo, item.file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      console.error("Erro no upload:", uploadError.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage.from("truck-images").getPublicUrl(nomeArquivo);

    await supabase.from("truck_images").insert({
      truck_id: truckId,
      user_id: userId,
      image_url: publicUrlData.publicUrl,
      storage_path: nomeArquivo,
      principal: item.principal,
      ordem: item.ordem,
    });
  }
}

export async function editarAnuncioAction(formData: FormData) {
  const { supabase, user } = await getLoggedUser();
  const id = String(formData.get("id") || "");
  const marca = String(formData.get("marca") || "").trim();
  const modelo = String(formData.get("modelo") || "").trim();
  const ano = Number(formData.get("ano") || 0);
  const preco = Number(formData.get("preco") || 0);
  const cidade = String(formData.get("cidade") || "").trim();
  const estado = String(formData.get("estado") || "SC").trim();
  const carroceria = String(formData.get("carroceria") || "").trim();
  const tracao = String(formData.get("tracao") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const descricao = String(formData.get("descricao") || "").trim();
  const abaixo_fipe = formData.get("abaixo_fipe") === "true";
  const quilometragem = String(formData.get("quilometragem") || "").trim();
  const video_url = String(formData.get("video_url") || "").trim();

  if (!id || !marca || !modelo || !ano || !preco || !whatsapp) {
    throw new Error("Campos obrigatórios faltando");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin";

  const updateData: any = {
    titulo: tituloAutomatico(marca, modelo, tracao, ano),
    marca,
    modelo,
    ano_fabricacao: ano,
    ano_modelo: ano,
    preco,
    cidade,
    estado,
    carroceria,
    tracao,
    descricao,
    whatsapp,
    abaixo_fipe,
    quilometragem,
    video_url: video_url || null,
  };

  if (isAdmin) {
    updateData.status = String(formData.get("status") || "pendente");
  } else {
    updateData.status = "pendente"; // Volta para revisão se editado por user comum
  }

  const query = supabase.from("trucks").update(updateData).eq("id", id);

  if (!isAdmin) {
    query.eq("user_id", user.id);
  }

  const { error } = await query;
  if (error) throw error;

  await enviarFotos(supabase, user.id, id, formData);

  revalidatePath("/painel/anuncios");
  revalidatePath("/admin/pendentes");
  revalidatePath("/admin/anuncios");
  revalidatePath("/caminhoes");
  revalidatePath(`/caminhoes/${id}`);

  return { success: true };
}
