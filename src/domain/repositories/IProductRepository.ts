export interface RecentProduct {
  id: number;
  name: string;
  price: number | null;
  createdAt: string;
}

export interface IProductRepository {
  getRecentProducts(foundationId: string, limit: number): Promise<RecentProduct[]>;
}

