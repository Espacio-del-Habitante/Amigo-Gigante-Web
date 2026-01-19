"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { Button, Logo } from "@/presentation/components/atoms";
import { LanguageSelector } from "@/presentation/components/molecules";

export function RegisterExternalHeader() {
  const t = useTranslations("register");

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      spacing={2.5}
    >
      <Stack direction="column" alignItems="center" spacing={2}>
        <Logo size={48} showWordmark subtitle={t("external.header.subtitle")} />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <LanguageSelector />
        <Button
          component={Link}
          href="/"
          aria-label={t("external.header.backAria")}
          variant="outlined"
          rounded="pill"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            fontWeight: 700,
            "&:hover": {
              transform: "translateY(-1px)",
              transition: "transform 150ms ease, box-shadow 150ms ease",
            },
          }}
        >
          {t("external.header.back")}
        </Button>
      </Stack>
    </Stack>
  );
}
