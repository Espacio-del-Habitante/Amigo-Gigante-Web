"use client";

import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ShopProduct } from "@/domain/models/ShopProduct";
import type { GetProductsFilters } from "@/domain/repositories/IProductRepository";
import { GetProductsUseCase } from "@/domain/usecases/products/GetProductsUseCase";
import { UpdateProductPublishStatusUseCase } from "@/domain/usecases/products/UpdateProductPublishStatusUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import {
  ProductsFilters,
  type ProductsPriceFilter,
  type ProductsStatusFilter,
} from "@/presentation/components/products/ProductsFilters";
import { ProductsPagination } from "@/presentation/components/products/ProductsPagination";
import { ProductsTable } from "@/presentation/components/products/ProductsTable";

const productsErrorKeyList = ["errors.unauthorized", "errors.connection", "errors.generic"] as const;
type ProductsErrorKey = (typeof productsErrorKeyList)[number];

export function ProductsManagementPage() {
  const t = useTranslations("products");
  const locale = useLocale();
  const router = useRouter();
  const getProductsUseCase = useMemo(
    () => appContainer.get<GetProductsUseCase>(USE_CASE_TYPES.GetProductsUseCase),
    [],
  );
  const updatePublishUseCase = useMemo(
    () => appContainer.get<UpdateProductPublishStatusUseCase>(USE_CASE_TYPES.UpdateProductPublishStatusUseCase),
    [],
  );
  const productsErrorKeys = useMemo(() => new Set<ProductsErrorKey>(productsErrorKeyList), []);
  const requestCounterRef = useRef(0);

  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState<ProductsStatusFilter>("all");
  const [priceRange, setPriceRange] = useState<ProductsPriceFilter>("all");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<ProductsErrorKey | null>(null);
  const [updateErrorKey, setUpdateErrorKey] = useState<ProductsErrorKey | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(() => new Set());

  const pageSize = 4;

  const formatPrice = useMemo(
    () => (price: number) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(price),
    [locale],
  );

  const resolveErrorMessage = useCallback(
    (error: unknown): ProductsErrorKey => {
      if (error instanceof Error) {
        const candidate = error.message as ProductsErrorKey;
        if (productsErrorKeys.has(candidate)) {
          return candidate;
        }
      }

      return "errors.generic";
    },
    [productsErrorKeys],
  );

  const buildFilters = useCallback(
    (input: { searchValue: string; status: ProductsStatusFilter; priceRange: ProductsPriceFilter }): GetProductsFilters => {
      const filters: GetProductsFilters = {};

      if (input.status !== "all") {
        filters.status = input.status;
      }

      if (input.priceRange !== "all") {
        filters.priceRange = input.priceRange;
      }

      const search = input.searchValue.trim();
      if (search.length > 0) {
        filters.search = search;
      }

      return filters;
    },
    [],
  );

  const effectiveFilters = useMemo(
    () => buildFilters({ searchValue, status, priceRange }),
    [buildFilters, searchValue, status, priceRange],
  );

  const loadProducts = useCallback(
    async (input: { page: number; filters: GetProductsFilters }) => {
      const requestId = ++requestCounterRef.current;
      setIsLoading(true);
      setErrorKey(null);

      try {
        const result = await getProductsUseCase.execute({
          filters: input.filters,
          pagination: { page: input.page, pageSize },
        });

        if (requestId !== requestCounterRef.current) return;

        setProducts(result.products);
        setTotal(result.total);
      } catch (error) {
        if (requestId !== requestCounterRef.current) return;

        setProducts([]);
        setTotal(0);
        setErrorKey(resolveErrorMessage(error));
      } finally {
        if (requestId === requestCounterRef.current) {
          setIsLoading(false);
        }
      }
    },
    [getProductsUseCase, pageSize, resolveErrorMessage],
  );

  useEffect(() => {
    void loadProducts({ page, filters: effectiveFilters });
  }, [effectiveFilters, loadProducts, page]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPage(1);
  };

  const handleStatusChange = (value: ProductsStatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const handlePriceRangeChange = (value: ProductsPriceFilter) => {
    setPriceRange(value);
    setPage(1);
  };

  const handleTogglePublish = useCallback(
    async (productId: number, nextValue: boolean) => {
      setUpdateErrorKey(null);
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.add(productId);
        return next;
      });
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, isPublished: nextValue } : product,
        ),
      );

      try {
        await updatePublishUseCase.execute({ productId, isPublished: nextValue });
        if (status !== "all") {
          const shouldKeep = status === "published" ? nextValue : !nextValue;
          if (!shouldKeep) {
            setProducts((prev) => prev.filter((product) => product.id !== productId));
            setTotal((prev) => Math.max(0, prev - 1));
          }
        }
      } catch (error) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === productId ? { ...product, isPublished: !nextValue } : product,
          ),
        );
        setUpdateErrorKey(resolveErrorMessage(error));
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }
    },
    [resolveErrorMessage, status, updatePublishUseCase],
  );

  return (
    <Box className="flex w-full flex-col gap-6">
      <Box className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <Box className="flex flex-col gap-1">
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {t("title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("subtitle")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddShoppingCartRoundedIcon />}
          className="w-full md:w-auto"
          aria-label={t("addButton")}
          onClick={() => {
            router.push(`/${locale}/foundations/products/new`);
          }}
        >
          {t("addButton")}
        </Button>
      </Box>

      <ProductsFilters
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
      />

      {errorKey ? (
        <Alert severity="error">{t(errorKey)}</Alert>
      ) : null}

      {updateErrorKey ? (
        <Alert severity="error">{t(updateErrorKey)}</Alert>
      ) : null}

      {isLoading ? (
        <Box className="flex justify-center py-10">
          <CircularProgress aria-label={t("loading.label")} />
        </Box>
      ) : (
        <ProductsTable
          products={products}
          updatingIds={updatingIds}
          formatPrice={formatPrice}
          onTogglePublish={handleTogglePublish}
        />
      )}

      <ProductsPagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(nextPage) => {
          setPage(nextPage);
        }}
      />
    </Box>
  );
}
