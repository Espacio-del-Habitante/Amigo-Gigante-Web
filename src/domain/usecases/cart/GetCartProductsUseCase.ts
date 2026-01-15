import type { ShopProduct } from "@/domain/models/ShopProduct";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";

export interface GetCartProductsInput {
  productIds: number[];
}

export interface GetCartProductsResult {
  products: ShopProduct[];
}

export class GetCartProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: GetCartProductsInput): Promise<GetCartProductsResult> {
    if (input.productIds.length === 0) {
      return { products: [] };
    }

    const products = await this.productRepository.getProductsByIds({ productIds: input.productIds });
    return { products };
  }
}
