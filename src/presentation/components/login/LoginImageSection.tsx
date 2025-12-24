"use client";

import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Chip } from "@/presentation/components/atoms";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1600&q=80";

export function LoginImageSection() {
  const theme = useTheme();
  const t = useTranslations("login");

  return (
    <Box
      className="group relative hidden overflow-hidden rounded-2xl bg-neutral-900 lg:flex"
      sx={{
        boxShadow: theme.shadows[3],
        minHeight: { lg: 640 },
      }}
    >
      <Image
        src={HERO_IMAGE}
        alt={t("leftColumn.imageAlt")}
        fill
        priority
        className="transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ objectFit: "cover" }}
        sizes="(min-width: 1536px) 720px, (min-width: 1280px) 640px, (min-width: 1024px) 560px, 0px"
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.35)} 0%, ${alpha(
            theme.palette.common.black,
            0.75,
          )} 100%)`,
        }}
      />
      <Stack
        spacing={2.5}
        sx={{
          position: "absolute",
          inset: 0,
          p: { lg: 4, xl: 6 },
          justifyContent: "flex-end",
          color: "common.white",
        }}
      >
        <Chip
          tone="accent"
          variant="soft"
          icon={<PetsRoundedIcon fontSize="small" />}
          label={t("leftColumn.badge")}
          sx={{
            alignSelf: "flex-start",
            fontWeight: 700,
            backgroundColor: alpha(theme.palette.secondary.main, 0.2),
            color: theme.palette.common.white,
          }}
        />
        <Stack spacing={1}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
              textShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
          >
            {t("leftColumn.title")}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 420 }}>
            {t("leftColumn.description")}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
