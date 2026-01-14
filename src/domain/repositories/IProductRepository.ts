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

export interface IProductRepository {
  getRecentProducts(foundationId: string, limit: number): Promise<RecentProduct[]>;
  getShopProducts(params: GetShopProductsParams): Promise<ShopProductsPage>;
}

