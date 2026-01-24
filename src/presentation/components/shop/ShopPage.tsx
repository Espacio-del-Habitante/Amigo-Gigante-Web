"use client";

import { Box, Container, CircularProgress, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ShopCatalogResult } from "@/domain/usecases/shop/GetShopCatalogUseCase";
import { GetShopCatalogUseCase } from "@/domain/usecases/shop/GetShopCatalogUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { HomeFooter } from "@/presentation/components/home/HomeFooter";
import { HomeNavBar } from "@/presentation/components/organisms";
import { ShopFoundationSection } from "./ShopFoundationSection";
import { ShopHero } from "./ShopHero";
import type { ShopSearchState } from "./ShopSearchBar";
import { ShopPagination } from "./ShopPagination";

const DEFAULT_PAGE_SIZE = 12;

type ShopErrorKey = "errors.unauthorized" | "errors.notFound" | "errors.connection" | "errors.generic";

const getErrorKey = (message: string | undefined): ShopErrorKey => {
  if (!message) return "errors.generic";

  if (message === "errors.unauthorized") return "errors.unauthorized";
  if (message === "errors.notFound") return "errors.notFound";
  if (message === "errors.connection") return "errors.connection";
  if (message === "errors.generic") return "errors.generic";

  return "errors.generic";
};

export function ShopPage() {
  const t = useTranslations("shop");
  const locale = useLocale();

  const getShopCatalogUseCase = useMemo(
    () => appContainer.get<GetShopCatalogUseCase>(USE_CASE_TYPES.GetShopCatalogUseCase),
    [],
  );

  const [catalog, setCatalog] = useState<ShopCatalogResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorKey, setErrorKey] = useState<ShopErrorKey | null>(null);

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<ShopSearchState>({ query: "", foundationId: "" });

  const formatPrice = useMemo(() => {
    return (price: number) =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(price);
  }, []);

  const load = useCallback(
    async (nextPage: number, nextSearch: ShopSearchState) => {
      setLoading(true);
      setErrorKey(null);

      try {
        const result = await getShopCatalogUseCase.execute({
          page: nextPage,
          pageSize: DEFAULT_PAGE_SIZE,
          query: nextSearch.query.trim() ? nextSearch.query : undefined,
          foundationId: nextSearch.foundationId || undefined,
        });

        setCatalog(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : undefined;
        setErrorKey(getErrorKey(message));
        setCatalog(null);
      } finally {
        setLoading(false);
      }
    },
    [getShopCatalogUseCase],
  );

  useEffect(() => {
    void load(page, search);
  }, [load, page, search]);

  const handleSubmitSearch = () => {
    setPage(1);
  };

  const handleViewAllFoundation = (foundationId: string) => {
    setSearch((current) => ({ ...current, foundationId }));
    setPage(1);
  };

  const handleChangePage = (nextPage: number) => {
    setPage(nextPage);
  };

  const foundations = catalog?.foundations ?? [];

  return (
    <Box className="min-h-screen bg-neutral-50" sx={{ display: "flex", flexDirection: "column" }}>
      <HomeNavBar />
      <ShopHero
        foundations={foundations}
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSubmitSearch}
        isSubmitting={loading}
      />

      <Box component="main" sx={{ flex: 1, py: { xs: 8, md: 10 } }}>
        <Container maxWidth="xl" sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 } }}>
          {loading && !catalog ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 12 }}>
              <CircularProgress />
            </Stack>
          ) : errorKey ? (
            <Stack spacing={1} alignItems="center" sx={{ py: 12 }}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                {t("errors.title")}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {t(errorKey)}
              </Typography>
            </Stack>
          ) : catalog && catalog.total > 0 ? (
            <Stack spacing={{ xs: 10, md: 12 }}>
              {catalog.sections.map((section, index) => (
                <ShopFoundationSection
                  key={section.foundation.id}
                  foundation={section.foundation}
                  products={section.products}
                  onViewAll={handleViewAllFoundation}
                  formatPrice={formatPrice}
                  // TODO: Remove this once we have a donation card {index === catalog.sections.length - 1}
                  showDonationCard={false}
                />
              ))}
              <ShopPagination
                page={catalog.page}
                totalPages={catalog.totalPages}
                totalItems={catalog.total}
                onChange={handleChangePage}
              />

              <Box
                component="section"
                sx={{
                  borderTop: "1px solid",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  py: { xs: 8, md: 10 },
                  textAlign: "center",
                  backgroundColor: "background.paper",
                }}
              >
                <Stack spacing={2} alignItems="center" sx={{ maxWidth: 720, mx: "auto" }}>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    {t("cta.title")}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {t("cta.description")}
                  </Typography>
                  <Box sx={{ pt: 1, display: "flex", justifyContent: "center" }}>
                    <Box
                      component={NextLink}
                      href={`/${locale}/register/foundation`}
                      className="rounded-full bg-brand-500 px-6 py-3 font-bold text-white text-center transition-colors hover:bg-brand-600"
                      sx={{ textDecoration: "none", display: "inline-block" }}
                    >
                      {t("cta.primary")}
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          ) : (
            <Stack spacing={1} alignItems="center" sx={{ py: 12 }}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                {t("empty.title")}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {t("empty.description")}
              </Typography>
            </Stack>
          )}
        </Container>
      </Box>

      <HomeFooter />
    </Box>
  );
}

