import type { CartItem } from "@/domain/models/CartItem";

export interface ICartRepository {
  getCartItems(): Promise<CartItem[]>;
  setCartItems(items: CartItem[]): Promise<void>;
}
