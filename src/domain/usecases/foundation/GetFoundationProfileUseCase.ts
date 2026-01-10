import type { FoundationProfile } from "@/domain/models/FoundationProfile";
import type { IFoundationProfileRepository } from "@/domain/repositories/IFoundationProfileRepository";

class GetFoundationProfileUseCase {
  constructor(private readonly foundationProfileRepository: IFoundationProfileRepository) {}

  async execute(): Promise<FoundationProfile> {
    return this.foundationProfileRepository.getFoundationProfile();
  }
}

export { GetFoundationProfileUseCase };
