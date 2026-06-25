import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const beta = request.cookies.get('beta_anuncio')?.value === '1'

  if (pathname.startsWith('/anunciar-preview') && !beta) {
    return NextResponse.redirect(new URL('/anunciar', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/anunciar-preview/:path*'],
}
