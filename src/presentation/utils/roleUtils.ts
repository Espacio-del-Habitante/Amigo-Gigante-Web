import type { AuthSession, AuthUser, UserRole } from "@/domain/types/auth.types";

export const hasRole = (user: AuthUser | null, role: UserRole): boolean => {
  if (!user) return false;
  return user.role === role;
};

export const hasAnyRole = (user: AuthUser | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.some((role) => role === user.role);
};

export const getUserRoleFromSession = (
  session: AuthSession | null,
): UserRole | null => {
  if (!session?.user) return null;
  return session.user.role;
};
