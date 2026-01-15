import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";

export interface UpdateProductInput {
  productId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  imageFile?: File | null;
  isPublished: boolean;
}

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
  ) {}

  async execute(input: UpdateProductInput): Promise<void> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    if (!Number.isFinite(input.price)) {
      throw new Error("errors.generic");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);

    await this.productRepository.updateProduct({
      foundationId,
      productId: input.productId,
      name: input.name,
      description: input.description,
      price: input.price,
      imageUrl: input.imageUrl,
      imageFile: input.imageFile ?? null,
      isPublished: input.isPublished,
    });
  }
}
