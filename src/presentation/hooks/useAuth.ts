import { useEffect, useMemo, useState } from "react";

import type {
  AuthSession,
  AuthUser,
  UserRole,
} from "@/domain/types/auth.types";

interface UseAuthResult {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  loading: boolean;
}

/**
 * Hook base para exponer el estado de autenticación y rol.
 *
 * La sesión debe obtenerse desde la capa de Infrastructure (Supabase) a través de un Use Case inyectado.
 * Se deja la estructura preparada con TODOs para conectar con Supabase en futuras HUs.
 */
export const useAuth = (): UseAuthResult => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      setLoading(true);
      try {
        // TODO: inyectar un Use Case de infraestructura que consulte la sesión activa de Supabase.
        // Ejemplo esperado: const currentSession = await appContainer.get(GetSessionUseCase).execute();
        const currentSession: AuthSession | null = null;

        if (!isMounted) return;
        setSession(currentSession);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const user = useMemo<AuthUser | null>(() => session?.user ?? null, [session]);
  const role = useMemo<UserRole | null>(() => user?.role ?? null, [user]);

  const isAuthenticated = useMemo<boolean>(() => {
    return Boolean(session?.accessToken) && Boolean(user);
  }, [session?.accessToken, user]);

  return {
    user,
    session,
    isAuthenticated,
    role,
    loading,
  };
};
