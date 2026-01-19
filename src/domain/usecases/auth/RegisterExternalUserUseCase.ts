import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { AuthSession, AuthUser } from "@/domain/types/auth.types";

export interface RegisterExternalUserInput {
  email: string;
  password: string;
  displayName?: string;
  phone?: string;
}

export interface RegisterExternalUserResult {
  user: AuthUser;
  session: AuthSession | null;
}

const errorKeyMap: Record<string, string> = {
  "form.errors.emailExists": "external.errors.emailExists",
  "form.errors.passwordMinLength": "external.errors.passwordMinLength",
  "form.errors.connectionError": "external.errors.connectionError",
  "form.errors.rateLimit": "external.errors.rateLimit",
  "form.errors.generic": "external.errors.generic",
};

export class RegisterExternalUserUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: RegisterExternalUserInput): Promise<RegisterExternalUserResult> {
    const { email, password, displayName, phone } = input;

    try {
      const { user, session } = await this.authRepository.signUp({
        email,
        password,
      });

      await this.authRepository.createProfile({
        userId: user.id,
        role: "external",
        displayName,
        phone,
      });

      const normalizedUser: AuthUser = {
        ...user,
        role: "external",
      };

      const normalizedSession: AuthSession | null = session
        ? {
            ...session,
            user: session.user ? { ...session.user, role: "external" } : normalizedUser,
          }
        : null;

      return {
        user: normalizedUser,
        session: normalizedSession,
      };
    } catch (error) {
      throw new Error(this.resolveErrorMessage(error));
    }
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error.message.startsWith("external.errors.")) {
        return error.message;
      }

      if (error.message.startsWith("form.errors.")) {
        return errorKeyMap[error.message] ?? "external.errors.generic";
      }
    }

    return "external.errors.generic";
  }
}
