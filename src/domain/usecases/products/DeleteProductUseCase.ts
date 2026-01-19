import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";
import { DeletePublicImageUseCase } from "@/domain/usecases/storage/DeletePublicImageUseCase";

export interface DeleteProductInput {
  productId: number;
}

export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
    private readonly deletePublicImageUseCase: DeletePublicImageUseCase,
  ) {}

  async execute(input: DeleteProductInput): Promise<void> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);
    const product = await this.productRepository.getProductById({
      productId: input.productId,
      foundationId,
    });

    if (product.imageUrl) {
      await this.deletePublicImageUseCase.execute({ url: product.imageUrl }).catch((error) => {
        console.error("Error deleting product image from storage:", error);
      });
    }

    await this.productRepository.deleteProduct({
      foundationId,
      productId: input.productId,
    });
  }
}
