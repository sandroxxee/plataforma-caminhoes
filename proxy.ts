import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/painel", "/conta", "/anunciar", "/admin"];
const AUTH_ROUTES = ["/login", "/cadastro"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Le o cookie de sessao do Supabase
  const cookieHeader = request.headers.get("cookie") || "";
  const hasSession =
    cookieHeader.includes("sb-") ||
    cookieHeader.includes("supabase-auth-token");

  // Redireciona usuario nao logado para /login
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (!hasSession && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redireciona usuario ja logado para /painel
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/painel", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
