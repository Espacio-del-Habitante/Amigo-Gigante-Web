import type { ShopProduct } from "@/domain/models/ShopProduct";

export interface RecentProduct {
  id: number;
  name: string;
  price: number | null;
  createdAt: string;
}

export interface GetShopProductsParams {
  query?: string;
  foundationId?: string;
  page: number;
  pageSize: number;
}

export interface ShopProductsPage {
  items: ShopProduct[];
  total: number;
}

export type ProductStatusFilter = "published" | "draft";
export type ProductPriceRangeFilter = "under_10" | "between_10_25" | "over_25";

export interface GetProductsFilters {
  status?: ProductStatusFilter;
  priceRange?: ProductPriceRangeFilter;
  search?: string;
}

export interface GetProductsPagination {
  page: number;
  pageSize: number;
}

export interface GetProductsParams {
  foundationId: string;
  filters?: GetProductsFilters;
  pagination: GetProductsPagination;
}

export interface GetProductsResult {
  products: ShopProduct[];
  total: number;
}

export interface UpdateProductPublishStatusParams {
  foundationId: string;
  productId: number;
  isPublished: boolean;
}

export interface GetProductByIdParams {
  foundationId: string;
  productId: number;
}

export interface UpdateProductParams {
  foundationId: string;
  productId: number;
  name: string;
  description?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  isPublished: boolean;
}

export interface IProductRepository {
  getRecentProducts(foundationId: string, limit: number): Promise<RecentProduct[]>;
  getShopProducts(params: GetShopProductsParams): Promise<ShopProductsPage>;
  getProducts(params: GetProductsParams): Promise<GetProductsResult>;
  getProductById(params: GetProductByIdParams): Promise<ShopProduct>;
  updatePublishStatus(params: UpdateProductPublishStatusParams): Promise<void>;
  updateProduct(params: UpdateProductParams): Promise<void>;
}

