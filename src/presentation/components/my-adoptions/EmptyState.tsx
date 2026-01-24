"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/presentation/components/atoms";

export function EmptyState() {
  const t = useTranslations("myAdoptions");
  const locale = useLocale();

  return (
    <Box className="flex flex-col items-start gap-4 rounded-xl border border-neutral-100 bg-white p-8 shadow-soft">
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {t("empty.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t("empty.description")}
      </Typography>
      <Button component={Link} href={`/${locale}/adopt`} tone="primary" variant="solid">
        {t("empty.button")}
      </Button>
    </Box>
  );
}
