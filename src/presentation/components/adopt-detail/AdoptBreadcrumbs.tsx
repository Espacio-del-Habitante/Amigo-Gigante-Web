"use client";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import NextLink from "next/link";
import { useTranslations } from "next-intl";

interface AdoptBreadcrumbsProps {
  speciesLabel: string;
  name: string;
  locale: string;
}

export function AdoptBreadcrumbs({ speciesLabel, name, locale }: AdoptBreadcrumbsProps) {
  const t = useTranslations("adoptDetail");

  return (
    <Breadcrumbs
      aria-label={t("breadcrumbs.adoptions")}
      separator={<ChevronRightRoundedIcon fontSize="small" />}
      sx={{ color: "text.secondary", fontWeight: 600 }}
    >
      <MuiLink component={NextLink} href={`/${locale}/adopt`} underline="hover" color="inherit">
        {speciesLabel}
      </MuiLink>
      <MuiLink component={NextLink} href={`/${locale}/adopt`} underline="hover" color="inherit">
        {t("breadcrumbs.adoptions")}
      </MuiLink>
      <Typography color="primary" fontWeight={800}>
        {name}
      </Typography>
    </Breadcrumbs>
  );
}
