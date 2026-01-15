import type { AdoptCatalogItem } from "@/domain/models/AdoptCatalogItem";
import type { AdoptDetail } from "@/domain/models/AdoptDetail";
import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";

export interface GetAdoptDetailInput {
  id: number | string;
  relatedLimit?: number;
}

export interface GetAdoptDetailResult {
  detail: AdoptDetail;
  related: AdoptCatalogItem[];
}

export class GetAdoptDetailUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(input: GetAdoptDetailInput): Promise<GetAdoptDetailResult> {
    const [detail, related] = await Promise.all([
      this.animalRepository.getAdoptDetail({ id: input.id }),
      this.animalRepository.getRelatedAnimals({
        id: input.id,
        limit: input.relatedLimit,
      }),
    ]);

    return { detail, related };
  }
}
