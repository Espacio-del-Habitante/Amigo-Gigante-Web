"use client";

import { alpha, Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";

import type { AdoptCatalogItem } from "@/domain/models/AdoptCatalogItem";

interface AdoptRelatedGridProps {
  animals: AdoptCatalogItem[];
}

export function AdoptRelatedGrid({ animals }: AdoptRelatedGridProps) {
  const theme = useTheme();
  const t = useTranslations("adoptDetail");
  const locale = useLocale();

  return (
    <Box sx={{ mt: { xs: 6, md: 8 } }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
        {t("related.title")}
      </Typography>

      {animals.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t("related.empty")}
        </Typography>
      ) : (
        <Box className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {animals.map((animal) => {
            const imageUrl = animal.coverImageUrl || "/file.svg";
            const ageLabel = formatAge(animal.ageMonths, t);
            const sexLabel =
              animal.sex === "male"
                ? t("chips.sex.male")
                : animal.sex === "female"
                  ? t("chips.sex.female")
                  : t("chips.sex.unknown");
            const meta = t("related.meta", { breed: animal.breed || t("labels.breedUnknown"), sex: sexLabel });

            return (
              <Card
                key={animal.id}
                component={NextLink}
                href={`/${locale}/adopt/${animal.id}`}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  textDecoration: "none",
                  color: "inherit",
                  overflow: "hidden",
                  boxShadow: theme.shadows[1],
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  ":hover": { transform: "translateY(-4px)", boxShadow: theme.shadows[3] },
                }}
              >
                <Box sx={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden" }}>
                  <Box
                    component="img"
                    src={imageUrl}
                    alt={t("related.imageAlt", { name: animal.name })}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: animal.coverImageUrl ? "cover" : "contain",
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      transition: "transform 0.4s ease",
                      ":hover": { transform: "scale(1.03)" },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      right: 12,
                      bottom: 12,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.common.white, 0.9),
                      fontSize: 12,
                      fontWeight: 800,
                      color: "text.primary",
                    }}
                  >
                    {ageLabel}
                  </Box>
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {animal.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {meta}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

function formatAge(ageMonths: number | null, t: ReturnType<typeof useTranslations>) {
  if (ageMonths === null) return t("labels.ageUnknown");
  if (ageMonths < 12) return t("age.months", { count: ageMonths });
  const years = Math.floor(ageMonths / 12);
  return t("age.years", { count: Math.max(1, years) });
}
