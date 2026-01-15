import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type {
  GetProductsFilters,
  GetProductsPagination,
  GetProductsResult,
  IProductRepository,
} from "@/domain/repositories/IProductRepository";

export interface GetProductsInput {
  filters?: GetProductsFilters;
  pagination: GetProductsPagination;
}

export class GetProductsUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
  ) {}

  async execute(input: GetProductsInput): Promise<GetProductsResult> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);

    return this.productRepository.getProducts({
      foundationId,
      filters: input.filters,
      pagination: input.pagination,
    });
  }
}
