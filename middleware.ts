import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import type { AuthSession, UserRole } from "@/domain/types/auth.types";

// Rutas públicas (acceso sin autenticación). Ejemplos:
// - Home de aterrizaje: "/"
// - Tienda (pública mientras no haya compras): "/tienda"
const PUBLIC_PATHS = [
  "/",
  "/tienda",
  "/login",
  "/register",
  "/_next",
  "/favicon.ico",
  "/public",
];

const ROLE_ROUTE_PATTERNS: Record<UserRole, RegExp[]> = {
  admin: [/^\/admin/],
  foundation_user: [/^\/foundations/],
  external: [/^\/external/],
};

const isPublicPath = (pathname: string): boolean => {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // TODO: Consultar la sesión actual de Supabase mediante un Use Case inyectado.
  // Ejemplo: const session = await appContainer.get(GetSessionUseCase).execute(request);
  const session: AuthSession | null = null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // TODO: Validar rol contra ROLE_ROUTE_PATTERNS cuando la sesión incluya el rol real.
  // if (!isRoleAllowed(session, pathname)) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
