"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import type { ShopProduct } from "@/domain/models/ShopProduct";

interface CartItemRowProps {
  product: ShopProduct;
  quantity: number;
  formattedPrice: string | null;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItemRow({
  product,
  quantity,
  formattedPrice,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemRowProps) {
  const theme = useTheme();
  const t = useTranslations("shopDetail");

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: theme.shadows[1],
        p: 3,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 3,
        alignItems: { xs: "flex-start", sm: "center" },
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "action.hover",
          flexShrink: 0,
        }}
      >
        {product.imageUrl ? (
          <Box
            component="img"
            src={product.imageUrl}
            alt={product.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              {t("labels.noImage")}
            </Typography>
          </Stack>
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {product.description || t("labels.noDescription")}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: "primary.main", mt: 1 }}>
          {formattedPrice ?? t("labels.priceUnavailable")}
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.default",
            px: 1,
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "space-between", sm: "center" },
          }}
        >
          <IconButton aria-label={t("cart.actions.decrease")} onClick={onDecrease} size="small">
            <RemoveRoundedIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{quantity}</Typography>
          <IconButton aria-label={t("cart.actions.increase")} onClick={onIncrease} size="small">
            <AddRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
        <IconButton aria-label={t("cart.actions.remove")} onClick={onRemove} sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}>
          <DeleteRoundedIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
