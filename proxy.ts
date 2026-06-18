import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PROTECTED_ROUTES = ["/painel", "/conta", "/anunciar", "/admin"];
const PUBLIC_EXCEPTIONS = ["/anunciar/chat", "/anunciar-gratis"];
const AUTH_ROUTES = ["/login", "/cadastro"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rotas publicas que comecam com prefixo protegido mas sao liberadas
  const isException = PUBLIC_EXCEPTIONS.some((r) => pathname.startsWith(r));
  if (isException) return NextResponse.next();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const hasSession = !!user;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (!hasSession && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/painel", request.url));
  }

  return NextResponse.next();
}

export const middleware = proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
