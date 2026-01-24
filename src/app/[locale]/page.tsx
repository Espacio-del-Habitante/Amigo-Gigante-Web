"use client";

import { Box, CircularProgress, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import type { FeaturedFoundation } from "@/domain/models/FeaturedFoundation";
import type { HomeAnimals } from "@/domain/models/HomeAnimals";
import { GetHomeAnimalsUseCase } from "@/domain/usecases/animals/GetHomeAnimalsUseCase";
import { GetFeaturedFoundationsUseCase } from "@/domain/usecases/foundation/GetFeaturedFoundationsUseCase";
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
  const getFeaturedFoundationsUseCase = useMemo(
    () => appContainer.get<GetFeaturedFoundationsUseCase>(USE_CASE_TYPES.GetFeaturedFoundationsUseCase),
    [],
  );
  const [homeAnimals, setHomeAnimals] = useState<HomeAnimals | null>(null);
  const [featuredFoundations, setFeaturedFoundations] = useState<FeaturedFoundation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    Promise.allSettled([
      getHomeAnimalsUseCase.execute(),
      getFeaturedFoundationsUseCase.execute({ limit: 6 }),
    ])
      .then(([animalsResult, foundationsResult]) => {
        if (!isMounted) return;

        if (animalsResult.status === "fulfilled") {
          setHomeAnimals(animalsResult.value);
        } else {
          setHomeAnimals({ heroAnimals: [], featuredAnimals: [] });
        }

        if (foundationsResult.status === "fulfilled") {
          setFeaturedFoundations(foundationsResult.value);
        } else {
          setFeaturedFoundations([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [getHomeAnimalsUseCase, getFeaturedFoundationsUseCase]);

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" className="min-h-screen bg-slate-50">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Box className="bg-slate-50">
      <HomeNavBar />
      <HeroSection heroAnimals={homeAnimals?.heroAnimals ?? []} />
      <AnnouncementsCarousel />
      {homeAnimals?.featuredAnimals?.length ? (
        <FeaturedAnimalsSection animals={homeAnimals.featuredAnimals.slice(0, 3)} />
      ) : null}
      {featuredFoundations.length ? <PartnersSection foundations={featuredFoundations} /> : null}
      <StoreSection />
      <HomeFooter />
    </Box>
  );
}
