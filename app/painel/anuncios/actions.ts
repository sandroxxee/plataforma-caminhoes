"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function tituloAutomatico(marca: string, modelo: string, tracao: string, ano: number) {
  return `${marca} ${modelo} ${tracao} - Ano ${ano}`.replace(/\s+/g, " ").trim();
}

async function getLoggedUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return { supabase, user };
}

async function enviarFotos(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, truckId: string, formData: FormData) {
  const fotoPrincipal = formData.get("foto_principal") as File | null;
  const fotosExtras = formData.getAll("fotos_extras") as File[];

  const imagensParaEnviar: { file: File; principal: boolean; ordem: number }[] = [];

  if (fotoPrincipal && fotoPrincipal.size > 0) {
    imagensParaEnviar.push({ file: fotoPrincipal, principal: true, ordem: 0 });
  }

  fotosExtras
    .filter((file) => file && file.size > 0)
    .slice(0, 8)
    .forEach((file, index) => imagensParaEnviar.push({ file, principal: false, ordem: index + 1 }));

  for (const item of imagensParaEnviar) {
    const extensao = item.file.name.split(".").pop() || "jpg";
    const nomeArquivo = `${userId}/${truckId}/${Date.now()}-${item.ordem}.${extensao}`;

    const { error: uploadError } = await supabase.storage
      .from("truck-images")
      .upload(nomeArquivo, item.file, {
        cacheControl: "3600",
        upsert: false,
      });

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

export async function criarAnuncio(formData: FormData) {
  const { supabase, user } = await getLoggedUser();

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

  if (!marca || !modelo || !ano || !preco || !cidade || !estado || !carroceria || !tracao || !whatsapp) {
    redirect("/painel/anuncios/novo?erro=campos");
  }

  const titulo = tituloAutomatico(marca, modelo, tracao, ano);

  const { data: truck, error } = await supabase
    .from("trucks")
    .insert({
      user_id: user.id,
      titulo,
      marca,
      modelo,
      ano_fabricacao: ano,
      ano_modelo: ano,
      preco,
      cidade,
      estado,
      carroceria,
      tracao,
      quilometragem: "",
      motor: "",
      cambio: "",
      combustivel: "Diesel",
      cor: "",
      descricao,
      whatsapp,
      status: "pendente",
      destaque: false,
      vendido: false,
    })
    .select("id")
    .single();

  if (error || !truck) {
    redirect("/painel/anuncios/novo?erro=banco");
  }

  await enviarFotos(supabase, user.id, truck.id, formData);

  revalidatePath("/painel/anuncios");
  revalidatePath("/admin/pendentes");

  redirect("/painel/anuncios");
}

export async function editarAnuncio(formData: FormData) {
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

  if (!id || !marca || !modelo || !ano || !preco || !cidade || !estado || !carroceria || !tracao || !whatsapp) {
    redirect("/painel/anuncios");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin";

  const query = supabase.from("trucks").update({
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
    status: isAdmin ? String(formData.get("status") || "pendente") : "pendente",
  }).eq("id", id);

  if (!isAdmin) {
    query.eq("user_id", user.id);
  }

  await query;
  await enviarFotos(supabase, user.id, id, formData);

  revalidatePath("/painel/anuncios");
  revalidatePath("/admin/pendentes");
  revalidatePath("/admin/anuncios");
  revalidatePath("/anuncios");
  revalidatePath(`/anuncios/${id}`);

  redirect(isAdmin ? "/admin/anuncios" : "/painel/anuncios");
}

export async function excluirMeuAnuncio(formData: FormData) {
  const { supabase, user } = await getLoggedUser();
  const id = String(formData.get("id") || "");

  if (!id) return;

  const { data: images } = await supabase
    .from("truck_images")
    .select("storage_path")
    .eq("truck_id", id)
    .eq("user_id", user.id);

  const paths = (images || []).map((img) => img.storage_path).filter(Boolean);

  if (paths.length > 0) {
    await supabase.storage.from("truck-images").remove(paths);
  }

  await supabase.from("truck_images").delete().eq("truck_id", id).eq("user_id", user.id);
  await supabase.from("trucks").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/painel/anuncios");
  revalidatePath("/admin/pendentes");
  revalidatePath("/admin/anuncios");
  revalidatePath("/anuncios");
}
