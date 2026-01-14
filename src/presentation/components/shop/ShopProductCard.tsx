"use client";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import type { ShopProduct } from "@/domain/models/ShopProduct";
import { Button, Chip } from "@/presentation/components/atoms";

export interface ShopProductCardProps {
  product: ShopProduct;
  formattedPrice: string;
}

export function ShopProductCard({ product, formattedPrice }: ShopProductCardProps) {
  const theme = useTheme();
  const t = useTranslations("shop");
  const common = useTranslations("common");

  return (
    <Box
      component="article"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: theme.shadows[1],
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Box sx={{ position: "relative", height: 220, backgroundColor: "action.hover" }}>
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
              {t("product.noImage")}
            </Typography>
          </Stack>
        )}

        <IconButton
          aria-label={common("labels.favorite")}
          sx={{
            position: "absolute",
            right: 12,
            bottom: 12,
            backgroundColor: "background.paper",
            boxShadow: theme.shadows[2],
            "&:hover": { backgroundColor: "background.paper" },
          }}
        >
          <FavoriteBorderRoundedIcon sx={{ color: "text.secondary" }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 2.25, display: "flex", flexDirection: "column", gap: 1.25, flex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
          {product.name}
        </Typography>
        {product.description ? (
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {product.description}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {t("product.noDescription")}
          </Typography>
        )}

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: "auto", pt: 0.5 }}>
          {product.price === null ? (
            <Chip tone="neutral" label={t("product.priceUnavailable")} />
          ) : (
            <Typography sx={{ fontWeight: 900, color: "primary.main", fontSize: 18 }}>{formattedPrice}</Typography>
          )}
          <Button
            tone="primary"
            startIcon={<ShoppingBagRoundedIcon />}
            rounded="default"
            sx={{ px: 2.25, py: 1, minWidth: 0 }}
          >
            {t("product.buy")}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

