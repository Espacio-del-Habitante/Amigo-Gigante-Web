import type { IUserProfileRepository } from "@/domain/repositories/IUserProfileRepository";

export class DeleteUserAccountUseCase {
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}

  async execute(): Promise<void> {
    await this.userProfileRepository.deleteUserAccount();
  }
}
