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
import { HomeNavBar } from "@/presentation/components/home/HomeNavBar";
import { PartnersSection } from "@/presentation/components/home/PartnersSection";
import { StoreSection } from "@/presentation/components/home/StoreSection";

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
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "100vh" }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8fafc" }}>
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
