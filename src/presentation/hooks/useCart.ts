import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { CartItem } from "@/domain/models/CartItem";
import { AddToCartUseCase } from "@/domain/usecases/cart/AddToCartUseCase";
import { GetCartItemsUseCase } from "@/domain/usecases/cart/GetCartItemsUseCase";
import { UpdateCartItemQuantityUseCase } from "@/domain/usecases/cart/UpdateCartItemQuantityUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";

interface UseCartResult {
  items: CartItem[];
  totalItems: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItemQuantity: (productId: number, quantity: number) => Promise<void>;
}

export const useCart = (): UseCartResult => {
  const getCartItemsUseCase = useMemo(
    () => appContainer.get<GetCartItemsUseCase>(USE_CASE_TYPES.GetCartItemsUseCase),
    [],
  );
  const addToCartUseCase = useMemo(
    () => appContainer.get<AddToCartUseCase>(USE_CASE_TYPES.AddToCartUseCase),
    [],
  );
  const updateCartItemQuantityUseCase = useMemo(
    () => appContainer.get<UpdateCartItemQuantityUseCase>(USE_CASE_TYPES.UpdateCartItemQuantityUseCase),
    [],
  );

  const isMountedRef = useRef(true);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const nextItems = await getCartItemsUseCase.execute();
      if (!isMountedRef.current) return;
      setItems(nextItems);
    } catch {
      if (isMountedRef.current) {
        setItems([]);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [getCartItemsUseCase]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleUpdate = () => {
      void refresh();
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("cart:updated", handleUpdate as EventListener);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("cart:updated", handleUpdate as EventListener);
    };
  }, [refresh]);

  const addItem = useCallback(
    async (productId: number, quantity = 1) => {
      try {
        await addToCartUseCase.execute({ productId, quantity });
      } finally {
        await refresh();
      }
    },
    [addToCartUseCase, refresh],
  );

  const updateItemQuantity = useCallback(
    async (productId: number, quantity: number) => {
      try {
        await updateCartItemQuantityUseCase.execute({ productId, quantity });
      } finally {
        await refresh();
      }
    },
    [refresh, updateCartItemQuantityUseCase],
  );

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  return {
    items,
    totalItems,
    isLoading,
    refresh,
    addItem,
    updateItemQuantity,
  };
};
