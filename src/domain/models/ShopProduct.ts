export interface ShopProduct {
  id: number;
  foundationId: string;
  name: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
}

