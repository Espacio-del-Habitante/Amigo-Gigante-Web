"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

interface CartSummaryProps {
  subtotalLabel: string;
  totalLabel: string;
  itemCount: number;
}

export function CartSummary({ subtotalLabel, totalLabel, itemCount }: CartSummaryProps) {
  const theme = useTheme();
  const t = useTranslations("shopDetail");

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: theme.shadows[2],
        p: 4,
        position: { lg: "sticky" },
        top: { lg: 112 },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>
        {t("cart.summary.title")}
      </Typography>
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" color="text.secondary">
          <Typography variant="body2">{t("cart.summary.subtotal", { count: itemCount })}</Typography>
          <Typography variant="body2" fontWeight={700}>
            {subtotalLabel}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" color="text.secondary">
          <Typography variant="body2">{t("cart.summary.shipping")}</Typography>
          <Typography variant="body2" fontStyle="italic">
            {t("cart.summary.shippingValue")}
          </Typography>
        </Stack>
      </Stack>
      <Box sx={{ borderTop: "1px solid", borderColor: "divider", pt: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
          <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
            {t("cart.summary.total")}
          </Typography>
          <Box textAlign="right">
            <Typography variant="h5" sx={{ fontWeight: 900, color: "primary.main" }}>
              {totalLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("cart.summary.currency")}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
