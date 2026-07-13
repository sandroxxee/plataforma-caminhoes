import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/painel";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;
      const email = user.email || "";
      const metadata = user.user_metadata || {};
      const nome = metadata.full_name || metadata.name || "Usuário Social";
      const telefone = metadata.telefone || "";

      // Realizar upsert na tabela profiles para garantir a conta local
      const { error: upsertError } = await supabase.from("profiles").upsert({
        id: user.id,
        email,
        nome,
        telefone,
        role: "anunciante",
      });

      if (upsertError) {
        console.error("Erro ao sincronizar perfil OAuth:", upsertError.message);
      }

      const forwardTo = new URL(next, origin);
      return NextResponse.redirect(forwardTo);
    } else if (error) {
      console.error("Erro na autenticação OAuth do Supabase:", error.message);
    }
  }

  // Se falhar, redireciona de volta para a tela de login
  const errorUrl = new URL("/login", origin);
  errorUrl.searchParams.set("erro", "Não foi possível autenticar com a rede social. Tente novamente.");
  return NextResponse.redirect(errorUrl);
}
