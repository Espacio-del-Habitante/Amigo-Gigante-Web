"use client";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";

import type { ShopProduct } from "@/domain/models/ShopProduct";

interface ShopRelatedGridProps {
  items: ShopProduct[];
  formatPrice: (price: number) => string;
  errorKey?: "errors.unauthorized" | "errors.connection" | "errors.notFound" | "errors.generic" | null;
}

export function ShopRelatedGrid({ items, formatPrice, errorKey = null }: ShopRelatedGridProps) {
  const theme = useTheme();
  const t = useTranslations("shopDetail");
  const locale = useLocale();

  if (errorKey) {
    return (
      <Box component="section" sx={{ mt: 8 }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
          {t("related.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t(errorKey)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ mt: 8 }}>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>
        {t("related.title")}
      </Typography>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t("related.empty")}
        </Typography>
      ) : (
        <Box className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => {
            const productHref = `/${locale}/shop/${product.id}`;
            const priceLabel =
              product.price === null ? t("labels.priceUnavailable") : formatPrice(product.price);

            return (
              <Box
                key={product.id}
                component={NextLink}
                href={productHref}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                  boxShadow: theme.shadows[1],
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ position: "relative", height: { xs: 180, sm: 200, md: 220 }, backgroundColor: "action.hover" }}>
                  {product.imageUrl ? (
                    <Box
                      component="img"
                      src={product.imageUrl}
                      alt={product.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        {t("labels.noImage")}
                      </Typography>
                    </Stack>
                  )}
                  <Box
                    component="span"
                    aria-hidden
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      backgroundColor: "background.paper",
                      boxShadow: theme.shadows[2],
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <FavoriteBorderRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  </Box>
                </Box>
                <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {product.description || t("labels.noDescription")}
                  </Typography>
                  <Typography sx={{ fontWeight: 900, color: "primary.main", mt: "auto" }}>
                    {priceLabel}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
