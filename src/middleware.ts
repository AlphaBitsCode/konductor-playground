import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "pocketbase";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostHeader = request.headers.get("host")?.toLowerCase() ?? "";
  const hostname = hostHeader.split(":")[0];

  // 1) Redirect www.konductor.ai → konductor.ai (preserve path and query)
  if (hostname === "www.konductor.ai") {
    const redirectUrl = new URL(url);
    redirectUrl.hostname = "konductor.ai";
    return NextResponse.redirect(redirectUrl, 301);
  }

  // 2) Existing auth logic (adjusted)
  const protectedPaths = ["/dashboard"];
  const isProtectedPath = protectedPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  // IMPORTANT: Do not include "/" in authPaths to avoid redirecting the marketing homepage
  const authPaths = ["/login", "/register"];
  const isAuthPath = authPaths.includes(url.pathname);

  const authCookie = request.cookies.get("pb_auth");
  let token: string | null = null;
  try {
    token = authCookie?.value ? JSON.parse(authCookie.value).token : null;
  } catch {
    token = null;
  }
  const isAuthenticated = token && !isTokenExpired(token);

  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedPath && !isAuthenticated) {
    // Keep original behavior: send unauthenticated users to the root (marketing page) instead of /login
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Skip static assets for performance
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|logos/).*)",
  ],
};
