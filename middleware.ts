import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MARCAS_VALIDAS = new Set(["mercedes-benz","scania","volvo","volkswagen","ford","iveco","daf"]);
const ESTADOS_VALIDOS = new Set(["sc","pr","rs","sp","rj","mg","es","ba","go","ms","mt","df","pe","ce","pa"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /anuncios/estado/sc → /caminhoes/estado/sc
  const estadoAnunciosMatch = pathname.match(/^\/anuncios\/estado\/([a-z]{2})(\/.*)?$/);
  if (estadoAnunciosMatch && ESTADOS_VALIDOS.has(estadoAnunciosMatch[1])) {
    return NextResponse.redirect(new URL(`/caminhoes/estado/${estadoAnunciosMatch[1]}`, request.url), 301);
  }

  // /anuncios/scania → /caminhoes/marca/scania
  const marcaAnunciosMatch = pathname.match(/^\/anuncios\/([a-z-]+)$/);
  if (marcaAnunciosMatch && MARCAS_VALIDAS.has(marcaAnunciosMatch[1])) {
    return NextResponse.redirect(new URL(`/caminhoes/marca/${marcaAnunciosMatch[1]}`, request.url), 301);
  }

  // /caminhoes/scania → /caminhoes/marca/scania (URLs antigas)
  const marcaCaminhaoMatch = pathname.match(/^\/caminhoes\/([a-z-]+)$/);
  if (marcaCaminhaoMatch && MARCAS_VALIDAS.has(marcaCaminhaoMatch[1])) {
    return NextResponse.redirect(new URL(`/caminhoes/marca/${marcaCaminhaoMatch[1]}`, request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/anuncios/estado/:path*", "/anuncios/:slug", "/caminhoes/:slug"],
};
