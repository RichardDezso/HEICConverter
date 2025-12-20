import { NextResponse } from "next/server";

export function middleware(request) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Canonical: non-www
  if (host.startsWith("www.")) {
    url.host = host.slice(4); // remove "www."
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};

