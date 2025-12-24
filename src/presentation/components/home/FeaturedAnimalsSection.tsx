import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import { Box, Link, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import type { Animal } from "@/domain/models/Animal";
import { Section } from "@/presentation/components/layouts";
import { AnimalCard } from "@/presentation/components/organisms";

interface FeaturedAnimalsSectionProps {
  animals: Animal[];
}

export function FeaturedAnimalsSection({ animals }: FeaturedAnimalsSectionProps) {
  const t = useTranslations("home");

  return (
    <Section background="muted" spacingY={{ xs: 10, md: 14 }}>
      <Stack direction={{ xs: "column", sm: "row" }} className="mb-8 items-start gap-3 sm:items-end sm:justify-between">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
            {t("featured.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("featured.subtitle")}
          </Typography>
        </Box>
        <Link
          href="#"
          underline="none"
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            alignItems: "center",
            color: "primary.main",
            fontWeight: 800,
            gap: 0.5,
          }}
        >
          {t("featured.action")}
          <ArrowRightAltRoundedIcon />
        </Link>
      </Stack>
      <Box className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {animals.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} />
        ))}
      </Box>
    </Section>
  );
}
