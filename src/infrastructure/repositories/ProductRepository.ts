import type { ShopProduct } from "@/domain/models/ShopProduct";
import type {
  GetProductByIdParams,
  GetProductsParams,
  GetProductsResult,
  GetShopProductsParams,
  IProductRepository,
  RecentProduct,
  ShopProductsPage,
  UpdateProductParams,
  UpdateProductPublishStatusParams,
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
      .range(from, to);

    if (foundationId) {
      request = request.eq("foundation_id", foundationId);
    }

    if (query?.trim()) {
      const normalizedQuery = query.trim();
      request = request.or(`name.ilike.%${normalizedQuery}%,description.ilike.%${normalizedQuery}%`);
    }

    const { data, error, count } = await request.returns<ShopProductRow[]>();

    if (error) {
      throw new Error(this.translateProductsError(error));
    }

    const items: ShopProduct[] = (data ?? []).map((row) => this.mapShopProduct(row));

    return {
      items,
      total: count ?? 0,
    };
  }

  async getProducts({ foundationId, filters, pagination }: GetProductsParams): Promise<GetProductsResult> {
    const pageSize = pagination.pageSize;
    const from = Math.max(0, (pagination.page - 1) * pageSize);
    const to = Math.max(from, from + pageSize - 1);

    let request = supabaseClient
      .from("products")
      .select("id, foundation_id, name, description, price, image_url, is_published, created_at", { count: "exact" })
      .eq("foundation_id", foundationId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters?.status === "published") {
      request = request.eq("is_published", true);
    }

    if (filters?.status === "draft") {
      request = request.eq("is_published", false);
    }

    if (filters?.priceRange === "under_10") {
      request = request.lt("price", 10);
    }

    if (filters?.priceRange === "between_10_25") {
      request = request.gte("price", 10).lte("price", 25);
    }

    if (filters?.priceRange === "over_25") {
      request = request.gte("price", 25);
    }

    if (filters?.search?.trim()) {
      const normalizedQuery = filters.search.trim();
      request = request.or(`name.ilike.%${normalizedQuery}%,description.ilike.%${normalizedQuery}%`);
    }

    const { data, error, count } = await request.returns<ShopProductRow[]>();

    if (error) {
      throw new Error(this.translateProductsError(error));
    }

    return {
      products: (data ?? []).map((row) => this.mapShopProduct(row)),
      total: count ?? 0,
    };
  }

  async getProductById({ foundationId, productId }: GetProductByIdParams): Promise<ShopProduct> {
    const { data, error } = await supabaseClient
      .from("products")
      .select("id, foundation_id, name, description, price, image_url, is_published, created_at")
      .eq("id", productId)
      .eq("foundation_id", foundationId)
      .single()
      .returns<ShopProductRow>();

    if (error) {
      throw new Error(this.translateProductsError(error));
    }

    if (!data) {
      throw new Error("errors.notFound");
    }

    return this.mapShopProduct(data);
  }

  async updatePublishStatus({
    foundationId,
    productId,
    isPublished,
  }: UpdateProductPublishStatusParams): Promise<void> {
    const { error } = await supabaseClient
      .from("products")
      .update({ is_published: isPublished })
      .eq("id", productId)
      .eq("foundation_id", foundationId);

    if (error) {
      throw new Error(this.translateProductsError(error));
    }
  }

  async updateProduct({
    foundationId,
    productId,
    name,
    description,
    price,
    imageUrl,
    isPublished,
  }: UpdateProductParams): Promise<void> {
    const { data, error } = await supabaseClient
      .from("products")
      .update({
        name,
        description: description ?? null,
        price: price ?? null,
        image_url: imageUrl ?? null,
        is_published: isPublished,
      })
      .eq("id", productId)
      .eq("foundation_id", foundationId)
      .select("id")
      .single();

    if (error) {
      throw new Error(this.translateProductsError(error));
    }

    if (!data) {
      throw new Error("errors.notFound");
    }
  }

  private normalizePrice(price: ProductRow["price"]): number | null {
    if (price === null || price === undefined) return null;
    if (typeof price === "number") return Number.isFinite(price) ? price : null;
    const parsed = Number.parseFloat(price);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private mapShopProduct(row: ShopProductRow): ShopProduct {
    return {
      id: row.id,
      foundationId: row.foundation_id,
      name: row.name ?? "",
      description: row.description ?? null,
      price: this.normalizePrice(row.price),
      imageUrl: row.image_url ?? null,
      isPublished: row.is_published,
      createdAt: row.created_at,
    };
  }

  private translateProductsError(error: { message?: string; code?: string }): string {
    const message = error.message?.toLowerCase?.() ?? "";
    const code = error.code?.toLowerCase?.() ?? "";

    if (code === "pgrst116" || message.includes("no rows") || message.includes("0 rows") || message.includes("not found")) {
      return "errors.notFound";
    }

    if (message.includes("permission") || message.includes("row level")) {
      return "errors.unauthorized";
    }

    if (message.includes("connection") || message.includes("network")) {
      return "errors.connection";
    }

    return "errors.generic";
  }
}

