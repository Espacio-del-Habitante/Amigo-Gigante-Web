"use client";

import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import type { HomeAnimals } from "@/domain/models/HomeAnimals";
import { GetHomeAnimalsUseCase } from "@/domain/usecases/animals/GetHomeAnimalsUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { AnnouncementsCarousel } from "@/presentation/components/home/AnnouncementsCarousel";
import { FeaturedAnimalsSection } from "@/presentation/components/home/FeaturedAnimalsSection";
import { HeroSection } from "@/presentation/components/home/HeroSection";
import { HomeFooter } from "@/presentation/components/home/HomeFooter";
import { PartnersSection } from "@/presentation/components/home/PartnersSection";
import { StoreSection } from "@/presentation/components/home/StoreSection";
import { HomeNavBar } from "@/presentation/components/organisms";

export default function Home() {
  const getHomeAnimalsUseCase = useMemo(
    () => appContainer.get<GetHomeAnimalsUseCase>(USE_CASE_TYPES.GetHomeAnimalsUseCase),
    [],
  );
  const t = useTranslations("home");

  const [homeAnimals, setHomeAnimals] = useState<HomeAnimals | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getHomeAnimalsUseCase
      .execute()
      .then((result) => {
        setHomeAnimals(result);
        setHasError(false);
      })
      .catch(() => {
        setHasError(true);
      });
  }, [getHomeAnimalsUseCase]);

  if (!homeAnimals) {
    return (
      <Stack alignItems="center" justifyContent="center" className="min-h-screen bg-slate-50">
        {hasError ? (
          <Stack spacing={1} alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {t("errors.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {t("errors.description")}
            </Typography>
          </Stack>
        ) : (
          <CircularProgress />
        )}
      </Stack>
    );
  }

  return (
    <Box className="bg-slate-50">
      <HomeNavBar />
      <HeroSection heroAnimals={homeAnimals.heroAnimals} />
      <AnnouncementsCarousel />
      <FeaturedAnimalsSection animals={homeAnimals.featuredAnimals} />
      <PartnersSection />
      <StoreSection />
      <HomeFooter />
    </Box>
  );
}
