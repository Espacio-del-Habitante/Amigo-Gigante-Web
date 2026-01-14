import type {
  GetAdoptCatalogFilters,
  GetAdoptCatalogPagination,
  GetAdoptCatalogResult,
  IAnimalRepository,
} from "@/domain/repositories/IAnimalRepository";

export interface GetAdoptCatalogInput {
  filters?: GetAdoptCatalogFilters;
  pagination: GetAdoptCatalogPagination;
}

export class GetAdoptCatalogUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(input: GetAdoptCatalogInput): Promise<GetAdoptCatalogResult> {
    return this.animalRepository.getAdoptCatalog({
      filters: input.filters,
      pagination: input.pagination,
    });
  }
}

