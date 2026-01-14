import type { AnimalManagement, AnimalManagementSize } from "@/domain/models/AnimalManagement";
import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";

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
  photoUrls: string[];
  isPublished: boolean;
}

export class CreateAnimalUseCase {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
  ) {}

  async execute(input: CreateAnimalInput): Promise<AnimalManagement> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);

    const ageMonths = this.toAgeMonths(input.age, input.ageUnit);
    const coverImageUrl = input.photoUrls[0] ?? null;

    const animal = await this.animalRepository.createAnimal({
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

    if (input.photoUrls.length > 0) {
      await this.animalRepository.createAnimalPhotos(
        input.photoUrls.map((url, index) => ({
          animalId: animal.id,
          url,
          sortOrder: index,
        })),
      );
    }

    return animal;
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
}

