import type { ShopFoundation } from "@/domain/models/ShopFoundation";
import type { ShopProduct } from "@/domain/models/ShopProduct";
import type { IFoundationRepository } from "@/domain/repositories/IFoundationRepository";
import type { GetShopProductsParams, IProductRepository } from "@/domain/repositories/IProductRepository";

export interface GetShopCatalogParams extends GetShopProductsParams {}

export interface ShopCatalogSection {
  foundation: ShopFoundation;
  products: ShopProduct[];
}

export interface ShopCatalogResult {
  foundations: ShopFoundation[];
  sections: ShopCatalogSection[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export class GetShopCatalogUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly foundationRepository: IFoundationRepository,
  ) {}

  async execute(params: GetShopCatalogParams): Promise<ShopCatalogResult> {
    const [foundations, productsPage] = await Promise.all([
      this.foundationRepository.getFoundationsList(),
      this.productRepository.getShopProducts(params),
    ]);

    const productsByFoundationId = new Map<string, ShopProduct[]>();

    for (const product of productsPage.items) {
      const list = productsByFoundationId.get(product.foundationId) ?? [];
      list.push(product);
      productsByFoundationId.set(product.foundationId, list);
    }

    const foundationIdsToRender = params.foundationId
      ? [params.foundationId]
      : Array.from(productsByFoundationId.keys());

    const foundationsById = new Map(foundations.map((foundation) => [foundation.id, foundation] as const));

    const sections: ShopCatalogSection[] = foundationIdsToRender
      .map((foundationId) => {
        const foundation = foundationsById.get(foundationId);
        if (!foundation) return null;

        return {
          foundation,
          products: productsByFoundationId.get(foundationId) ?? [],
        };
      })
      .filter((section): section is ShopCatalogSection => Boolean(section));

    const totalPages = Math.max(1, Math.ceil(productsPage.total / params.pageSize));

    return {
      foundations,
      sections,
      page: params.page,
      pageSize: params.pageSize,
      total: productsPage.total,
      totalPages,
    };
  }
}

