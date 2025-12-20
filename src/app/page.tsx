"use client";

import { Box, CircularProgress, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import type { HomeAnimals } from "@/domain/models/HomeAnimals";
import { GetHomeAnimalsUseCase } from "@/domain/usecases/animals/GetHomeAnimalsUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { AiBanner } from "@/presentation/components/home/AiBanner";
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

  const [homeAnimals, setHomeAnimals] = useState<HomeAnimals | null>(null);

  useEffect(() => {
    getHomeAnimalsUseCase.execute().then(setHomeAnimals);
  }, [getHomeAnimalsUseCase]);

  if (!homeAnimals) {
    return (
      <Stack alignItems="center" justifyContent="center" className="min-h-screen bg-slate-50">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Box className="bg-slate-50">
      <HomeNavBar />
      <HeroSection heroAnimals={homeAnimals.heroAnimals} />
      <AiBanner />
      <FeaturedAnimalsSection animals={homeAnimals.featuredAnimals} />
      <PartnersSection />
      <StoreSection />
      <HomeFooter />
    </Box>
  );
}
