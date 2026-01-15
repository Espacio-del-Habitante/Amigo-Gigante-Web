import type { ShopFoundation } from "@/domain/models/ShopFoundation";
import type { ShopProduct } from "@/domain/models/ShopProduct";
import type { IFoundationRepository } from "@/domain/repositories/IFoundationRepository";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";

export interface GetProductDetailInput {
  productId: number | string;
}

export interface GetProductDetailResult {
  product: ShopProduct;
  foundation: ShopFoundation;
}

export class GetProductDetailUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly foundationRepository: IFoundationRepository,
  ) {}

  async execute(input: GetProductDetailInput): Promise<GetProductDetailResult> {
    const product = await this.productRepository.getProductDetail({ productId: input.productId });
    const foundation = await this.foundationRepository.getShopFoundationById(product.foundationId);

    return { product, foundation };
  }
}
