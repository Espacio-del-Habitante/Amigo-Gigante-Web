import type { AuthSession, AuthUser, UserRole } from "@/domain/types/auth.types";

export interface SignUpParams {
  email: string;
  password: string;
}

export interface SignUpResult {
  user: AuthUser;
  session: AuthSession | null;
}

export interface CreateProfileParams {
  userId: string;
  role: UserRole;
  displayName?: string;
  phone?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignInResult {
  user: AuthUser;
  session: AuthSession | null;
}

export interface IAuthRepository {
  signUp(params: SignUpParams): Promise<SignUpResult>;
  signIn(params: SignInParams): Promise<SignInResult>;
  getSession(): Promise<AuthSession | null>;
  createProfile(params: CreateProfileParams): Promise<void>;
}
