import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const user = req.auth?.user;

  if (
    !user &&
    req.nextUrl.pathname !== '/login' &&
    req.nextUrl.pathname !== '/register' &&
    req.nextUrl.pathname !== '/forgot-password'
  ) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (
    user &&
    (req.nextUrl.pathname === '/login' ||
      req.nextUrl.pathname === '/register' ||
      req.nextUrl.pathname === '/forgot-password')
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
