"use client";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { Alert, Box, Breadcrumbs, Typography } from "@mui/material";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { EditAnimalForm } from "@/presentation/components/animals/EditAnimalForm";

export function EditAnimalPage() {
  const t = useTranslations("animals");
  const locale = useLocale();
  const params = useParams();
  const rawId = params?.id;
  const animalId = Array.isArray(rawId) ? Number(rawId[0]) : Number(rawId);
  const isValidId = Number.isFinite(animalId);

  return (
    <Box className="flex w-full flex-col gap-6">
      <Breadcrumbs
        separator={<NavigateNextRoundedIcon fontSize="small" />}
        aria-label={t("edit.breadcrumb.ariaLabel")}
      >
        <Link href={`/${locale}/foundations`} className="text-sm font-semibold text-neutral-600 hover:text-neutral-900">
          {t("edit.breadcrumb.dashboard")}
        </Link>
        <Link href={`/${locale}/foundations/animals`} className="text-sm font-semibold text-neutral-600 hover:text-neutral-900">
          {t("edit.breadcrumb.myAnimals")}
        </Link>
        <Typography variant="body2" className="font-semibold text-neutral-900">
          {t("edit.breadcrumb.edit")}
        </Typography>
      </Breadcrumbs>

      <Box className="flex flex-col gap-1">
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          {t("edit.header.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("edit.header.subtitle")}
        </Typography>
      </Box>

      {isValidId ? <EditAnimalForm animalId={animalId} /> : <Alert severity="error">{t("edit.errors.invalidId")}</Alert>}
    </Box>
  );
}
