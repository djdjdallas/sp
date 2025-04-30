import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the route is a protected route
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute =
    req.nextUrl.pathname === "/auth/login" ||
    req.nextUrl.pathname === "/auth/register" ||
    req.nextUrl.pathname === "/auth/forgot-password" ||
    req.nextUrl.pathname === "/auth/reset-password";

  // If accessing a protected route without being logged in, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If accessing auth routes while logged in, redirect to dashboard
  if (isAuthRoute && session) {
    const redirectUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",

    // Auth routes
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ],
};
