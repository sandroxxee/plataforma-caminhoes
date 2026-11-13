import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const adminSupabase = createServiceClient();
  const { data, error } = await adminSupabase
    .from("trucks")
    .select("id, titulo, marca, modelo, ano_modelo, ano_fabricacao, created_at, truck_images(image_url, principal, ordem)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const anuncios = (data || []).map((truck: any) => ({
    id: truck.id,
    titulo: truck.titulo || "",
    marca: truck.marca || "",
    modelo: truck.modelo || "",
    ano: truck.ano_modelo || truck.ano_fabricacao || 0,
    fotos: (truck.truck_images || [])
      .sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0))
      .map((image: any) => image.image_url)
      .filter(Boolean),
  }));

  return NextResponse.json({ anuncios });
}
