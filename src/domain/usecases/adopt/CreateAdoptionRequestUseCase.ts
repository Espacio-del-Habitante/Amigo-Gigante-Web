import type {
  AdoptionRequest,
  AdoptionRequestDetails,
  AdoptionRequestDocuments,
} from "@/domain/models/AdoptionRequest";
import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";

export interface CreateAdoptionRequestInput {
  animalId: number;
  foundationId: string;
  details: AdoptionRequestDetails;
  documents: AdoptionRequestDocuments;
}

export class CreateAdoptionRequestUseCase {
  constructor(
    private readonly adoptionRequestRepository: IAdoptionRequestRepository,
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(input: CreateAdoptionRequestInput): Promise<AdoptionRequest> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthenticated");
    }

    return this.adoptionRequestRepository.createAdoptionRequest({
      animalId: input.animalId,
      foundationId: input.foundationId,
      adopterUserId: session.user.id,
      details: input.details,
      documents: input.documents,
    });
  }
}
