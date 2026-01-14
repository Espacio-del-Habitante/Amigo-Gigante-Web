"use client";

import { Pagination, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export interface ShopPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onChange: (page: number) => void;
}

export function ShopPagination({ page, totalPages, totalItems, onChange }: ShopPaginationProps) {
  const t = useTranslations("shop");

  if (totalPages <= 1) return null;

  return (
    <Stack spacing={1.5} alignItems="center" sx={{ pt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
        {t("pagination.total", { count: totalItems })}
      </Typography>
      <Pagination
        page={page}
        count={totalPages}
        color="primary"
        shape="rounded"
        onChange={(_, next) => onChange(next)}
      />
    </Stack>
  );
}

