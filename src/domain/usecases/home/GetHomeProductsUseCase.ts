import type { ShopProduct } from "@/domain/models/ShopProduct";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";

export interface GetHomeProductsInput {
  limit?: number;
}

export class GetHomeProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute({ limit = 3 }: GetHomeProductsInput = {}): Promise<ShopProduct[]> {
    const result = await this.productRepository.getShopProducts({ page: 1, pageSize: limit });
    return result.items;
  }
}
