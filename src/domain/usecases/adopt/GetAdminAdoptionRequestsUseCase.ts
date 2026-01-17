import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type {
  GetAdoptionRequestsFilters,
  GetAdoptionRequestsPagination,
  GetAdoptionRequestsResult,
  IAdoptionRequestRepository,
} from "@/domain/repositories/IAdoptionRequestRepository";

export interface GetAdminAdoptionRequestsInput {
  filters?: GetAdoptionRequestsFilters;
  pagination: GetAdoptionRequestsPagination;
}

export class GetAdminAdoptionRequestsUseCase {
  constructor(
    private readonly adoptionRequestRepository: IAdoptionRequestRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
  ) {}

  async execute(input: GetAdminAdoptionRequestsInput): Promise<GetAdoptionRequestsResult> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);

    return this.adoptionRequestRepository.getAdminRequests({
      foundationId,
      filters: input.filters,
      pagination: input.pagination,
    });
  }
}
