import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { AuthSession } from "@/domain/types/auth.types";

export class GetSessionUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<AuthSession | null> {
    return this.authRepository.getSession();
  }
}
