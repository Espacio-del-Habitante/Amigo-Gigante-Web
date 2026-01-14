"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import type { ShopFoundation } from "@/domain/models/ShopFoundation";
import { ShopSearchBar, type ShopSearchState } from "./ShopSearchBar";

export interface ShopHeroProps {
  foundations: ShopFoundation[];
  search: ShopSearchState;
  onSearchChange: (next: ShopSearchState) => void;
  onSearchSubmit: () => void;
  isSubmitting?: boolean;
}

export function ShopHero({
  foundations,
  search,
  onSearchChange,
  onSearchSubmit,
  isSubmitting = false,
}: ShopHeroProps) {
  const t = useTranslations("shop");

  return (
    <Box
      component="header"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 10, md: 14 },
        background: "linear-gradient(135deg, rgba(28,176,246,0.12), rgba(248,250,252,1))",
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 } }}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
            {t("hero.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, lineHeight: 1.8 }}>
            {t("hero.subtitle")}
          </Typography>
          <Box sx={{ width: "100%", pt: 1 }}>
            <ShopSearchBar
              foundations={foundations}
              value={search}
              onChange={onSearchChange}
              onSubmit={onSearchSubmit}
              isSubmitting={isSubmitting}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

