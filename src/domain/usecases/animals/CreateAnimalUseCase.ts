import type { AnimalManagement, AnimalManagementSize } from "@/domain/models/AnimalManagement";
import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import { UploadPublicImageUseCase } from "@/domain/usecases/storage/UploadPublicImageUseCase";

export type AddAnimalAgeUnit = "years" | "months";
export type AddAnimalSize = AnimalManagementSize | "giant";

export interface CreateAnimalInput {
  name: string;
  species: AnimalManagement["species"];
  breed?: string | null;
  sex: AnimalManagement["sex"];
  age: number;
  ageUnit: AddAnimalAgeUnit;
  size: AddAnimalSize;
  status: AnimalManagement["status"];
  description: string;
  photos: Array<string | File>;
  isPublished: boolean;
}

export class CreateAnimalUseCase {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
    private readonly uploadPublicImageUseCase: UploadPublicImageUseCase,
  ) {}

  async execute(input: CreateAnimalInput): Promise<AnimalManagement> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);

    const ageMonths = this.toAgeMonths(input.age, input.ageUnit);
    const dbSize = this.toDbSize(input.size);
    const hasFileUpload = input.photos.some((photo) => typeof photo !== "string");

    const animal = await this.animalRepository.createAnimal({
      foundationId,
      name: input.name,
      species: input.species,
      breed: input.breed ?? null,
      sex: input.sex,
      ageMonths,
      size: dbSize,
      status: input.status,
      description: input.description,
      coverImageUrl: hasFileUpload ? null : input.photos[0] ?? null,
      isPublished: input.isPublished,
    });

    const resolvedPhotoUrls = await this.resolvePhotoUrls({
      photos: input.photos,
      foundationId,
      animalId: String(animal.id),
    });

    const coverImageUrl = resolvedPhotoUrls[0] ?? null;

    if (coverImageUrl && coverImageUrl !== animal.coverImageUrl) {
      await this.animalRepository.updateAnimal({
        animalId: animal.id,
        foundationId,
        name: input.name,
        species: input.species,
        breed: input.breed ?? null,
        sex: input.sex,
        ageMonths,
        size: dbSize,
        status: input.status,
        description: input.description,
        coverImageUrl,
        isPublished: input.isPublished,
      });
    }

    if (resolvedPhotoUrls.length > 0) {
      await this.animalRepository.createAnimalPhotos(
        resolvedPhotoUrls.map((url, index) => ({
          animalId: animal.id,
          url,
          sortOrder: index,
        })),
      );
    }

    return { ...animal, coverImageUrl };
  }

  private toAgeMonths(age: number, unit: AddAnimalAgeUnit): number {
    if (!Number.isFinite(age)) return 0;
    const safe = Math.max(0, Math.floor(age));
    return unit === "years" ? safe * 12 : safe;
  }

  private toDbSize(size: AddAnimalSize): AnimalManagementSize {
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
