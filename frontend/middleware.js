import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();

  // Prefer the ORIGINAL host from proxy headers
  const xfHost = request.headers.get("x-forwarded-host");
  const origHost = request.headers.get("x-original-host");
  const host = (xfHost || origHost || request.headers.get("host") || "").toLowerCase();

  // Optional debug (remove after)
  const debug = NextResponse.next();
  debug.headers.set("x-mw", "1");
  debug.headers.set("x-seen-host", host);

  // Redirect www -> non-www
  if (host.startsWith("www.heicconverteronline.com")) {
    url.host = "heicconverteronline.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  return debug;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
