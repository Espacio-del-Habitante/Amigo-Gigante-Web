import type { AnimalDetail } from "@/domain/models/AnimalDetail";
import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";

export interface GetAnimalByIdInput {
  animalId: number;
}

export class GetAnimalByIdUseCase {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
  ) {}

  async execute(input: GetAnimalByIdInput): Promise<AnimalDetail> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);

    return this.animalRepository.getAnimalById({
      animalId: input.animalId,
      foundationId,
    });
  }
}
