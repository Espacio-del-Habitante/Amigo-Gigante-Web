import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import { DeletePublicImageUseCase } from "@/domain/usecases/storage/DeletePublicImageUseCase";

export interface DeleteAnimalInput {
  animalId: number;
}

export class DeleteAnimalUseCase {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
    private readonly deletePublicImageUseCase: DeletePublicImageUseCase,
  ) {}

  async execute(input: DeleteAnimalInput): Promise<void> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);

    const animal = await this.animalRepository.getAnimalById({
      animalId: input.animalId,
      foundationId,
    });
    const photoUrls = animal.photos.map((photo) => photo.url).filter(Boolean);

    await Promise.allSettled(photoUrls.map((url) => this.deletePublicImageUseCase.execute({ url })));
    await this.animalRepository.deleteAnimalPhotos({ animalId: input.animalId });

    await this.animalRepository.deleteAnimal({
      animalId: input.animalId,
      foundationId,
    });
  }
}
