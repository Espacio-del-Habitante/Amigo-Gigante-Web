import type { AdoptCatalogItem } from "@/domain/models/AdoptCatalogItem";
import type { AdoptDetail } from "@/domain/models/AdoptDetail";
import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";

export interface GetAdoptDetailInput {
  id: number | string;
  relatedLimit?: number;
}

export interface GetAdoptDetailResult {
  detail: AdoptDetail;
  relatedAnimals: AdoptCatalogItem[];
}

export class GetAdoptDetailUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(input: GetAdoptDetailInput): Promise<GetAdoptDetailResult> {
    const detail = await this.animalRepository.getAdoptDetail(input.id);
    const relatedAnimals = await this.animalRepository.getRelatedAnimals(
      input.id,
      input.relatedLimit ?? 4,
    );

    return { detail, relatedAnimals };
  }
}
