import type { UserProfile } from "@/domain/models/UserProfile";
import type { IUserProfileRepository } from "@/domain/repositories/IUserProfileRepository";

export class UpdateUserProfileUseCase {
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}

  async execute(profile: UserProfile): Promise<UserProfile> {
    return this.userProfileRepository.updateUserProfile(profile);
  }
}
