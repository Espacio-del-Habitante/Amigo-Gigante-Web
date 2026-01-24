"use client";

import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { UserAdoptionRequestSummary } from "@/domain/models/AdoptionRequest";
import { GetUserAdoptionRequestsUseCase } from "@/domain/usecases/adopt/GetUserAdoptionRequestsUseCase";
import { GetUserProfileUseCase } from "@/domain/usecases/account/GetUserProfileUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { Button } from "@/presentation/components/atoms";
import { AdoptionRequestCard } from "@/presentation/components/my-adoptions/AdoptionRequestCard";
import { EmptyState } from "@/presentation/components/my-adoptions/EmptyState";

const errorKeyList = ["errors.unauthorized", "errors.forbidden", "errors.connection", "errors.generic"] as const;
type MyAdoptionsErrorKey = (typeof errorKeyList)[number];

export function MyAdoptionsPage() {
  const t = useTranslations("myAdoptions");
  const account = useTranslations("account");
  const locale = useLocale();
  const router = useRouter();

  const getUserAdoptionRequestsUseCase = useMemo(
    () => appContainer.get<GetUserAdoptionRequestsUseCase>(USE_CASE_TYPES.GetUserAdoptionRequestsUseCase),
    [],
  );
  const getUserProfileUseCase = useMemo(
    () => appContainer.get<GetUserProfileUseCase>(USE_CASE_TYPES.GetUserProfileUseCase),
    [],
  );

  const [requests, setRequests] = useState<UserAdoptionRequestSummary[]>([]);
  const [profileName, setProfileName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorKey, setErrorKey] = useState<MyAdoptionsErrorKey | null>(null);

  const resolveErrorKey = useCallback((error: unknown): MyAdoptionsErrorKey => {
    if (error instanceof Error) {
      const candidate = error.message as MyAdoptionsErrorKey;
      if (errorKeyList.includes(candidate)) {
        return candidate;
      }
    }
    return "errors.generic";
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const profile = await getUserProfileUseCase.execute();
      setProfileName(profile.displayName);
    } catch {
      setProfileName("");
    }
  }, [getUserProfileUseCase]);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setErrorKey(null);

    try {
      const result = await getUserAdoptionRequestsUseCase.execute();
      setRequests(result.requests);
    } catch (error) {
      const key = resolveErrorKey(error);
      setRequests([]);

      if (key === "errors.unauthorized") {
        router.replace(`/${locale}/login`);
        return;
      }

      if (key === "errors.forbidden") {
        router.replace(`/${locale}/403`);
        return;
      }

      setErrorKey(key);
    } finally {
      setIsLoading(false);
    }
  }, [getUserAdoptionRequestsUseCase, locale, resolveErrorKey, router]);

  useEffect(() => {
    void loadProfile();
    void loadRequests();
  }, [loadProfile, loadRequests]);

  const displayInitial = profileName.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-72 flex-col border-r border-neutral-200 bg-white px-6 py-8 md:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white">
            <span className="material-symbols-outlined">pets</span>
          </div>
          <div className="text-lg font-extrabold leading-tight text-neutral-900">
            {account("sidebar.brand.name")}{" "}
            <span className="text-brand-500">{account("sidebar.brand.accent")}</span>
          </div>
        </div>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-lg font-semibold text-neutral-700">
            {displayInitial}
          </div>
          <div className="min-w-0">
            <Typography variant="subtitle2" className="truncate font-semibold text-neutral-900">
              {profileName || account("sidebar.fallbackName")}
            </Typography>
            <Typography variant="caption" className="text-neutral-500">
              {account("sidebar.subtitle")}
            </Typography>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <Link
            href={`/${locale}/account`}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-sm font-medium">{account("sidebar.account")}</span>
          </Link>
          <Link
            href={`/${locale}/account/adoptions`}
            className="flex items-center gap-3 rounded-lg bg-brand-50 px-3 py-2 text-brand-600"
          >
            <span className="material-symbols-outlined">pets</span>
            <span className="text-sm font-semibold">{account("sidebar.requests")}</span>
          </Link>
        </nav>
      </aside>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2">
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {t("title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("description")}
          </Typography>
        </header>

        {isLoading ? (
          <Box className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white p-6 shadow-soft">
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary">
              {t("loading")}
            </Typography>
          </Box>
        ) : errorKey ? (
          <Alert severity="error">{t(errorKey)}</Alert>
        ) : requests.length === 0 ? (
          <EmptyState />
        ) : (
          <Box className="flex flex-col gap-4">
            {requests.map((request) => (
              <AdoptionRequestCard key={request.id} request={request} />
            ))}
          </Box>
        )}

        <Box className="flex flex-col items-start gap-5 rounded-xl border border-brand-100 bg-brand-50 p-6 md:flex-row md:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white">
            <span className="material-symbols-outlined">info</span>
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              {t("infoSection.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("infoSection.description")}
            </Typography>
          </div>
          <Button
            component="a"
            href="mailto:soporte@amigogigante.org"
            tone="primary"
            variant="outlined"
            className="md:ml-auto"
          >
            {t("infoSection.button")}
          </Button>
        </Box>
      </div>
    </div>
  );
}
