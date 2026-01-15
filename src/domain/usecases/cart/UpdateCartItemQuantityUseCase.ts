import type { CartItem } from "@/domain/models/CartItem";
import type { ICartRepository } from "@/domain/repositories/ICartRepository";

export interface UpdateCartItemQuantityInput {
  productId: number;
  quantity: number;
}

export class UpdateCartItemQuantityUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(input: UpdateCartItemQuantityInput): Promise<CartItem[]> {
    const items = await this.cartRepository.getCartItems();
    const normalizedQuantity = this.normalizeQuantity(input.quantity);

    if (!Number.isFinite(input.productId)) {
      return items;
    }

    const withoutTarget = items.filter((item) => item.productId !== input.productId);

    const nextItems =
      normalizedQuantity <= 0
        ? withoutTarget
        : [...withoutTarget, { productId: input.productId, quantity: normalizedQuantity }];

    await this.cartRepository.setCartItems(nextItems);
    return nextItems;
  }

  private normalizeQuantity(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.round(value));
  }
}
