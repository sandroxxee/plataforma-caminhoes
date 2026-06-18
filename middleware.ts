import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PROTECTED_ROUTES = ["/painel", "/conta", "/anunciar", "/admin"];
const AUTH_ROUTES = ["/login", "/cadastro"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const hasSession = !!user;

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

  // Atualiza a sessão do Supabase para garantir que os cookies estejam sincronizados
  // Isso é importante para ambientes de produção com balanceadores de carga
  // ou quando os cookies precisam ser atualizados após certas operações.
  const response = NextResponse.next();
  // await supabase.auth.getSession(); // Removido para performance // Força a atualização dos cookies
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
