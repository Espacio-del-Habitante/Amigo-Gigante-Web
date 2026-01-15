"use client";

import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ShoppingBasketRoundedIcon from "@mui/icons-material/ShoppingBasketRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import type { ShopFoundation } from "@/domain/models/ShopFoundation";
import type { ShopProduct } from "@/domain/models/ShopProduct";
import { Button } from "@/presentation/components/atoms";

interface ShopInfoPanelProps {
  product: ShopProduct;
  foundation: ShopFoundation;
  formattedPrice: string | null;
  onAddToCart: () => void;
}

export function ShopInfoPanel({ product, foundation, formattedPrice, onAddToCart }: ShopInfoPanelProps) {
  const theme = useTheme();
  const t = useTranslations("shopDetail");

  const location = [foundation.city, foundation.country].filter(Boolean).join(", ");
  const priceLabel = product.price === null ? t("labels.priceUnavailable") : formattedPrice;

  return (
    <Stack spacing={3} sx={{ backgroundColor: "background.paper", borderRadius: 4, p: { xs: 3, md: 4 } }}>
      <Stack spacing={1.5}>
        <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
          {product.name}
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={foundation.logoUrl ?? undefined}
            alt={foundation.name}
            sx={{
              width: 44,
              height: 44,
              bgcolor: theme.palette.primary.main + "1A",
              color: "primary.main",
              fontWeight: 700,
            }}
          >
            {foundation.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
              {t("labels.soldBy")}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {foundation.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {location || t("labels.locationUnavailable")}
            </Typography>
          </Box>
        </Stack>
        <Typography variant="h5" color={product.price === null ? "text.secondary" : "primary.main"} sx={{ fontWeight: 900 }}>
          {priceLabel}
        </Typography>
      </Stack>

      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        {product.description || t("labels.noDescription")}
      </Typography>

      <Button
        tone="primary"
        rounded="default"
        onClick={onAddToCart}
        startIcon={<ShoppingBasketRoundedIcon />}
        sx={{ py: 1.5, fontSize: 16 }}
      >
        {t("buttons.addToCart")}
      </Button>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 2,
            borderRadius: 3,
            backgroundColor: "background.default",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <LocalShippingRoundedIcon color="primary" />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase" }}>
              {t("highlights.shipping.title")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("highlights.shipping.description")}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 2,
            borderRadius: 3,
            backgroundColor: "background.default",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <VerifiedUserRoundedIcon color="primary" />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase" }}>
              {t("highlights.secure.title")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("highlights.secure.description")}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
