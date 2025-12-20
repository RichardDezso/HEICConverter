import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Redirect www to non-www (permanent 308 redirect)
  if (hostname.startsWith('www.')) {
    const newHostname = hostname.replace('www.', '');
    url.host = newHostname;
    url.protocol = 'https';
    
    // 308 Permanent Redirect (preserves HTTP method)
    return NextResponse.redirect(url, 308);
  }
  
  return NextResponse.next();
}

// Run middleware on all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
