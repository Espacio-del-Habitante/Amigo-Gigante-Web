import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import type { AuthSession, UserRole } from "@/domain/types/auth.types";
import { defaultLocale, locales } from "@/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});

// Rutas públicas (acceso sin autenticación)
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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Log SIEMPRE para debug (sin condiciones)
  
  
  // Excluir rutas estáticas y de Next.js
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api") ||
    /\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/.test(pathname)
  ) {
    
    return NextResponse.next();
  }
  
  // Verificar si la ruta tiene un locale válido
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  

  // Si la ruta NO tiene locale, redirigir al locale por defecto
  if (!pathnameHasLocale) {
    const redirectPath = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    const redirectUrl = new URL(redirectPath, request.url);
    
    // Preservar query params
    request.nextUrl.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });
    
    
    return NextResponse.redirect(redirectUrl, 307);
  }
  
  // Si la ruta ya tiene locale, dejar que next-intl maneje todo
  const intlResponse = intlMiddleware(request);
  
  // Si next-intl redirigió, devolver esa respuesta
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  // Obtener el pathname final después de que next-intl lo procese
  const rewriteHeader = intlResponse.headers.get("x-middleware-rewrite");
  const finalPathname = rewriteHeader
    ? new URL(rewriteHeader, request.url).pathname
    : pathname;

  // Normalizar el pathname para verificar rutas públicas
  const normalizedPathname = normalizePathname(finalPathname);
  const isPublic = isPublicPath(normalizedPathname);

  // Si es una ruta pública, devolver la respuesta de next-intl directamente
  if (isPublic) {
    return intlResponse;
  }

  // TODO: Consultar la sesión actual de Supabase mediante un Use Case inyectado.
  const session: AuthSession | null = null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", finalPathname);
    const response = NextResponse.redirect(loginUrl);
    intlResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
    return response;
  }

  // TODO: Validar rol contra ROLE_ROUTE_PATTERNS cuando la sesión incluya el rol real.

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
