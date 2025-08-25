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

  // 2) Authentication logic
  const protectedPaths = ["/dashboard", "/office", "/town"];
  const isProtectedPath = protectedPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  // Paths that require authentication but redirect to onboarding if user hasn't completed it
  const onboardingPaths = ["/welcome"];
  const isOnboardingPath = onboardingPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  // Public auth paths (login, email verification) - removed register
  const authPaths = ["/login", "/verify-email"];
  const isAuthPath = authPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  const authCookie = request.cookies.get("pb_auth");
  let token: string | null = null;
  try {
    token = authCookie?.value ? JSON.parse(authCookie.value).token : null;
  } catch {
    token = null;
  }
  const isAuthenticated = token && !isTokenExpired(token);

  // Redirect authenticated users away from auth pages to town
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/town", request.url));
  }

  // Redirect unauthenticated users from protected paths to login
  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Handle onboarding flow - requires authentication but allows incomplete profiles
  if (isOnboardingPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users from root to town
  if (url.pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/town", request.url));
  }

  return NextResponse.next();
}

// Skip static assets for performance
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|logos/).*)",
  ],
};
