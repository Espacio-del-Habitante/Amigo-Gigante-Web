import type { CartItem } from "@/domain/models/CartItem";
import type { ICartRepository } from "@/domain/repositories/ICartRepository";

const CART_STORAGE_KEY = "amigo-gigante-cart";

export class CartRepository implements ICartRepository {
  async getCartItems(): Promise<CartItem[]> {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return this.normalizeCartItems(parsed);
    } catch {
      return [];
    }
  }

  async setCartItems(items: CartItem[]): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    const normalized = this.normalizeCartItems(items);
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent("cart:updated"));
  }

  private normalizeCartItems(items: unknown): CartItem[] {
    if (!Array.isArray(items)) {
      return [];
    }

    const aggregated = new Map<number, number>();

    for (const rawItem of items) {
      if (!rawItem || typeof rawItem !== "object") continue;

      const productId = Number((rawItem as { productId?: unknown }).productId);
      const quantity = Number((rawItem as { quantity?: unknown }).quantity);

      if (!Number.isFinite(productId) || !Number.isFinite(quantity) || quantity <= 0) {
        continue;
      }

      aggregated.set(productId, (aggregated.get(productId) ?? 0) + Math.round(quantity));
    }

    return Array.from(aggregated.entries()).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
  }
}
