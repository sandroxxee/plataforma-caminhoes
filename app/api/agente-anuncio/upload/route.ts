import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Login obrigatorio" }, { status: 401 });

  const formData = await req.formData();
  const truckId  = formData.get("truckId") as string | null;
  const files    = formData.getAll("fotos") as File[];

  if (!files.length) return NextResponse.json({ error: "Nenhuma foto enviada" }, { status: 400 });

  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext  = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `trucks/${user.id}/agente-${Date.now()}-${i}.${ext}`;

    const bytes = await file.arrayBuffer();
    const { error: upErr } = await supabase.storage
      .from("truck-images")
      .upload(path, bytes, { contentType: file.type || "image/jpeg", upsert: true });

    if (upErr) continue;

    const { data: urlData } = supabase.storage.from("truck-images").getPublicUrl(path);
    if (urlData?.publicUrl) urls.push(urlData.publicUrl);
  }

  // Se tiver truckId, salvar na tabela truck_images
  if (truckId && urls.length > 0) {
    const rows = urls.map((image_url, idx) => ({
      truck_id:  truckId,
      image_url,
      principal: idx === 0,
      ordem:     idx,
    }));
    await (supabase.from("truck_images") as any).insert(rows);
  }

  return NextResponse.json({ urls, count: urls.length });
}
