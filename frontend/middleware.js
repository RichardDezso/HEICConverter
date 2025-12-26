import { NextResponse } from "next/server";

export function middleware(request) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  if (host.startsWith("www.")) {
    url.host = host.slice(4);
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
