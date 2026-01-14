import type { ShopProduct } from "@/domain/models/ShopProduct";
import type {
  GetShopProductsParams,
  IProductRepository,
  RecentProduct,
  ShopProductsPage,
} from "@/domain/repositories/IProductRepository";
import { supabaseClient } from "@/infrastructure/config/supabase";

interface ProductRow {
  id: number;
  name: string | null;
  price: number | string | null;
  created_at: string;
}

interface ShopProductRow {
  id: number;
  foundation_id: string;
  name: string | null;
  description: string | null;
  price: number | string | null;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
}

export class ProductRepository implements IProductRepository {
  async getRecentProducts(foundationId: string, limit: number): Promise<RecentProduct[]> {
    const { data, error } = await supabaseClient
      .from("products")
      .select("id, name, price, created_at")
      .eq("foundation_id", foundationId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<ProductRow[]>();

    if (error) {
      throw new Error(this.translateProductsError(error));
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      name: row.name ?? "",
      price: this.normalizePrice(row.price),
      createdAt: row.created_at,
    }));
  }

  async getShopProducts(params: GetShopProductsParams): Promise<ShopProductsPage> {
    const { foundationId, query, page, pageSize } = params;
    const from = Math.max(0, (page - 1) * pageSize);
    const to = Math.max(from, from + pageSize - 1);

    let request = supabaseClient
      .from("products")
      .select("id, foundation_id, name, description, price, image_url, is_published, created_at", { count: "exact" })
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(from, to)
      .returns<ShopProductRow[]>();

    if (foundationId) {
      request = request.eq("foundation_id", foundationId);
    }

    if (query?.trim()) {
      const normalizedQuery = query.trim();
      request = request.or(`name.ilike.%${normalizedQuery}%,description.ilike.%${normalizedQuery}%`);
    }

    const { data, error, count } = await request;

    if (error) {
      throw new Error(this.translateProductsError(error));
    }

    const items: ShopProduct[] = (data ?? []).map((row) => ({
      id: row.id,
      foundationId: row.foundation_id,
      name: row.name ?? "",
      description: row.description ?? null,
      price: this.normalizePrice(row.price),
      imageUrl: row.image_url ?? null,
      isPublished: row.is_published,
      createdAt: row.created_at,
    }));

    return {
      items,
      total: count ?? 0,
    };
  }

  private normalizePrice(price: ProductRow["price"]): number | null {
    if (price === null || price === undefined) return null;
    if (typeof price === "number") return Number.isFinite(price) ? price : null;
    const parsed = Number.parseFloat(price);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private translateProductsError(error: { message?: string }): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("permission") || message.includes("row level")) {
      return "errors.unauthorized";
    }

    if (message.includes("connection") || message.includes("network")) {
      return "errors.connection";
    }

    return "errors.generic";
  }
}

