import { useEffect, useMemo, useState } from "react";

import type {
  AuthSession,
  AuthUser,
  UserRole,
} from "@/domain/types/auth.types";
import { GetSessionUseCase } from "@/domain/usecases/auth/GetSessionUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";

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
 * La sesión se obtiene desde la capa de Infrastructure (Supabase) a través de un Use Case inyectado.
 */
export const useAuth = (): UseAuthResult => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const getSessionUseCase = useMemo(
    () => appContainer.get<GetSessionUseCase>(USE_CASE_TYPES.GetSessionUseCase),
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      setLoading(true);
      try {
        const currentSession = await getSessionUseCase.execute();

        if (!isMounted) return;
        setSession(currentSession);
      } catch {
        if (isMounted) {
          setSession(null);
        }
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
  }, [getSessionUseCase]);

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
