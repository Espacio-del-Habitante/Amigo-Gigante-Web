import type { IUserProfileRepository } from "@/domain/repositories/IUserProfileRepository";

export class ChangePasswordUseCase {
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}

  async execute(params: { currentPassword: string; newPassword: string }): Promise<void> {
    await this.userProfileRepository.changePassword(params);
  }
}
