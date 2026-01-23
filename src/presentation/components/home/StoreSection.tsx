import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import { Box, Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import type { ShopProduct } from "@/domain/models/ShopProduct";
import { GetHomeProductsUseCase } from "@/domain/usecases/home/GetHomeProductsUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { Button } from "@/presentation/components/atoms";
import { Section } from "@/presentation/components/layouts";
import { useHomeNavigation } from "@/presentation/components/home/hooks/useHomeNavigation";

export function StoreSection() {
  const t = useTranslations("home");
  const { goToShop, goToShopDetail } = useHomeNavigation();
  const getHomeProductsUseCase = useMemo(
    () => appContainer.get<GetHomeProductsUseCase>(USE_CASE_TYPES.GetHomeProductsUseCase),
    [],
  );
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const storeItems = useMemo(() => {
    if (products.length > 0) {
      return products.map((product) => ({
        id: product.id,
        title: product.name,
        price: product.price,
        imageUrl:
          product.imageUrl ??
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAJCRUJJFKLQu9oz9-llyi_l6_3BoqdXrVFOy527zpoHHxh5ZOAYr5_MZNpNYZHHBDKcSJO4RD2C3lydf-2hH_QXXmXIDPwNqgkFxOpnLtxGRQkSQQGx826qUCm3k-x0yx09l-eHXNiRuxff2MscieQkzKoOuxiJrAi_fbOD_b7qabhL6otjlh7iwoznjxfG4s-Y8r7x0sFUKLV8PJYu2wTFrhTus_2R-ZCKOPwXQzEQsYuLsXKWnXNKTGhPZBSLhijLF0Ed0UKHQ",
        isMock: false,
      }));
    }

    return [
      {
        id: "mock-collars",
        title: t("store.items.handmadeCollars"),
        price: 25000,
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAJCRUJJFKLQu9oz9-llyi_l6_3BoqdXrVFOy527zpoHHxh5ZOAYr5_MZNpNYZHHBDKcSJO4RD2C3lydf-2hH_QXXmXIDPwNqgkFxOpnLtxGRQkSQQGx826qUCm3k-x0yx09l-eHXNiRuxff2MscieQkzKoOuxiJrAi_fbOD_b7qabhL6otjlh7iwoznjxfG4s-Y8r7x0sFUKLV8PJYu2wTFrhTus_2R-ZCKOPwXQzEQsYuLsXKWnXNKTGhPZBSLhijLF0Ed0UKHQ",
        isMock: true,
      },
      {
        id: "mock-beds",
        title: t("store.items.paddedBeds"),
        price: 85000,
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBeKk6P-KLrvGRTKXNS0Ypihrfw51dgYflLU6FUgSXgwt920mqBf7mlxnv-CA2RZI80RBFreuvRZRFfSMk7aw4g6eFJaSjCToaPwkER6ayS9PcjwXXqazUOVN3uRqzQaBdlelFBonwVrzcCoU_OZM7tDxuMdEpkFzqxGEDNlBfJcLD3siK_gk1W4hH7nRZVniAuYpNr90_l9MqXEeENdhC_GmXIWzoKGEBFfML6ddHdYZB46S5m_SgdxjKSUvv92cvpJ1su1075RA",
        isMock: true,
      },
      {
        id: "mock-toys",
        title: t("store.items.ecoToys"),
        price: 15000,
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBB0ok7Bx9Y15pPGX5YSknishg3lvRslXwd8a_hb7nXRRrBwOc5F-LR03MODQKtHnhMtuXZT3LxV363dTxnEimVwQBOiW5i0KIUKgmm-5adhoDte7L6RgcnsTNDUQsfZpIewNxRBJGfXicTFxRMd8s7YKq5Ar9AVigWlGk0PF4gu29YwFg4a7riAX9DV0Gv2BdiFX86pUwdJdWWjSlSxSQAtJ0hj-6PDgdeXEbRGcuAsZTuQtvl021qX5Y5xrT9BPKCcdsDgG_18w",
        isMock: true,
      },
    ];
  }, [products, t]);

  const formatPrice = useMemo(() => {
    return (price: number | null) => {
      if (price === null) return t("store.priceFallback");
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(price);
    };
  }, [t]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    getHomeProductsUseCase
      .execute({ limit: 3 })
      .then((result) => {
        if (!isMounted) return;
        setProducts(result);
      })
      .catch(() => {
        if (!isMounted) return;
        setHasError(true);
        setProducts([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [getHomeProductsUseCase]);

  return (
    <Section background="muted" spacingY={{ xs: 16, md: 20 }}>
      <Box className="grid items-center gap-8 md:gap-10 lg:grid-cols-12">
        <Box className="order-2 lg:order-1 lg:col-span-5" sx={{ maxWidth: { lg: 560 } }}>
          <Stack className="mb-2 gap-1">
            <Typography variant="subtitle2" sx={{ color: "secondary.main", fontWeight: 800, letterSpacing: 1 }}>
              {t("store.eyebrow")}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "text.primary" }}>
              {t("store.title")}
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {t("store.description")}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} className="mt-6 gap-3">
            <Button
              tone="secondary"
              startIcon={<StorefrontRoundedIcon />}
              rounded="default"
              sx={{ px: 3.5, py: 1.4 }}
              onClick={goToShop}
            >
              {t("store.cta")}
            </Button>
          </Stack>
        </Box>
        <Box className="order-1 grid gap-4 sm:grid-cols-2 lg:order-2 lg:col-span-7">
          {isLoading && (
            <Box className="col-span-full flex items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8">
              <Stack spacing={1} alignItems="center">
                <CircularProgress size={28} />
                <Typography variant="body2" color="text.secondary">
                  {t("store.loading")}
                </Typography>
              </Stack>
            </Box>
          )}
          {!isLoading && hasError && (
            <Box className="col-span-full rounded-2xl border border-solid border-slate-200 bg-white p-6">
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {t("store.errorTitle")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t("store.errorDescription")}
              </Typography>
            </Box>
          )}
          {!isLoading &&
            storeItems.map((item) => (
              <Card
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (item.isMock) {
                    goToShop();
                    return;
                  }
                  if (typeof item.id === "number") {
                    goToShopDetail(item.id);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    if (item.isMock) {
                      goToShop();
                      return;
                    }
                    if (typeof item.id === "number") {
                      goToShopDetail(item.id);
                    }
                  }
                }}
                sx={{
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <Box sx={{ position: "relative", height: 160 }}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 900px) 100vw, (max-width: 1280px) 50vw, 520px"
                    style={{ objectFit: "cover" }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {formatPrice(item.price)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          <Card
            sx={{
              borderRadius: 2,
              backgroundColor: "secondary.main",
              color: "common.white",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              boxShadow: 3,
            }}
          >
            <CardContent>
              <ShoppingBagRoundedIcon sx={{ fontSize: 40 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>
                {t("store.highlightTitle")}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                {t("store.highlightDescription")}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Section>
  );
}
