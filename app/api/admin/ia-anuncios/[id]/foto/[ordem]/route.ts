import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string; ordem: string }>;
};

function safeFilePart(value: string | null | undefined) {
  return String(value || "anuncio")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80) || "anuncio";
}

function getImageExtension(url: string, contentType: string | null) {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    const fromPath = pathname.match(/\.(jpg|jpeg|png|webp|gif)$/)?.[1];
    if (fromPath) return fromPath === "jpeg" ? "jpg" : fromPath;
  } catch {}

  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("gif")) return "gif";
  return "jpg";
}

export async function GET(_request: Request, context: RouteContext) {
  const { id, ordem } = await context.params;
  const imageIndex = Math.max(0, Number(ordem || 1) - 1);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Login obrigatorio." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
  }

  const { data: truck, error } = await supabase
    .from("trucks")
    .select(`
      id,
      titulo,
      marca,
      modelo,
      truck_images (
        image_url,
        principal,
        ordem
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error || !truck) {
    return NextResponse.json({ error: "Anuncio nao encontrado." }, { status: 404 });
  }

  const images = [...((truck as any).truck_images || [])]
    .filter((image: any) => image.image_url)
    .sort((a: any, b: any) => {
      if (a.principal && !b.principal) return -1;
      if (!a.principal && b.principal) return 1;
      return (a.ordem || 0) - (b.ordem || 0);
    });

  const image = images[imageIndex];

  if (!image?.image_url) {
    return NextResponse.json({ error: "Foto nao encontrada." }, { status: 404 });
  }

  const response = await fetch(image.image_url, { cache: "no-store" });

  if (!response.ok) {
    return NextResponse.json({ error: "Nao foi possivel baixar a foto." }, { status: 502 });
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const extension = getImageExtension(image.image_url, contentType);
  const title = safeFilePart((truck as any).titulo || `${(truck as any).marca || "anuncio"}-${(truck as any).modelo || "foto"}`);
  const fileName = `${title}-foto-${String(imageIndex + 1).padStart(2, "0")}.${extension}`;
  const bytes = await response.arrayBuffer();

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
