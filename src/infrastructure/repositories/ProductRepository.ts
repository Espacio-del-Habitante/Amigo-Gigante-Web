import type { IProductRepository, RecentProduct } from "@/domain/repositories/IProductRepository";
import { supabaseClient } from "@/infrastructure/config/supabase";

interface ProductRow {
  id: number;
  name: string | null;
  price: number | string | null;
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

