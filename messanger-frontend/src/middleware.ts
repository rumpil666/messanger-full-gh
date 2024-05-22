import { NextRequest, NextResponse } from 'next/server';

import { EnumTokens } from './services/auth-token.service';

export async function middleware(request: NextRequest) {
  const { url, cookies } = request;

  const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)?.value;

  const isAuthPage = url.includes('/signin') || url.includes('/signup');

  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL('/', url))
  }

  if (isAuthPage) {
    return NextResponse.next();
  }

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/signin', url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path', '/profile', '/chat/:path*', '/signin/:path', '/signup/:path']
}
