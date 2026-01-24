import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import { Box, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import type { FeaturedFoundation } from "@/domain/models/FeaturedFoundation";
import { Section } from "@/presentation/components/layouts";

interface PartnersSectionProps {
  foundations: FeaturedFoundation[];
}

export function PartnersSection({ foundations }: PartnersSectionProps) {
  const t = useTranslations("home");

  return (
    <Section background="paper" spacingY={{ xs: 14, md: 18 }}>
      <Box textAlign="center" className="mb-10">
        <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: 800, letterSpacing: 1.2 }}>
          {t("partners.subtitle")}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: "text.primary" }}>
          {t("partners.title")}
        </Typography>
      </Box>
      <Stack direction="row" flexWrap="wrap" className="mt-4 flex items-center justify-center gap-8 md:gap-12">
        {foundations.map((foundation) => (
          <Stack
            key={foundation.id}
            spacing={1.5}
            alignItems="center"
            sx={{
              color: "text.secondary",
              transition: "all 0.2s ease",
              ":hover": { color: "primary.main" },
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "primary.light",
                color: "text.secondary",
                display: "grid",
                placeItems: "center",
                overflow: "hidden",
              }}
            >
              {foundation.logoUrl ? (
                <Box
                  component="img"
                  src={foundation.logoUrl}
                  alt={foundation.name}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <PetsRoundedIcon fontSize="large" />
              )}
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {foundation.name}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Section>
  );
}
