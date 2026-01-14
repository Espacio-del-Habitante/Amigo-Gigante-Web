"use client";

import { Alert, Box, CircularProgress, Container, Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AdoptCatalogItem } from "@/domain/models/AdoptCatalogItem";
import type { AdoptDetail } from "@/domain/models/AdoptDetail";
import { GetAdoptDetailUseCase } from "@/domain/usecases/adopt/GetAdoptDetailUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { HomeFooter } from "@/presentation/components/home/HomeFooter";
import { HomeNavBar } from "@/presentation/components/organisms";

import { AdoptBreadcrumbs } from "./AdoptBreadcrumbs";
import { AdoptGallery } from "./AdoptGallery";
import { AdoptHistory } from "./AdoptHistory";
import { AdoptInfoPanel } from "./AdoptInfoPanel";
import { AdoptRelatedGrid } from "./AdoptRelatedGrid";

type AdoptDetailErrorKey =
  | "errors.unauthorized"
  | "errors.connection"
  | "errors.notFound"
  | "errors.generic";

interface AdoptDetailPageProps {
  animalId?: string | string[];
}

export function AdoptDetailPage({ animalId }: AdoptDetailPageProps) {
  const t = useTranslations("adoptDetail");

  const getAdoptDetailUseCase = useMemo(
    () => appContainer.get<GetAdoptDetailUseCase>(USE_CASE_TYPES.GetAdoptDetailUseCase),
    [],
  );

  const requestCounterRef = useRef(0);

  const [detail, setDetail] = useState<AdoptDetail | null>(null);
  const [relatedAnimals, setRelatedAnimals] = useState<AdoptCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<AdoptDetailErrorKey | null>(null);

  const resolveErrorKey = useCallback((error: unknown): AdoptDetailErrorKey => {
    if (error instanceof Error) {
      const key = error.message as AdoptDetailErrorKey;
      if (
        key === "errors.unauthorized" ||
        key === "errors.connection" ||
        key === "errors.notFound" ||
        key === "errors.generic"
      ) {
        return key;
      }
    }
    return "errors.generic";
  }, []);

  const loadDetail = useCallback(
    async (id: number | string) => {
      const requestId = ++requestCounterRef.current;
      setIsLoading(true);
      setErrorKey(null);

      try {
        const result = await getAdoptDetailUseCase.execute({ id });
        if (requestId !== requestCounterRef.current) return;

        setDetail(result.detail);
        setRelatedAnimals(result.relatedAnimals);
      } catch (error) {
        if (requestId !== requestCounterRef.current) return;

        setDetail(null);
        setRelatedAnimals([]);
        setErrorKey(resolveErrorKey(error));
      } finally {
        if (requestId === requestCounterRef.current) {
          setIsLoading(false);
        }
      }
    },
    [getAdoptDetailUseCase, resolveErrorKey],
  );

  useEffect(() => {
    const resolvedId = Array.isArray(animalId) ? animalId[0] : animalId;
    const normalizedId = typeof resolvedId === "string" ? resolvedId.trim() : "";
    if (!normalizedId) {
      requestCounterRef.current += 1;
      setDetail(null);
      setRelatedAnimals([]);
      setIsLoading(false);
      setErrorKey("errors.notFound");
      return;
    }

    const numericId = Number(normalizedId);
    const idValue =
      /^\d+$/.test(normalizedId) && Number.isSafeInteger(numericId)
        ? numericId
        : normalizedId;

    void loadDetail(idValue);
  }, [animalId, loadDetail]);

  const statusLabel = detail ? t(`status.${detail.status}`) : "";
  const statusTone = detail?.status === "available" ? "brand" : "neutral";

  const mainImageUrl =
    detail?.coverImageUrl || detail?.photos[0]?.url || "/file.svg";
  const thumbnails =
    detail?.photos.map((photo) => photo.url).filter((url) => url !== mainImageUrl) ?? [];

  return (
    <Box className="bg-slate-50">
      <HomeNavBar />
      <Container maxWidth="xl" sx={{ maxWidth: 1440, px: { xs: 3, sm: 4 }, py: { xs: 5, md: 7 } }}>
        {detail ? <AdoptBreadcrumbs species={detail.species} name={detail.name} /> : null}
        <Divider sx={{ my: 3 }} />

        {errorKey ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {t(errorKey)}
          </Alert>
        ) : null}

        {isLoading ? (
          <Box className="flex justify-center py-16">
            <CircularProgress aria-label={t("states.loading")} />
          </Box>
        ) : detail ? (
          <>
            <Box className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
              <AdoptGallery
                name={detail.name}
                mainImageUrl={mainImageUrl}
                thumbnails={thumbnails}
                statusLabel={statusLabel}
                statusTone={statusTone}
              />
              <AdoptInfoPanel detail={detail} />
            </Box>

            <AdoptHistory />
            <AdoptRelatedGrid animals={relatedAnimals} />
          </>
        ) : null}
      </Container>
      <HomeFooter />
    </Box>
  );
}
