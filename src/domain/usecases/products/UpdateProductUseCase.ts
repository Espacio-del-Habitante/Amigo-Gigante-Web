import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";
import { DeletePublicImageUseCase } from "@/domain/usecases/storage/DeletePublicImageUseCase";

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
    private readonly deletePublicImageUseCase: DeletePublicImageUseCase,
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
    const currentProduct = await this.productRepository.getProductById({
      productId: input.productId,
      foundationId,
    });
    const currentImageUrl = currentProduct.imageUrl;
    const hasNewFile = input.imageFile !== null && input.imageFile !== undefined;
    const hasNewUrl = input.imageUrl !== null && input.imageUrl.trim() !== "";
    const isDifferentUrl = hasNewUrl && input.imageUrl !== currentImageUrl;
    const isReplacingImage = hasNewFile || isDifferentUrl;

    if (isReplacingImage && currentImageUrl) {
      await this.deletePublicImageUseCase.execute({ url: currentImageUrl }).catch((error) => {
        console.error("Error deleting old product image from storage:", error);
      });
    }

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
