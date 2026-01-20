import type { FoundationProfile } from "@/domain/models/FoundationProfile";
import type { IFoundationProfileRepository } from "@/domain/repositories/IFoundationProfileRepository";
import { DeletePublicImageUseCase } from "@/domain/usecases/storage/DeletePublicImageUseCase";
import { UploadPublicImageUseCase } from "@/domain/usecases/storage/UploadPublicImageUseCase";

class UpdateFoundationProfileUseCase {
  constructor(
    private readonly foundationProfileRepository: IFoundationProfileRepository,
    private readonly uploadPublicImageUseCase: UploadPublicImageUseCase,
    private readonly deletePublicImageUseCase: DeletePublicImageUseCase,
  ) {}

  async execute(
    profile: FoundationProfile & { logoFile?: File | null },
  ): Promise<FoundationProfile> {
    const currentProfile = await this.foundationProfileRepository.getFoundationProfile();
    const currentLogoUrl = currentProfile.logoUrl;
    let resolvedLogoUrl: string | null = profile.logoUrl;

    if (profile.logoUrl === null && currentLogoUrl) {
      await this.deletePublicImageUseCase.execute({ url: currentLogoUrl });
      resolvedLogoUrl = null;
    } else if (profile.logoFile) {
      if (currentLogoUrl) {
        await this.deletePublicImageUseCase.execute({ url: currentLogoUrl });
      }

      resolvedLogoUrl = await this.uploadPublicImageUseCase.execute({
        file: profile.logoFile,
        type: "foundation",
        foundationId: profile.foundationId,
        entityId: undefined,
      });
    } else {
      resolvedLogoUrl = profile.logoUrl;
    }

    const updatedProfile: FoundationProfile = {
      ...profile,
      logoUrl: resolvedLogoUrl,
    };

    return this.foundationProfileRepository.updateFoundationProfile(updatedProfile);
  }
}

export { UpdateFoundationProfileUseCase };
