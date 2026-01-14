import type { IAnimalRepository, GetAnimalsFilters, GetAnimalsPagination, GetAnimalsResult } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";

export interface GetAnimalsInput {
  filters?: GetAnimalsFilters;
  pagination: GetAnimalsPagination;
}

export class GetAnimalsUseCase {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
  ) {}

  async execute(input: GetAnimalsInput): Promise<GetAnimalsResult> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);

    return this.animalRepository.getAnimals({
      foundationId,
      filters: input.filters,
      pagination: input.pagination,
    });
  }
}

