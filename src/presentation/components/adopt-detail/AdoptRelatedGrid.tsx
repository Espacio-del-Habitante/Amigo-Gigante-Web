"use client";

import { alpha, Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";

import type { AdoptCatalogItem } from "@/domain/models/AdoptCatalogItem";

interface AdoptRelatedGridProps {
  items: AdoptCatalogItem[];
}

export function AdoptRelatedGrid({ items }: AdoptRelatedGridProps) {
  const theme = useTheme();
  const t = useTranslations("adoptDetail");
  const locale = useLocale();

  const renderAgeLabel = (ageMonths: number | null) => {
    if (ageMonths === null) return t("labels.ageUnknown");
    if (ageMonths < 12) return t("age.months", { count: ageMonths });
    const years = Math.floor(ageMonths / 12);
    return t("age.years", { count: Math.max(1, years) });
  };

  const renderSexLabel = (sex: AdoptCatalogItem["sex"]) => {
    if (sex === "male") return t("sex.male");
    if (sex === "female") return t("sex.female");
    return t("sex.unknown");
  };

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
        {t("related.title")}
      </Typography>

      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t("related.empty")}
        </Typography>
      ) : (
        <Box className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((animal) => {
            const imageUrl = animal.coverImageUrl || "/file.svg";
            const ageLabel = renderAgeLabel(animal.ageMonths);
            const breed = animal.breed.trim().length > 0 ? animal.breed : t("labels.breedUnknown");
            const sexLabel = renderSexLabel(animal.sex);

            return (
              <Card
                key={animal.id}
                component={NextLink}
                href={`/${locale}/adopt/${animal.id}`}
                sx={{
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: theme.shadows[2],
                  textDecoration: "none",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  ":hover": { transform: "translateY(-4px)", boxShadow: theme.shadows[3] },
                }}
              >
                <Box sx={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden", borderRadius: 2 }}>
                  <Box
                    component="img"
                    src={imageUrl}
                    alt={animal.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: animal.coverImageUrl ? "cover" : "contain",
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      transition: "transform 0.4s ease",
                      ":hover": { transform: "scale(1.05)" },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      backgroundColor: alpha(theme.palette.common.white, 0.9),
                      fontWeight: 800,
                      fontSize: "0.75rem",
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
                    {breed} • {sexLabel}
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
