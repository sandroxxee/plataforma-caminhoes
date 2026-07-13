import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { getHomeContent } from "@/lib/site-content";
import { AparenciaFormClient } from "./AparenciaFormClient";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<{ salvo?: string }> };

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");
  return supabase;
}

export default async function AdminAparenciaPage({ searchParams }: Props) {
  const supabase = await requireAdmin();
  const content  = await getHomeContent(supabase);

  return (
    <AdminLayout
      title="Aparência do site"
      subtitle="Organizado em abas e com pré-visualização em tempo real da capa."
      badge="Conteúdo editável"
      actions={
        <Link 
          href="/" 
          target="_blank" 
          style={{ 
            padding: "12px 20px", 
            borderRadius: 14, 
            background: "#1877f2", 
            color: "#ffffff", 
            textDecoration: "none", 
            fontWeight: 800, 
            fontSize: 14, 
            boxShadow: "0 4px 12px rgba(24,119,242,0.2)" 
          }}
        >
          Ver site público
        </Link>
      }
    >
      <AparenciaFormClient initialContent={content} />
    </AdminLayout>
  );
}
