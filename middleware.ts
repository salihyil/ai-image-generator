import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { Paths } from './lib/constants';

export default auth((req) => {
  const user = req.auth?.user;

  // Allow access to reset password pages with tokens
  if (req.nextUrl.pathname.startsWith(Paths.ResetPassword + '/')) {
    return NextResponse.next();
  }

  if (
    !user &&
    req.nextUrl.pathname !== Paths.Login &&
    req.nextUrl.pathname !== Paths.Register &&
    req.nextUrl.pathname !== Paths.ResetPassword
  ) {
    return NextResponse.redirect(new URL(Paths.Login, req.url));
  }

  if (
    user &&
    (req.nextUrl.pathname === Paths.Login ||
      req.nextUrl.pathname === Paths.Register ||
      req.nextUrl.pathname === Paths.ResetPassword)
  ) {
    return NextResponse.redirect(new URL(Paths.Home, req.url));
  }
  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
