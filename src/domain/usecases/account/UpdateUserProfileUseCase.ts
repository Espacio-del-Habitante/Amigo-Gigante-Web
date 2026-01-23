import type { UserProfile } from "@/domain/models/UserProfile";
import type { IUserProfileRepository } from "@/domain/repositories/IUserProfileRepository";

export class UpdateUserProfileUseCase {
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}

  async execute(profile: UserProfile & { avatarFile?: File | null }): Promise<UserProfile> {
    const currentProfile = await this.userProfileRepository.getUserProfile();
    const currentAvatarUrl = currentProfile.avatarUrl;
    let resolvedAvatarUrl = profile.avatarUrl;

    if (profile.avatarUrl === null && currentAvatarUrl) {
      await this.userProfileRepository.deleteAvatar(currentAvatarUrl);
      resolvedAvatarUrl = null;
    } else if (profile.avatarFile) {
      if (currentAvatarUrl) {
        await this.userProfileRepository.deleteAvatar(currentAvatarUrl);
      }

      resolvedAvatarUrl = await this.userProfileRepository.uploadAvatar(profile.avatarFile, profile.id);
    }

    const updatedProfile: UserProfile = {
      ...profile,
      avatarUrl: resolvedAvatarUrl ?? null,
    };

    return this.userProfileRepository.updateUserProfile(updatedProfile);
  }
}
