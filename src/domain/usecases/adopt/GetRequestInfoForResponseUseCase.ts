import type { UserAdoptionRequestSummary } from "@/domain/models/AdoptionRequest";
import type { IAdoptionRequestRepository } from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";

export interface GetRequestInfoForResponseInput {
  requestId: number;
}

export interface RequestInfoForResponse {
  request: UserAdoptionRequestSummary;
  foundationMessage: {
    message: string;
    foundationName: string;
  } | null;
}

export class GetRequestInfoForResponseUseCase {
  constructor(
    private readonly adoptionRequestRepository: IAdoptionRequestRepository,
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(input: GetRequestInfoForResponseInput): Promise<RequestInfoForResponse> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const accessInfo = await this.adoptionRequestRepository.getRequestAccessInfo({
      requestId: input.requestId,
    });

    if (accessInfo.adopterUserId !== session.user.id) {
      throw new Error("errors.unauthorized");
    }

    const requestsResult = await this.adoptionRequestRepository.getUserRequests({
      adopterUserId: accessInfo.adopterUserId,
    });

    const request = requestsResult.requests.find((item) => item.id === input.requestId);

    if (!request) {
      throw new Error("errors.invalidStatus");
    }

    if (request.status !== "info_requested") {
      throw new Error("errors.invalidStatus");
    }

    const detail = await this.adoptionRequestRepository.getRequestDetail({
      foundationId: accessInfo.foundationId,
      requestId: input.requestId,
    });

    if (detail.status !== "info_requested") {
      throw new Error("errors.invalidStatus");
    }

    return {
      request,
      foundationMessage: detail.infoRequestMessage
        ? {
            message: detail.infoRequestMessage,
            foundationName: request.foundation.name,
          }
        : null,
    };
  }
}
