import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import type { AuthSession, UserRole } from "@/domain/types/auth.types";
import { defaultLocale, locales } from "@/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "never",
});

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

const normalizePathname = (pathname: string): string => {
  const segments = pathname.split("/");
  const possibleLocale = segments[1];

  if (locales.includes(possibleLocale as (typeof locales)[number])) {
    const normalized = `/${segments.slice(2).join("/")}`;
    return normalized === "/" ? "/" : normalized.replace(/\/$/, "");
  }

  return pathname;
};

const isPublicPath = (pathname: string): boolean => {
  const normalizedPathname = normalizePathname(pathname);
  return PUBLIC_PATHS.some(
    (path) => normalizedPathname === path || normalizedPathname.startsWith(`${path}/`),
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const intlResponse = intlMiddleware(request);

  if (isPublicPath(pathname)) {
    return intlResponse;
  }

  // TODO: Consultar la sesión actual de Supabase mediante un Use Case inyectado.
  // Ejemplo: const session = await appContainer.get(GetSessionUseCase).execute(request);
  const session: AuthSession | null = null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    const response = NextResponse.redirect(loginUrl);
    intlResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
    return response;
  }

  // TODO: Validar rol contra ROLE_ROUTE_PATTERNS cuando la sesión incluya el rol real.
  // if (!isRoleAllowed(session, pathname)) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
