"use client";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { AddAnimalForm } from "@/presentation/components/animals/AddAnimalForm";

export function AddAnimalPage() {
  const t = useTranslations("animals");
  const locale = useLocale();

  return (
    <Box className="flex w-full flex-col gap-6">
      <Breadcrumbs
        separator={<NavigateNextRoundedIcon fontSize="small" />}
        aria-label={t("add.breadcrumb.ariaLabel")}
      >
        <Link href={`/${locale}/foundations`} className="text-sm font-semibold text-neutral-600 hover:text-neutral-900">
          {t("add.breadcrumb.dashboard")}
        </Link>
        <Link href={`/${locale}/foundations/animals`} className="text-sm font-semibold text-neutral-600 hover:text-neutral-900">
          {t("add.breadcrumb.myAnimals")}
        </Link>
        <Typography variant="body2" className="font-semibold text-neutral-900">
          {t("add.breadcrumb.addNew")}
        </Typography>
      </Breadcrumbs>

      <Box className="flex flex-col gap-1">
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          {t("add.header.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("add.header.subtitle")}
        </Typography>
      </Box>

      <AddAnimalForm />
    </Box>
  );
}

