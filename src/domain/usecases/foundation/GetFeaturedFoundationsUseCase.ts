import type { FeaturedFoundation } from "@/domain/models/FeaturedFoundation";
import type { IFoundationRepository } from "@/domain/repositories/IFoundationRepository";

export interface GetFeaturedFoundationsInput {
  limit?: number;
}

export class GetFeaturedFoundationsUseCase {
  constructor(private readonly foundationRepository: IFoundationRepository) {}

  async execute({ limit = 6 }: GetFeaturedFoundationsInput = {}): Promise<FeaturedFoundation[]> {
    return this.foundationRepository.getFeaturedFoundations(limit);
  }
}
