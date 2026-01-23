import type { AdoptionRequestDetail } from "@/domain/models/AdoptionRequest";
import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";

export interface RequestAdoptionInfoInput {
  requestId: number;
  subject: string;
  message: string;
}

export class RequestAdoptionInfoUseCase {
  constructor(
    private readonly adoptionRequestRepository: IAdoptionRequestRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
  ) {}

  async execute(input: RequestAdoptionInfoInput): Promise<void> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);

    if (!foundationId) {
      throw new Error("errors.unauthorized");
    }

    const requestDetail = await this.adoptionRequestRepository.getRequestDetail({
      foundationId,
      requestId: input.requestId,
    });

    const accessInfo = await this.adoptionRequestRepository.getRequestAccessInfo({
      requestId: input.requestId,
    });

    if (accessInfo.foundationId !== foundationId) {
      throw new Error("errors.unauthorized");
    }

    const adopterEmail = await this.resolveAdopterEmail(requestDetail, accessInfo.adopterUserId);

    await this.adoptionRequestRepository.enqueueInfoRequestEmail({
      requestId: input.requestId,
      adopterUserId: accessInfo.adopterUserId,
      toEmail: adopterEmail,
      subject: input.subject,
      message: input.message,
      animalName: requestDetail.animal.name,
      animalId: requestDetail.animal.id,
      foundationId,
    });

    await this.adoptionRequestRepository.updateStatus({
      foundationId,
      requestId: input.requestId,
      status: "info_requested",
    });
  }

  private async resolveAdopterEmail(detail: AdoptionRequestDetail, adopterUserId: string): Promise<string> {
    if (detail.adopterProfile.email) {
      return detail.adopterProfile.email;
    }

    const email = await this.adoptionRequestRepository.getAdopterEmailByUserId({ adopterUserId });

    if (!email) {
      throw new Error("errors.adopterEmailNotFound");
    }

    return email;
  }
}
