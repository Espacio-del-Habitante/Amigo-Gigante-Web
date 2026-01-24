"use client";

import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import { Button, Chip } from "@/presentation/components/atoms";

interface AdoptInfoPanelProps {
  name: string;
  ageLabel: string;
  sexLabel: string;
  sizeLabel: string;
  speciesLabel: string;
  description: string;
  locationLabel: string;
  onAdopt?: () => void;
}

export function AdoptInfoPanel({
  name,
  ageLabel,
  sexLabel,
  sizeLabel,
  speciesLabel,
  description,
  locationLabel,
  onAdopt,
}: AdoptInfoPanelProps) {
  const theme = useTheme();
  const t = useTranslations("adoptDetail");

  const descriptionText = description.trim().length > 0 ? description : t("labels.descriptionEmpty");

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: theme.shadows[2],
        backgroundColor: theme.palette.background.paper,
        p: { xs: 3, sm: 4 },
      }}
    >
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }} color="text.secondary">
              <LocationOnRoundedIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {locationLabel}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.secondary.main }}>
              {ageLabel}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              {t("labels.age")}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={sexLabel} tone="neutral" variant="soft" />
          <Chip label={sizeLabel} tone="neutral" variant="soft" />
          <Chip label={speciesLabel} tone="neutral" variant="soft" />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>
          {descriptionText}
        </Typography>

        <Box className="grid gap-3 sm:grid-cols-2">
          <Button
            fullWidth
            rounded="pill"
            startIcon={<VolunteerActivismRoundedIcon fontSize="small" />}
            onClick={onAdopt}
            disabled={!onAdopt}
          >
            {t("buttons.adopt")}
          </Button>
          {/*<Button
            fullWidth
            rounded="pill"
            tone="secondary"
            startIcon={<StarRoundedIcon fontSize="small" />}
          >
            {t("buttons.sponsor")}
          </Button>*/}
        </Box>
      </Stack>
    </Box>
  );
}
