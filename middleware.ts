import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Redireciona URLs antigas de /anuncios/estado/* para /caminhoes/estado/*
// e /anuncios/[marca] (apenas marcas conhecidas) para /caminhoes/[marca]
const MARCAS_VALIDAS = new Set(["mercedes-benz","scania","volvo","volkswagen","ford","iveco","daf"]);
const ESTADOS_VALIDOS = new Set(["sc","pr","rs","sp","rj","mg","es","ba","go","ms","mt","df","pe","ce","pa"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /anuncios/estado/sc → /caminhoes/estado/sc
  const estadoMatch = pathname.match(/^\/anuncios\/estado\/([a-z]{2})(\/.*)?$/);
  if (estadoMatch) {
    const uf = estadoMatch[1];
    if (ESTADOS_VALIDOS.has(uf)) {
      return NextResponse.redirect(new URL(`/caminhoes/estado/${uf}${estadoMatch[2] || ""}`, request.url), 301);
    }
  }

  // /anuncios/scania → /caminhoes/scania (só se for marca conhecida, não UUID/slug de anúncio)
  const marcaMatch = pathname.match(/^\/anuncios\/([a-z-]+)$/);
  if (marcaMatch) {
    const slug = marcaMatch[1];
    if (MARCAS_VALIDAS.has(slug)) {
      return NextResponse.redirect(new URL(`/caminhoes/${slug}`, request.url), 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/anuncios/estado/:path*", "/anuncios/:slug"],
};
