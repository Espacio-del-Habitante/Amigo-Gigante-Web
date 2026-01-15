import type { ShopProduct } from "@/domain/models/ShopProduct";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";

export interface GetRelatedProductsInput {
  productId: number | string;
  foundationId: string;
  limit?: number;
}

export class GetRelatedProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: GetRelatedProductsInput): Promise<ShopProduct[]> {
    return this.productRepository.getRelatedProducts({
      productId: input.productId,
      foundationId: input.foundationId,
      limit: input.limit,
    });
  }
}
