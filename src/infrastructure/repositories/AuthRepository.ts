import type { PostgrestError, Session, User } from "@supabase/supabase-js";
import { AuthApiError } from "@supabase/supabase-js";

import type {
  CreateProfileParams,
  IAuthRepository,
  SignInParams,
  SignInResult,
  SignUpParams,
  SignUpResult,
} from "@/domain/repositories/IAuthRepository";
import type { AuthSession, AuthUser, UserRole } from "@/domain/types/auth.types";
import { supabaseClient } from "@/infrastructure/config/supabase";

class AuthRepository implements IAuthRepository {
  async signUp(params: SignUpParams): Promise<SignUpResult> {
    const { email, password } = params;

    try {
      const { data, error } = await supabaseClient.auth.signUp({ email, password });

      if (error) {
        throw new Error(this.translateAuthError(error));
      }

      if (!data.user) {
        throw new Error("No se pudo crear el usuario en Supabase.");
      }

      return {
        user: this.mapUser(data.user),
        session: this.mapSession(data.session),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(this.translateAuthError(error));
      }

      throw new Error("Ocurrió un error desconocido al registrar el usuario.");
    }
  }

  async signIn(params: SignInParams): Promise<SignInResult> {
    const { email, password } = params;

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // En desarrollo, si el error es de email no verificado y la verificación está desactivada,
        // es probable que el usuario fue creado cuando estaba activada.
        // Mostramos un mensaje más claro.
        if (
          process.env.ENV === "development" &&
          (error.message?.toLowerCase().includes("email not confirmed") ||
            error.message?.toLowerCase().includes("not confirmed"))
        ) {
          console.warn(
            "[AuthRepository] Email no verificado. Si desactivaste la verificación en Supabase, " +
              "verifica este usuario manualmente en el dashboard: Authentication → Users → [usuario] → Confirm email",
          );
        }
        throw new Error(this.translateSignInError(error));
      }

      if (!data.user) {
        throw new Error(this.translateSignInError(new Error("Missing user")));
      }

      const role = await this.fetchUserRole(data.user.id);

      return {
        user: this.mapUserWithRole(data.user, role),
        session: this.mapSessionWithRole(data.session, role),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(this.normalizeSignInError(error));
      }

      throw new Error("form.errors.generic");
    }
  }

  async getSession(): Promise<AuthSession | null> {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error || !data.session) {
      return null;
    }

    // WARNING (Supabase): session.user can come from storage and may not be authentic.
    // Validate via auth server and use getUser() data for user identity.
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
      return null;
    }

    const role = await this.fetchUserRole(userData.user.id);

    return {
      accessToken: data.session.access_token ?? null,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: userData.user.id,
        email: userData.user.email ?? "",
        role,
      },
    };
  }

  async createProfile(params: CreateProfileParams): Promise<void> {
    const { userId, role, displayName, phone } = params;

    try {
      const payload: Record<string, string> = {
        id: userId,
        role,
      };

      if (displayName) {
        payload.display_name = displayName;
      }

      if (phone) {
        payload.phone = phone;
      }

      const { error } = await supabaseClient.from("profiles").insert(payload);

      if (error) {
        throw new Error(this.translateProfileError(error));
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(this.translateProfileError(error));
      }

      throw new Error("No se pudo crear el perfil del usuario.");
    }
  }

  async signOut(): Promise<void> {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      throw new Error(this.translateSignOutError(error));
    }
  }

  private mapUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email ?? "",
      role: "foundation_user",
    };
  }

  private mapUserWithRole(user: User, role: UserRole): AuthUser {
    return {
      id: user.id,
      email: user.email ?? "",
      role,
    };
  }

  private mapSession(session: Session | null): AuthSession | null {
    if (!session) return null;

    const user = this.mapUser(session.user);

    return {
      accessToken: session.access_token ?? null,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at,
      user,
    };
  }

  private mapSessionWithRole(session: Session | null, role: UserRole): AuthSession | null {
    if (!session) return null;

    const user = this.mapUserWithRole(session.user, role);

    return {
      accessToken: session.access_token ?? null,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at,
      user,
    };
  }

  private async fetchUserRole(userId: string): Promise<UserRole> {
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !data?.role) {
      throw new Error("form.errors.generic");
    }

    const role = this.normalizeRole(data.role);

    if (!role) {
      throw new Error("form.errors.generic");
    }

    return role;
  }

  private normalizeRole(role: string): UserRole | null {
    if (role === "admin" || role === "foundation_user" || role === "external") {
      return role;
    }

    return null;
  }

  private translateAuthError(error: Error): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (error.message?.startsWith("form.errors.")) {
      return error.message;
    }

    if (error instanceof AuthApiError && error.status === 0) {
      return "form.errors.connectionError";
    }

    if (message.includes("registered") || message.includes("already")) {
      return "form.errors.emailExists";
    }

    if (message.includes("password") && message.includes("8")) {
      return "form.errors.passwordMinLength";
    }

    if (message.includes("rate limit")) {
      return "form.errors.rateLimit";
    }

    return "form.errors.generic";
  }

  private translateSignInError(error: Error): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (error instanceof AuthApiError && error.status === 0) {
      return "form.errors.connectionError";
    }

    if (error instanceof AuthApiError && error.status === 429) {
      return "form.errors.rateLimit";
    }

    if (message.includes("invalid login credentials") || message.includes("invalid credentials")) {
      return "form.errors.invalidCredentials";
    }

    if (message.includes("user not found")) {
      return "form.errors.userNotFound";
    }

    if (message.includes("email not confirmed") || message.includes("not confirmed")) {
      return "form.errors.emailNotVerified";
    }

    if (message.includes("rate limit")) {
      return "form.errors.rateLimit";
    }

    return "form.errors.generic";
  }

  private normalizeSignInError(error: Error): string {
    if (error.message.startsWith("form.errors.")) {
      return error.message;
    }

    return "form.errors.generic";
  }

  private translateProfileError(error: PostgrestError | Error): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("connection")) {
      return "form.errors.connectionError";
    }

    return "form.errors.generic";
  }

  private translateSignOutError(error: AuthApiError | Error): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (error instanceof AuthApiError && error.status === 0) {
      return "form.errors.connectionError";
    }

    if (message.includes("rate limit")) {
      return "form.errors.rateLimit";
    }

    return "form.errors.generic";
  }
}

export { AuthRepository };
