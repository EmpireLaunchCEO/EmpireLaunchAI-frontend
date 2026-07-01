import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // SEO: Redirect root to /onboarding for new visitors
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Ensure root is never treated as a 404 by the internal matcher
  if (pathname === '' || pathname === '/') {
     return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal files (_next/static, _next/image, favicon, etc.)
    '/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon.png|branded-globe.png|vibrant-globe.png|manifest.json|build_timestamp.txt).*)',
  ],
};