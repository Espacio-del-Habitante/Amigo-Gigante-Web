"use client";

import { Alert, Box, CircularProgress, Container, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
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
  animalId: number | string | null;
}

export function AdoptDetailPage({ animalId }: AdoptDetailPageProps) {
  const t = useTranslations("adoptDetail");
  const locale = useLocale();

  const getAdoptDetailUseCase = useMemo(
    () => appContainer.get<GetAdoptDetailUseCase>(USE_CASE_TYPES.GetAdoptDetailUseCase),
    [],
  );

  const requestCounterRef = useRef(0);
  const [detail, setDetail] = useState<AdoptDetail | null>(null);
  const [related, setRelated] = useState<AdoptCatalogItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const loadDetail = useCallback(async () => {
    const requestId = ++requestCounterRef.current;
    setIsLoading(true);
    setErrorKey(null);

    if (animalId === null || animalId === undefined || animalId === "") {
      setDetail(null);
      setRelated([]);
      setIsLoading(false);
      setErrorKey("errors.notFound");
      return;
    }

    try {
      const result = await getAdoptDetailUseCase.execute({ id: animalId, relatedLimit: 4 });
      if (requestId !== requestCounterRef.current) return;

      setDetail(result.detail);
      setRelated(result.related);
    } catch (error) {
      if (requestId !== requestCounterRef.current) return;

      setDetail(null);
      setRelated([]);
      setErrorKey(resolveErrorKey(error));
    } finally {
      if (requestId === requestCounterRef.current) {
        setIsLoading(false);
      }
    }
  }, [animalId, getAdoptDetailUseCase, resolveErrorKey]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const galleryImages = useMemo(() => {
    if (!detail) return [];
    const urls = [detail.coverImageUrl, ...detail.photos.map((photo) => photo.url)].filter(Boolean) as string[];
    return Array.from(new Set(urls));
  }, [detail]);

  useEffect(() => {
    if (!detail) {
      setSelectedImage(null);
      return;
    }

    setSelectedImage((current) => {
      if (current && galleryImages.includes(current)) return current;
      return galleryImages[0] ?? null;
    });
  }, [detail, galleryImages]);

  const renderAgeLabel = (ageMonths: number | null) => {
    if (ageMonths === null) return t("labels.ageUnknown");
    if (ageMonths < 12) return t("age.months", { count: ageMonths });
    const years = Math.floor(ageMonths / 12);
    return t("age.years", { count: Math.max(1, years) });
  };

  const renderSexLabel = (sex: AdoptDetail["sex"]) => {
    if (sex === "male") return t("sex.male");
    if (sex === "female") return t("sex.female");
    return t("sex.unknown");
  };

  const renderSizeLabel = (size: AdoptDetail["size"]) => {
    if (size === "small") return t("size.small");
    if (size === "medium") return t("size.medium");
    if (size === "large") return t("size.large");
    return t("labels.sizeUnknown");
  };

  const renderSpeciesLabel = (species: AdoptDetail["species"]) => {
    if (species === "dog") return t("species.dog");
    if (species === "cat") return t("species.cat");
    return t("species.other");
  };

  const renderBreadcrumbSpecies = (species: AdoptDetail["species"]) => {
    if (species === "dog") return t("breadcrumbs.species.dog");
    if (species === "cat") return t("breadcrumbs.species.cat");
    return t("breadcrumbs.species.other");
  };

  const renderStatusLabel = (status: AdoptDetail["status"]) => {
    if (status === "available") return t("status.available");
    if (status === "adopted") return t("status.adopted");
    if (status === "pending") return t("status.pending");
    if (status === "in_treatment") return t("status.in_treatment");
    return t("status.inactive");
  };

  const mainImage = selectedImage ?? galleryImages[0] ?? "/file.svg";
  const thumbnails = galleryImages;

  return (
    <Box className="bg-slate-50">
      <HomeNavBar />

      <Container maxWidth="xl" sx={{ maxWidth: 1280, px: { xs: 3, sm: 4 }, py: { xs: 4, md: 6 } }}>
        {isLoading ? (
          <Box className="flex flex-col items-center justify-center gap-3 py-16">
            <CircularProgress aria-label={t("states.loading")} />
            <Typography variant="body2" color="text.secondary">
              {t("states.loading")}
            </Typography>
          </Box>
        ) : errorKey ? (
          <Alert severity="error">{t(errorKey)}</Alert>
        ) : detail ? (
          <Box>
            <AdoptBreadcrumbs
              speciesLabel={renderBreadcrumbSpecies(detail.species)}
              name={detail.name}
              locale={locale}
            />

            <Box className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
              <AdoptGallery
                mainImage={mainImage}
                mainAlt={detail.name}
                thumbnails={thumbnails}
                selectedImage={selectedImage ?? mainImage}
                status={detail.status}
                statusLabel={renderStatusLabel(detail.status)}
                onSelect={(url) => setSelectedImage(url)}
              />
              <Box sx={{ position: { lg: "sticky" }, top: { lg: 96 }, alignSelf: "flex-start" }}>
                <AdoptInfoPanel
                  name={detail.name}
                  ageLabel={renderAgeLabel(detail.ageMonths)}
                  sexLabel={renderSexLabel(detail.sex)}
                  sizeLabel={renderSizeLabel(detail.size)}
                  speciesLabel={renderSpeciesLabel(detail.species)}
                  description={detail.description}
                  locationLabel={t("labels.locationPlaceholder")}
                />
              </Box>
            </Box>

            <AdoptHistory />
            <AdoptRelatedGrid items={related} />
          </Box>
        ) : null}
      </Container>

      <HomeFooter />
    </Box>
  );
}
