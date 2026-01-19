import type { NextRequest, NextResponse } from "next/server";

import type {
  CreateProfileParams,
  IAuthRepository,
  SignInParams,
  SignInResult,
  SignUpParams,
  SignUpResult,
} from "@/domain/repositories/IAuthRepository";
import type { AuthSession, UserRole } from "@/domain/types/auth.types";
import { createSupabaseMiddlewareClient } from "@/infrastructure/config/supabaseSSR";

const normalizeRole = (role: string): UserRole | null => {
  if (role === "admin" || role === "foundation_user" || role === "external") {
    return role;
  }
  return null;
};

/**
 * Middleware-scoped Auth repository.
 * Reads session from cookies via @supabase/ssr server client.
 */
export class AuthMiddlewareRepository implements IAuthRepository {
  constructor(
    private readonly request: NextRequest,
    private readonly response: NextResponse,
  ) {}

  async getSession(): Promise<AuthSession | null> {
    const supabase = createSupabaseMiddlewareClient(this.request, this.response);
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) return null;

    // WARNING (Supabase): session.user can come from storage (cookies) and may not be authentic.
    // Validate via auth server and use getUser() data for user identity.
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    const role = profile?.role ? normalizeRole(profile.role) : null;
    return {
      accessToken: data.session.access_token ?? null,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: userData.user.id,
        email: userData.user.email ?? "",
        role: role ?? "foundation_user",
      },
    };
  }

  // Not used in middleware; kept to satisfy the interface.
  async signUp(_: SignUpParams): Promise<SignUpResult> {
    throw new Error("AuthMiddlewareRepository.signUp is not supported in middleware.");
  }

  async signIn(_: SignInParams): Promise<SignInResult> {
    throw new Error("AuthMiddlewareRepository.signIn is not supported in middleware.");
  }

  async createProfile(_: CreateProfileParams): Promise<void> {
    throw new Error("AuthMiddlewareRepository.createProfile is not supported in middleware.");
  }

  async signOut(): Promise<void> {
    throw new Error("AuthMiddlewareRepository.signOut is not supported in middleware.");
  }
}

