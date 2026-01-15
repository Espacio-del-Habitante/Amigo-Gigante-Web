import type { CartItem } from "@/domain/models/CartItem";
import type { ICartRepository } from "@/domain/repositories/ICartRepository";

export interface AddToCartInput {
  productId: number;
  quantity?: number;
}

export class AddToCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(input: AddToCartInput): Promise<CartItem[]> {
    const items = await this.cartRepository.getCartItems();
    const normalizedQuantity = this.normalizeQuantity(input.quantity ?? 1);

    if (!Number.isFinite(input.productId) || normalizedQuantity <= 0) {
      return items;
    }

    const existing = items.find((item) => item.productId === input.productId);
    const nextItems = existing
      ? items.map((item) =>
          item.productId === input.productId
            ? { ...item, quantity: item.quantity + normalizedQuantity }
            : item,
        )
      : [...items, { productId: input.productId, quantity: normalizedQuantity }];

    await this.cartRepository.setCartItems(nextItems);
    return nextItems;
  }

  private normalizeQuantity(value: number): number {
    if (!Number.isFinite(value)) return 1;
    return Math.max(1, Math.round(value));
  }
}
