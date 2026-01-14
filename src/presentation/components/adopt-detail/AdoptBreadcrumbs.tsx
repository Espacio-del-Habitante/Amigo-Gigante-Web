"use client";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";

import type { AdoptSpeciesFilter } from "@/domain/models/AdoptCatalogItem";

interface AdoptBreadcrumbsProps {
  species: AdoptSpeciesFilter;
  name: string;
}

export function AdoptBreadcrumbs({ species, name }: AdoptBreadcrumbsProps) {
  const t = useTranslations("adoptDetail");
  const locale = useLocale();

  const speciesLabel =
    species === "dog"
      ? t("breadcrumbs.species.dog")
      : species === "cat"
        ? t("breadcrumbs.species.cat")
        : t("breadcrumbs.species.other");

  return (
    <Breadcrumbs
      aria-label={t("breadcrumbs.ariaLabel")}
      separator={<ChevronRightRoundedIcon fontSize="small" />}
    >
      <Link component={NextLink} href={`/${locale}/adopt`} underline="hover" color="text.secondary">
        {speciesLabel}
      </Link>
      <Link component={NextLink} href={`/${locale}/adopt`} underline="hover" color="text.secondary">
        {t("breadcrumbs.adoptions")}
      </Link>
      <Typography color="primary.main" fontWeight={800}>
        {name}
      </Typography>
    </Breadcrumbs>
  );
}
