import type { IUserProfileRepository } from "@/domain/repositories/IUserProfileRepository";
import type { UserProfile } from "@/domain/models/UserProfile";

export class GetUserProfileUseCase {
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}

  async execute(): Promise<UserProfile> {
    return this.userProfileRepository.getUserProfile();
  }
}
