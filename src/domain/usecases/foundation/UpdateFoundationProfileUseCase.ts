import type { FoundationProfile } from "@/domain/models/FoundationProfile";
import type { IFoundationProfileRepository } from "@/domain/repositories/IFoundationProfileRepository";

class UpdateFoundationProfileUseCase {
  constructor(private readonly foundationProfileRepository: IFoundationProfileRepository) {}

  async execute(profile: FoundationProfile): Promise<FoundationProfile> {
    return this.foundationProfileRepository.updateFoundationProfile(profile);
  }
}

export { UpdateFoundationProfileUseCase };
