import type { AnimalManagement, AnimalManagementSize } from "@/domain/models/AnimalManagement";
import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";

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
  photoUrls: string[];
  isPublished: boolean;
}

export class UpdateAnimalUseCase {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
  ) {}

  async execute(input: UpdateAnimalInput): Promise<void> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);
    const ageMonths = this.toAgeMonths(input.age, input.ageUnit);
    const coverImageUrl = input.photoUrls[0] ?? null;

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
      photoUrls: input.photoUrls,
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
}
