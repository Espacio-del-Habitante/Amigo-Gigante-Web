"use client";

import { Alert, Box, CircularProgress, Container, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ShopFoundation } from "@/domain/models/ShopFoundation";
import type { ShopProduct } from "@/domain/models/ShopProduct";
import { GetProductDetailUseCase } from "@/domain/usecases/shop/GetProductDetailUseCase";
import { GetRelatedProductsUseCase } from "@/domain/usecases/shop/GetRelatedProductsUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { HomeFooter } from "@/presentation/components/home/HomeFooter";
import { HomeNavBar } from "@/presentation/components/organisms";
import { useCart } from "@/presentation/hooks/useCart";

import { ShopBreadcrumbs } from "./ShopBreadcrumbs";
import { ShopGallery } from "./ShopGallery";
import { ShopInfoPanel } from "./ShopInfoPanel";
import { ShopRelatedGrid } from "./ShopRelatedGrid";

type ShopDetailErrorKey =
  | "errors.unauthorized"
  | "errors.connection"
  | "errors.notFound"
  | "errors.generic";

interface ShopDetailPageProps {
  productId: number | string | null;
}

export function ShopDetailPage({ productId }: ShopDetailPageProps) {
  const t = useTranslations("shopDetail");
  const locale = useLocale();
  const { addItem } = useCart();

  const getProductDetailUseCase = useMemo(
    () => appContainer.get<GetProductDetailUseCase>(USE_CASE_TYPES.GetProductDetailUseCase),
    [],
  );
  const getRelatedProductsUseCase = useMemo(
    () => appContainer.get<GetRelatedProductsUseCase>(USE_CASE_TYPES.GetRelatedProductsUseCase),
    [],
  );

  const requestCounterRef = useRef(0);
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [foundation, setFoundation] = useState<ShopFoundation | null>(null);
  const [related, setRelated] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<ShopDetailErrorKey | null>(null);
  const [relatedErrorKey, setRelatedErrorKey] = useState<ShopDetailErrorKey | null>(null);

  const formatPrice = useMemo(() => {
    return (price: number) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(price);
  }, [locale]);

  const resolveErrorKey = useCallback((error: unknown): ShopDetailErrorKey => {
    if (error instanceof Error) {
      const key = error.message as ShopDetailErrorKey;
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

  const loadDetail = useCallback(async () => {
    const requestId = ++requestCounterRef.current;
    setIsLoading(true);
    setErrorKey(null);
    setRelatedErrorKey(null);

    if (productId === null || productId === undefined || productId === "") {
      setProduct(null);
      setFoundation(null);
      setRelated([]);
      setIsLoading(false);
      setErrorKey("errors.notFound");
      return;
    }

    try {
      const detail = await getProductDetailUseCase.execute({ productId });
      if (requestId !== requestCounterRef.current) return;

      setProduct(detail.product);
      setFoundation(detail.foundation);

      try {
        const relatedProducts = await getRelatedProductsUseCase.execute({
          productId: detail.product.id,
          foundationId: detail.product.foundationId,
          limit: 4,
        });
        if (requestId !== requestCounterRef.current) return;
        setRelated(relatedProducts);
      } catch (error) {
        if (requestId !== requestCounterRef.current) return;
        setRelated([]);
        setRelatedErrorKey(resolveErrorKey(error));
      }
    } catch (error) {
      if (requestId !== requestCounterRef.current) return;
      setProduct(null);
      setFoundation(null);
      setRelated([]);
      setErrorKey(resolveErrorKey(error));
    } finally {
      if (requestId === requestCounterRef.current) {
        setIsLoading(false);
      }
    }
  }, [getProductDetailUseCase, getRelatedProductsUseCase, productId, resolveErrorKey]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    await addItem(product.id, 1);
  }, [addItem, product]);

  return (
    <Box className="bg-slate-50">
      <HomeNavBar />

      <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4 }, py: { xs: 4, md: 6 } }}>
        {isLoading ? (
          <Box className="flex flex-col items-center justify-center gap-3 py-16">
            <CircularProgress aria-label={t("states.loading")} />
            <Typography variant="body2" color="text.secondary">
              {t("states.loading")}
            </Typography>
          </Box>
        ) : errorKey ? (
          <Alert severity="error">{t(errorKey)}</Alert>
        ) : product && foundation ? (
          <Box>
            <ShopBreadcrumbs name={product.name} locale={locale} />

            <Box className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
              <ShopGallery imageUrl={product.imageUrl} name={product.name} />
              <Box sx={{ position: { lg: "sticky" }, top: { lg: 96 }, alignSelf: "flex-start" }}>
                <ShopInfoPanel
                  product={product}
                  foundation={foundation}
                  formattedPrice={product.price === null ? null : formatPrice(product.price)}
                  onAddToCart={handleAddToCart}
                />
              </Box>
            </Box>

            <ShopRelatedGrid items={related} formatPrice={formatPrice} errorKey={relatedErrorKey} />
          </Box>
        ) : null}
      </Container>

      <HomeFooter />
    </Box>
  );
}
