import type { AdoptionRequestDetail } from "@/domain/models/AdoptionRequest";
import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";

export interface GetAdoptionRequestDetailInput {
  requestId: number;
}

export class GetAdoptionRequestDetailUseCase {
  constructor(
    private readonly adoptionRequestRepository: IAdoptionRequestRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
  ) {}

  async execute(input: GetAdoptionRequestDetailInput): Promise<AdoptionRequestDetail> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);

    return this.adoptionRequestRepository.getRequestDetail({
      foundationId,
      requestId: input.requestId,
    });
  }
}
