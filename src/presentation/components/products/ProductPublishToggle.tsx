"use client";

import { Box, CircularProgress, Switch } from "@mui/material";
import { useTranslations } from "next-intl";

export interface ProductPublishToggleProps {
  productId: number;
  productName: string;
  isPublished: boolean;
  isUpdating: boolean;
  onToggle: (productId: number, nextValue: boolean) => void;
}

export function ProductPublishToggle({
  productId,
  productName,
  isPublished,
  isUpdating,
  onToggle,
}: ProductPublishToggleProps) {
  const t = useTranslations("products");

  return (
    <Box className="inline-flex items-center gap-2">
      <Switch
        size="small"
        checked={isPublished}
        disabled={isUpdating}
        onChange={(event) => onToggle(productId, event.target.checked)}
        inputProps={{ "aria-label": t("toggle.ariaLabel", { name: productName }) }}
      />
      {isUpdating ? <CircularProgress size={16} /> : null}
    </Box>
  );
}
