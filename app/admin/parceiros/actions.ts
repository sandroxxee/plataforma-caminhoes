"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Função para garantir que quem chama é admin
async function requireAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Acesso negado. Apenas administradores podem gerenciar parceiros.");
}

export async function salvarParceiroAction(formData: FormData) {
  try {
    await requireAdmin();

    const nome = String(formData.get("nome") || "").trim();
    const cidade = String(formData.get("cidade") || "").trim();
    const estado = String(formData.get("estado") || "").trim();
    const celular = String(formData.get("celular") || "").trim();
    const telefone = String(formData.get("telefone") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    const instagram = String(formData.get("instagram") || "").trim();
    const facebook = String(formData.get("facebook") || "").trim();
    
    const logoFile = formData.get("logo") as File | null;
    const bannerFile = formData.get("banner") as File | null;

    if (!nome || !cidade || !estado || !celular || !slug) {
      throw new Error("Preencha todos os campos obrigatórios.");
    }

    // Criar o cliente com privilégios de service_role (bypassa RLS)
    const supabaseAdmin = createPublicClient();

    let logo_url: string | null = null;
    let banner_url: string | null = null;

    // Obter o userId para o caminho do arquivo
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || "admin";

    if (logoFile && logoFile.size > 0) {
      const ext = logoFile.name.split(".").pop() || "png";
      const logoBuffer = Buffer.from(await logoFile.arrayBuffer());
      const logoPath = `${userId}/parceiros/logos/${slug}.${ext}`;
      
      const { error: upErr } = await supabaseAdmin.storage
        .from("truck-images")
        .upload(logoPath, logoBuffer, { contentType: logoFile.type, upsert: true });
      
      if (upErr) throw new Error(`Falha no upload do logo: ${upErr.message}`);
      const { data } = supabaseAdmin.storage.from("truck-images").getPublicUrl(logoPath);
      logo_url = data.publicUrl;
    }

    if (bannerFile && bannerFile.size > 0) {
      const ext = bannerFile.name.split(".").pop() || "jpg";
      const bannerBuffer = Buffer.from(await bannerFile.arrayBuffer());
      const bannerPath = `${userId}/parceiros/banners/${slug}.${ext}`;
      
      const { error: upErr } = await supabaseAdmin.storage
        .from("truck-images")
        .upload(bannerPath, bannerBuffer, { contentType: bannerFile.type, upsert: true });
      
      if (upErr) throw new Error(`Falha no upload do banner: ${upErr.message}`);
      const { data } = supabaseAdmin.storage.from("truck-images").getPublicUrl(bannerPath);
      banner_url = data.publicUrl;
    }

    const { error: dbErr } = await (supabaseAdmin.from("parceiros") as any).insert({
      nome,
      slug,
      cidade,
      estado,
      celular,
      telefone: telefone || null,
      logo_url,
      banner_url,
      instagram: instagram || null,
      facebook: facebook || null,
      ativo: true,
    });

    if (dbErr) {
      throw new Error(`Erro ao salvar no banco: ${dbErr.message}`);
    }

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Erro interno ao cadastrar parceiro." };
  }
}

export async function excluirParceiroAction(id: string) {
  try {
    await requireAdmin();

    const supabaseAdmin = createPublicClient();

    // 1. Busca os dados do parceiro para obter as URLs das imagens
    const { data: parceiro, error: fetchErr } = await (supabaseAdmin.from("parceiros") as any)
      .select("logo_url, banner_url")
      .eq("id", id)
      .single();

    if (fetchErr) {
      throw new Error(`Erro ao buscar dados do parceiro para exclusão: ${fetchErr.message}`);
    }

    // 2. Remove as imagens físicas do storage caso existam
    const parseStoragePath = (url: string | null) => {
      if (!url) return null;
      const parts = url.split("/public/truck-images/");
      return parts[1] || null;
    };

    const logoPath = parseStoragePath(parceiro?.logo_url);
    const bannerPath = parseStoragePath(parceiro?.banner_url);

    if (logoPath) {
      await supabaseAdmin.storage.from("truck-images").remove([logoPath]);
    }
    if (bannerPath) {
      await supabaseAdmin.storage.from("truck-images").remove([bannerPath]);
    }

    // 3. Remove o registro do parceiro do banco de dados
    const { error: dbErr } = await (supabaseAdmin.from("parceiros") as any)
      .delete()
      .eq("id", id);

    if (dbErr) {
      throw new Error(`Erro ao deletar do banco de dados: ${dbErr.message}`);
    }

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Erro interno ao deletar parceiro." };
  }
}
