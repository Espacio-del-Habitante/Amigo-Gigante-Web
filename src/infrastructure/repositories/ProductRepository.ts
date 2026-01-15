import type { ShopProduct } from "@/domain/models/ShopProduct";
import type {
  DeleteProductParams,
  GetProductsParams,
  GetProductsResult,
  GetShopProductsParams,
  IProductRepository,
  RecentProduct,
  ShopProductsPage,
  CreateProductParams,
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

  async createProduct({
    foundationId,
    name,
    description,
    price,
    imageUrl,
    imageFile,
    isPublished,
  }: CreateProductParams): Promise<ShopProduct> {
    let resolvedImageUrl = imageUrl;

    if (imageFile) {
      try {
        resolvedImageUrl = await this.uploadProductImage(imageFile, foundationId);
      } catch (error) {
        if (this.isStorageUnavailableError(error) && imageUrl) {
          resolvedImageUrl = imageUrl;
        } else {
          throw error;
        }
      }
    }

    const { data, error } = await supabaseClient
      .from("products")
      .insert({
        foundation_id: foundationId,
        name,
        description,
        price,
        image_url: resolvedImageUrl,
        is_published: isPublished,
      })
      .select("id, foundation_id, name, description, price, image_url, is_published, created_at")
      .single();

    if (error) {
      throw new Error(this.translateProductsError(error));
    }

    if (!data) {
      throw new Error("errors.generic");
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

  async deleteProduct({ productId, foundationId }: DeleteProductParams): Promise<void> {
    const { data, error } = await supabaseClient
      .from("products")
      .delete()
      .eq("id", productId)
      .eq("foundation_id", foundationId)
      .select("id");

    if (error) {
      throw new Error(this.translateProductsError(error));
    }

    if (!data || data.length === 0) {
      throw new Error("errors.unauthorized");
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

  private async uploadProductImage(file: File, foundationId: string): Promise<string> {
    const sanitizedName = this.sanitizeFileName(file.name);
    const filePath = `${foundationId}/${Date.now()}-${sanitizedName}`;

    const { data, error } = await supabaseClient.storage.from("products").upload(filePath, file, {
      upsert: false,
    });

    if (error) {
      throw new Error(this.translateProductsError(error));
    }

    const publicUrl = supabaseClient.storage.from("products").getPublicUrl(data?.path ?? "").data.publicUrl;

    if (!publicUrl) {
      throw new Error("errors.generic");
    }

    return publicUrl;
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-z0-9.\-_]/gi, "-").toLowerCase();
  }

  private isStorageUnavailableError(error: unknown): boolean {
    return error instanceof Error && error.message === "errors.storageUnavailable";
  }

  private translateProductsError(error: { message?: string }): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("permission") || message.includes("row level")) {
      return "errors.unauthorized";
    }

    if (message.includes("connection") || message.includes("network")) {
      return "errors.connection";
    }

    if (message.includes("bucket") || message.includes("not found") || message.includes("resource")) {
      return "errors.storageUnavailable";
    }

    return "errors.generic";
  }
}

