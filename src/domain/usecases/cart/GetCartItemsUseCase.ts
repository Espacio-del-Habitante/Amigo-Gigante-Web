import type { CartItem } from "@/domain/models/CartItem";
import type { ICartRepository } from "@/domain/repositories/ICartRepository";

export class GetCartItemsUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(): Promise<CartItem[]> {
    return this.cartRepository.getCartItems();
  }
}
