// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session_id");

  // Si no hay sesión y NO está en el login, lo mandamos al login
  if (!session && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si ya tiene sesión y trata de entrar al login, lo mandamos al dashboard
  if (session && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// AQUÍ ESTÁ EL MATCHERS QUE PEDISTE
export const config = {
  matcher: [
    /*
     * Protege todas las rutas excepto:
     * - api (rutas de backend)
     * - _next/static (archivos estáticos)
     * - _next/image (imágenes)
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
