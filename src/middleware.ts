import { NextResponse, type NextRequest } from "next/server";
import { canAccessPath } from "@/lib/auth";
import type { UserRole } from "@/types";

export function middleware(request: NextRequest) {
  const cookieRole = request.cookies.get("ntd_role")?.value as UserRole | undefined;
  const role = cookieRole ?? (process.env.NODE_ENV === "development" ? "ADMIN" : undefined);
  const { pathname } = request.nextUrl;

  // Dashboard routes are internal/admin surfaces. In production they require an
  // authenticated role cookie/session; the development fallback only keeps local
  // previews convenient before real auth is wired.
  if (!canAccessPath(pathname, role)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
