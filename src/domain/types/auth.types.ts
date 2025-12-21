export type UserRole = "admin" | "foundation_user" | "external";

/**
 * Representa al usuario autenticado según la tabla de perfiles.
 * Se mantiene libre de detalles de infraestructura (ej: Supabase client).
 */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Estructura mínima de una sesión de autenticación usada en Presentation.
 * Los tokens concretos se poblarán desde la capa de Infrastructure cuando se conecte Supabase.
 */
export interface AuthSession {
  accessToken: string | null;
  refreshToken?: string | null;
  expiresAt?: number | null;
  user: AuthUser | null;
}
