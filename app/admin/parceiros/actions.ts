"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Função para garantir que quem chama é admin
async function requireAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Acesso negado. Apenas administradores podem cadastrar parceiros.");
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
    
    const logoFile = formData.get("logo") as File | null;
    const bannerFile = formData.get("banner") as File | null;

    if (!nome || !cidade || !estado || !celular || !slug) {
      throw new Error("Preencha todos os campos obrigatórios.");
    }

    // Criar o cliente com privilégios de service_role (bypassa RLS)
    const supabaseAdmin = createPublicClient();

    let logo_url: string | null = null;
    let banner_url: string | null = null;

    if (logoFile && logoFile.size > 0) {
      const ext = logoFile.name.split(".").pop() || "png";
      const logoBuffer = Buffer.from(await logoFile.arrayBuffer());
      const logoPath = `parceiros/logos/${slug}.${ext}`;
      
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
      const bannerPath = `parceiros/banners/${slug}.${ext}`;
      
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
