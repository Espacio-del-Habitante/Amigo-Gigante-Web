# Estrategia de autenticación, roles y middleware (HU-013)

Este documento resume la estrategia **base** para proteger rutas en Next.js App Router
utilizando Supabase como proveedor de autenticación. La implementación completa se
hará en HUs posteriores; aquí se deja la estructura y los puntos de extensión.

## Modelado de autenticación

- **Roles soportados**: `admin`, `foundation_user`, `external`.
- **Tipos definidos** (`src/domain/types/auth.types.ts`):
  - `UserRole`: unión de roles.
  - `AuthUser`: `id`, `email`, `role` (derivado de la tabla `profiles`).
  - `AuthSession`: sesión mínima con `accessToken`, `refreshToken`, `expiresAt` y `user`.

## Hook `useAuth`

- Ubicación: `src/presentation/hooks/useAuth.ts`.
- Responsabilidad: exponer `user`, `role`, `session`, `isAuthenticated`, `loading`.
- Estrategia: el hook no toca Supabase directamente; espera recibir la sesión a través
  de un **Use Case** inyectado por IoC (Infrastructure → Domain → Presentation).
- TODO documentado: reemplazar el valor `null` por la sesión real retornada por un
  caso de uso que consulte Supabase.

## Utilidades de roles

- Ubicación: `src/presentation/utils/roleUtils.ts`.
- Funciones: `hasRole`, `hasAnyRole`, `getUserRoleFromSession`.
- Uso: validaciones **soft** en UI y middleware para decidir accesos básicos.

## Middleware en Next.js App Router

- Archivo: `middleware.ts` en la raíz del repositorio.
- Objetivo: interceptar rutas, validar sesión de Supabase y rol, y redirigir
  según corresponda.
- Flujo esperado:
  1. Ignorar rutas públicas (`/login`, `/register`, assets de Next.js).
  2. Obtener la sesión de Supabase.
  3. Si no hay sesión → redirigir a `/login?redirectTo=<ruta>`.
  4. Si hay sesión → validar rol contra rutas protegidas.
  5. Redirigir a rutas seguras según rol (ej.: `foundation_user` a `/dashboard`).
- Estado actual: la función `middleware` contiene TODOs para inyectar la consulta de
  sesión y la validación de rol. El `config.matcher` ya apunta a todas las rutas
  excepto estáticos.

### Ejemplos de rutas públicas y privadas (soft)

- **Públicas** (listadas en `PUBLIC_PATHS`):
  - `/` (home de aterrizaje, accesible con o sin sesión)
  - `/tienda` (mientras no haya compra/checkout, permanece pública)
  - `/login`, `/register`, rutas de assets (`/_next`, `/favicon.ico`, `/public`)
- **Privadas por sesión** (no están en `PUBLIC_PATHS` ni tienen rol específico):
  - `/dashboard` (requiere sesión, cualquier rol)
  - `/profile` (requiere sesión, cualquier rol)
- **Privadas por rol** (patrones en `ROLE_ROUTE_PATTERNS`):
  - `/admin/*` → `admin`
  - `/foundations/*` → `foundation_user`
  - `/external/*` → `external`

Para volver privada una ruta hoy pública, quítala de `PUBLIC_PATHS`. Para exigir
rol, agrega su patrón a `ROLE_ROUTE_PATTERNS`. Esto permite mover rutas entre
modos público/privado sin reescribir lógica.

## Protección por roles (soft)

- Rutas de ejemplo:
  - `/admin/*` → requiere rol `admin`.
  - `/foundations/*` → requiere rol `foundation_user`.
  - `/external/*` → rol `external`.
- Estrategia: mantener la verificación sencilla, basada solo en el campo `role` del
  perfil. No se implementa un sistema de permisos granular en esta HU.

## Próximos pasos (referencia para HUs siguientes)

- Implementar Use Cases para obtener la sesión actual desde Supabase y poblar
  `AuthSession`.
- Conectar `useAuth` y el `middleware` a esos Use Cases vía contenedor IoC.
- Añadir redirecciones específicas por rol en el middleware una vez disponible la
  información real de la sesión.
