import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { AuthSession, AuthUser, UserRole } from "@/domain/types/auth.types";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  user: AuthUser;
  session: AuthSession | null;
  role: UserRole;
}

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const { email, password } = input;

    const { user, session } = await this.authRepository.signIn({
      email,
      password,
    });

    return {
      user,
      session,
      role: user.role,
    };
  }
}
