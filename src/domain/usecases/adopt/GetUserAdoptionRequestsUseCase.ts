import type {
  GetUserAdoptionRequestsResult,
  IAdoptionRequestRepository,
} from "@/domain/repositories/IAdoptionRequestRepository";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";

export class GetUserAdoptionRequestsUseCase {
  constructor(
    private readonly adoptionRequestRepository: IAdoptionRequestRepository,
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(): Promise<GetUserAdoptionRequestsResult> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    if (session.user.role !== "external") {
      throw new Error("errors.forbidden");
    }

    return this.adoptionRequestRepository.getUserRequests({
      adopterUserId: session.user.id,
    });
  }
}
