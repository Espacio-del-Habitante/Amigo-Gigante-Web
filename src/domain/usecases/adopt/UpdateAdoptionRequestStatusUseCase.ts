import type { AdoptionRequestStatus } from "@/domain/models/AdoptionRequest";
import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";

export interface UpdateAdoptionRequestStatusInput {
  requestId: number;
  status: AdoptionRequestStatus;
  rejectionReason?: string | null;
}

export class UpdateAdoptionRequestStatusUseCase {
  constructor(
    private readonly adoptionRequestRepository: IAdoptionRequestRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
  ) {}

  async execute(input: UpdateAdoptionRequestStatusInput): Promise<void> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);

    await this.adoptionRequestRepository.updateStatus({
      foundationId,
      requestId: input.requestId,
      status: input.status,
      rejectionReason: input.rejectionReason ?? null,
    });
  }
}
