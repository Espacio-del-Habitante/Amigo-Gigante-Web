"use client";

import { Alert, Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ShopProduct } from "@/domain/models/ShopProduct";
import { GetCartProductsUseCase } from "@/domain/usecases/cart/GetCartProductsUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { HomeFooter } from "@/presentation/components/home/HomeFooter";
import { HomeNavBar } from "@/presentation/components/organisms";
import { useCart } from "@/presentation/hooks/useCart";

import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";

type CartErrorKey = "errors.unauthorized" | "errors.connection" | "errors.notFound" | "errors.generic";

export function CartPage() {
  const t = useTranslations("shopDetail");
  const locale = useLocale();
  const { items, totalItems, isLoading: isCartLoading, updateItemQuantity } = useCart();

  const getCartProductsUseCase = useMemo(
    () => appContainer.get<GetCartProductsUseCase>(USE_CASE_TYPES.GetCartProductsUseCase),
    [],
  );

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [errorKey, setErrorKey] = useState<CartErrorKey | null>(null);

  const formatPrice = useMemo(() => {
    return (price: number) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(price);
  }, [locale]);

  const resolveErrorKey = useCallback((error: unknown): CartErrorKey => {
    if (error instanceof Error) {
      const key = error.message as CartErrorKey;
      if (
        key === "errors.unauthorized" ||
        key === "errors.connection" ||
        key === "errors.notFound" ||
        key === "errors.generic"
      ) {
        return key;
      }
    }
    return "errors.generic";
  }, []);

  const productIds = useMemo(() => items.map((item) => item.productId), [items]);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      if (productIds.length === 0) {
        setProducts([]);
        setIsLoadingProducts(false);
        setErrorKey(null);
        return;
      }

      setIsLoadingProducts(true);
      setErrorKey(null);

      try {
        const result = await getCartProductsUseCase.execute({ productIds });
        if (!active) return;
        setProducts(result.products);
      } catch (error) {
        if (!active) return;
        setProducts([]);
        setErrorKey(resolveErrorKey(error));
      } finally {
        if (active) {
          setIsLoadingProducts(false);
        }
      }
    };

    void loadProducts();

    return () => {
      active = false;
    };
  }, [getCartProductsUseCase, productIds, resolveErrorKey]);

  const productsById = useMemo(() => {
    return new Map(products.map((product) => [product.id, product] as const));
  }, [products]);

  const detailedItems = useMemo(() => {
    return items
      .map((item) => {
        const product = productsById.get(item.productId);
        if (!product) return null;
        return { item, product };
      })
      .filter((entry): entry is { item: (typeof items)[number]; product: ShopProduct } => Boolean(entry));
  }, [items, productsById]);

  const subtotal = useMemo(() => {
    return detailedItems.reduce((sum, entry) => {
      const price = entry.product.price ?? 0;
      return sum + price * entry.item.quantity;
    }, 0);
  }, [detailedItems]);

  const totalLabel = formatPrice(subtotal);
  const subtotalLabel = formatPrice(subtotal);

  const handleIncrease = useCallback(
    (productId: number, quantity: number) => {
      void updateItemQuantity(productId, quantity + 1);
    },
    [updateItemQuantity],
  );

  const handleDecrease = useCallback(
    (productId: number, quantity: number) => {
      void updateItemQuantity(productId, quantity - 1);
    },
    [updateItemQuantity],
  );

  const handleRemove = useCallback(
    (productId: number) => {
      void updateItemQuantity(productId, 0);
    },
    [updateItemQuantity],
  );

  const isLoading = isCartLoading || isLoadingProducts;
  const isEmpty = !isLoading && detailedItems.length === 0;

  return (
    <Box className="min-h-screen bg-neutral-50" sx={{ display: "flex", flexDirection: "column" }}>
      <HomeNavBar />

      <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4 }, py: { xs: 4, md: 6 } }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography
            component={NextLink}
            href={`/${locale}/shop`}
            variant="body2"
            color="primary"
            sx={{ textDecoration: "none", fontWeight: 700 }}
          >
            {t("cart.backToShop")}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {t("cart.title")}
          </Typography>
        </Stack>

        {isLoading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 12 }}>
            <CircularProgress aria-label={t("states.loading")} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t("states.loading")}
            </Typography>
          </Stack>
        ) : errorKey ? (
          <Alert severity="error">{t(errorKey)}</Alert>
        ) : isEmpty ? (
          <Stack spacing={1} alignItems="center" sx={{ py: 12 }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {t("cart.empty.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {t("cart.empty.description")}
            </Typography>
          </Stack>
        ) : (
          <Box className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <Stack spacing={3}>
              {detailedItems.map(({ item, product }) => (
                <CartItemRow
                  key={product.id}
                  product={product}
                  quantity={item.quantity}
                  formattedPrice={product.price === null ? null : formatPrice(product.price)}
                  onIncrease={() => handleIncrease(product.id, item.quantity)}
                  onDecrease={() => handleDecrease(product.id, item.quantity)}
                  onRemove={() => handleRemove(product.id)}
                />
              ))}
            </Stack>
            <CartSummary subtotalLabel={subtotalLabel} totalLabel={totalLabel} itemCount={totalItems} />
          </Box>
        )}
      </Container>

      <HomeFooter />
    </Box>
  );
}
