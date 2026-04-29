import { NextRequest, NextResponse } from "next/server";
import { decrypt, COOKIE_NAME } from "@/lib/auth";

const PUBLIC_ADMIN_ROUTES = ["/admin/login"];
const AD_MIN_API_PREFIX = "/api/admin";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip non-admin routes
  if (
    !pathname.startsWith("/admin") &&
    !pathname.startsWith(AD_MIN_API_PREFIX)
  ) {
    return NextResponse.next();
  }

  // 2. Allow public admin routes (login)
  // 2. Allow public admin routes (login), but redirect away if already authenticated
  if (
    PUBLIC_ADMIN_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname === "/api/admin/auth/login"
  ) {
    const sessionToken = request.cookies.get(COOKIE_NAME)?.value;
    if (sessionToken) {
      try {
        const payload = await decrypt(sessionToken);
        if (["admin", "superadmin"].includes(payload.role)) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } catch (err) {
        // Invalid/expired token — let them through to login
        console.error("[Middleware] JWT Validation Error:", err);
      }
    }
    return NextResponse.next();
  }

  // 3. Check for auth cookie
  const sessionToken = request.cookies.get(COOKIE_NAME)?.value;

  if (!sessionToken) {
    if (pathname.startsWith(AD_MIN_API_PREFIX)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const payload = await decrypt(sessionToken);

    // 4. Role-based check (only superadmin and admin allowed)
    if (!["admin", "superadmin"].includes(payload.role)) {
      if (pathname.startsWith(AD_MIN_API_PREFIX)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/?error=forbidden", request.url));
    }

    const response = NextResponse.next();
    return response;
  } catch (err) {
    console.error("[Middleware] JWT Validation Error:", err);
    if (pathname.startsWith(AD_MIN_API_PREFIX)) {
      return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
    }
    return NextResponse.redirect(
      new URL("/admin/login?error=invalid_session", request.url),
    );
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
