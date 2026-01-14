"use client";

import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import MaleRoundedIcon from "@mui/icons-material/MaleRounded";
import FemaleRoundedIcon from "@mui/icons-material/FemaleRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import type { AdoptDetail } from "@/domain/models/AdoptDetail";
import { Button, Chip } from "@/presentation/components/atoms";

interface AdoptInfoPanelProps {
  detail: AdoptDetail;
}

export function AdoptInfoPanel({ detail }: AdoptInfoPanelProps) {
  const theme = useTheme();
  const t = useTranslations("adoptDetail");

  const ageLabel = formatAge(detail.ageMonths, t);
  const description = detail.description.trim().length > 0 ? detail.description : t("labels.descriptionEmpty");

  const sexLabel =
    detail.sex === "male"
      ? t("chips.sex.male")
      : detail.sex === "female"
        ? t("chips.sex.female")
        : t("chips.sex.unknown");
  const sexIcon =
    detail.sex === "female" ? <FemaleRoundedIcon fontSize="small" /> : detail.sex === "male" ? <MaleRoundedIcon fontSize="small" /> : <PetsRoundedIcon fontSize="small" />;
  const sizeLabel =
    detail.size === "small"
      ? t("chips.size.small")
      : detail.size === "medium"
        ? t("chips.size.medium")
        : detail.size === "large"
          ? t("chips.size.large")
          : t("chips.size.unknown");
  const speciesLabel =
    detail.species === "dog"
      ? t("chips.species.dog")
      : detail.species === "cat"
        ? t("chips.species.cat")
        : t("chips.species.other");

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        p: { xs: 3, md: 4 },
        position: { lg: "sticky" },
        top: { lg: 112 },
      }}
    >
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              {detail.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }} color="text.secondary">
              <LocationOnRoundedIcon fontSize="small" />
              <Typography variant="body2">{t("labels.locationUnknown")}</Typography>
            </Stack>
          </Box>
          <Box textAlign="right">
            <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.secondary.main }}>
              {ageLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: 700 }}>
              {t("labels.ageLabel")}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label={sexLabel}
            tone="brand"
            variant="soft"
            icon={sexIcon}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label={sizeLabel}
            tone="accent"
            variant="soft"
            icon={<StraightenRoundedIcon fontSize="small" />}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label={speciesLabel}
            tone="neutral"
            variant="soft"
            icon={<PetsRoundedIcon fontSize="small" />}
            sx={{ fontWeight: 700 }}
          />
        </Stack>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
            {t("labels.descriptionTitle")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {description}
          </Typography>
        </Box>

        <Stack spacing={1.5} direction={{ xs: "column", sm: "row" }}>
          <Button
            fullWidth
            tone="primary"
            rounded="pill"
            startIcon={<VolunteerActivismRoundedIcon />}
            sx={{ py: 1.6, fontWeight: 900 }}
          >
            {t("actions.adopt")}
          </Button>
          <Button
            fullWidth
            tone="secondary"
            rounded="pill"
            startIcon={<StarRoundedIcon />}
            sx={{ py: 1.6, fontWeight: 900 }}
          >
            {t("actions.sponsor")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function formatAge(ageMonths: number | null, t: ReturnType<typeof useTranslations>) {
  if (ageMonths === null) return t("labels.ageUnknown");
  if (ageMonths < 12) return t("age.months", { count: ageMonths });
  const years = Math.floor(ageMonths / 12);
  return t("age.years", { count: Math.max(1, years) });
}
