import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (
    !token &&
    request.nextUrl.pathname !== '/login' &&
    request.nextUrl.pathname !== '/register' &&
    request.nextUrl.pathname !== '/forgot-password'
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (
    token &&
    (request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/register' ||
      request.nextUrl.pathname === '/forgot-password')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
