import type { ShopProduct } from "@/domain/models/ShopProduct";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IFoundationMembershipRepository } from "@/domain/repositories/IFoundationMembershipRepository";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  imageFile?: File | null;
  isPublished: boolean;
}

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly authRepository: IAuthRepository,
    private readonly foundationMembershipRepository: IFoundationMembershipRepository,
  ) {}

  async execute(input: CreateProductInput): Promise<ShopProduct> {
    const session = await this.authRepository.getSession();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    if (!Number.isFinite(input.price)) {
      throw new Error("errors.generic");
    }

    const foundationId = await this.foundationMembershipRepository.getFoundationIdForUser(session.user.id);

    return this.productRepository.createProduct({
      foundationId,
      name: input.name.trim(),
      description: input.description.trim(),
      price: input.price,
      imageUrl: input.imageUrl?.trim() || null,
      imageFile: input.imageFile ?? null,
      isPublished: input.isPublished,
    });
  }
}
