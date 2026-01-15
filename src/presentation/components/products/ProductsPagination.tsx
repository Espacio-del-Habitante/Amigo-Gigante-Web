"use client";

import { Box, Pagination, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export interface ProductsPaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function ProductsPagination({ total, page, pageSize, onPageChange }: ProductsPaginationProps) {
  const t = useTranslations("products");

  if (total === 0) {
    return null;
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const from = (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, total);

  return (
    <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Typography variant="body2" color="text.secondary">
        {t("pagination.showing", { from, to, total })}
      </Typography>
      <Pagination
        count={pageCount}
        page={safePage}
        onChange={(_, nextPage) => onPageChange(nextPage)}
        color="primary"
        shape="rounded"
        siblingCount={1}
        boundaryCount={1}
      />
    </Box>
  );
}
