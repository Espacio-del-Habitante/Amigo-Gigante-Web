import type { AnimalManagement, AnimalManagementSize } from "@/domain/models/AnimalManagement";
import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import { UploadPublicImageUseCase } from "@/domain/usecases/storage/UploadPublicImageUseCase";

export type UpdateAnimalAgeUnit = "years" | "months";
export type UpdateAnimalSize = AnimalManagementSize | "giant";

export interface UpdateAnimalInput {
  animalId: number;
  name: string;
  species: AnimalManagement["species"];
  breed?: string | null;
  sex: AnimalManagement["sex"];
  age: number;
  ageUnit: UpdateAnimalAgeUnit;
  size: UpdateAnimalSize;
  status: AnimalManagement["status"];
  description: string;
  photos: Array<string | File>;
  isPublished: boolean;
}

export class UpdateAnimalUseCase {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
    private readonly uploadPublicImageUseCase: UploadPublicImageUseCase,
  ) {}

  async execute(input: UpdateAnimalInput): Promise<void> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);
    const ageMonths = this.toAgeMonths(input.age, input.ageUnit);
    const resolvedPhotoUrls = await this.resolvePhotoUrls({
      photos: input.photos,
      foundationId,
      animalId: String(input.animalId),
    });
    const coverImageUrl = resolvedPhotoUrls[0] ?? null;

    await this.animalRepository.updateAnimal({
      animalId: input.animalId,
      foundationId,
      name: input.name,
      species: input.species,
      breed: input.breed ?? null,
      sex: input.sex,
      ageMonths,
      size: this.toDbSize(input.size),
      status: input.status,
      description: input.description,
      coverImageUrl,
      isPublished: input.isPublished,
    });

    await this.animalRepository.replaceAnimalPhotos({
      animalId: input.animalId,
      photoUrls: resolvedPhotoUrls,
    });
  }

  private toAgeMonths(age: number, unit: UpdateAnimalAgeUnit): number {
    if (!Number.isFinite(age)) return 0;
    const safe = Math.max(0, Math.floor(age));
    return unit === "years" ? safe * 12 : safe;
  }

  private toDbSize(size: UpdateAnimalSize): AnimalManagementSize {
    if (size === "giant") return "large";
    return size;
  }

  private async resolvePhotoUrls({
    photos,
    foundationId,
    animalId,
  }: {
    photos: Array<string | File>;
    foundationId: string;
    animalId: string;
  }): Promise<string[]> {
    const normalized = photos.filter((photo) => (typeof photo === "string" ? photo.trim() : true));
    const uploads = normalized.map(async (photo) => {
      if (typeof photo === "string") return photo;
      return this.uploadPublicImageUseCase.execute({
        file: photo,
        type: "animal",
        foundationId,
        entityId: animalId,
      });
    });

    return Promise.all(uploads);
  }
}
