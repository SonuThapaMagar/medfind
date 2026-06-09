import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // getToken reads and verifies the JWT cookie from the request.
  // Returns null if the user is not logged in.
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // --- Rule 1: Dashboard is for pharmacy owners and admins only ---
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token.role !== "PHARMACY_OWNER" && token.role !== "ADMIN") {
      // Logged in but wrong role → redirect home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // --- Rule 2: Admin routes are for admins only ---
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // --- Rule 3: If already logged in, don't show login page ---
  if (pathname === "/login" && token) {
    if (token.role === "PHARMACY" || token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // All other requests: let them through
  return NextResponse.next();
}

// "matcher" tells Next.js which routes this middleware runs on.
// Without this, it would run on EVERY request including images,
// CSS files, etc. — which is slow and unnecessary.
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
