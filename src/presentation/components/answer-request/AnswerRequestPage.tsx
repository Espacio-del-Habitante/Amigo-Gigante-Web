"use client";

import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { UserAdoptionRequestSummary } from "@/domain/models/AdoptionRequest";
import type { RequestInfoForResponse } from "@/domain/usecases/adopt/GetRequestInfoForResponseUseCase";
import { GetRequestInfoForResponseUseCase } from "@/domain/usecases/adopt/GetRequestInfoForResponseUseCase";
import { GetUserProfileUseCase } from "@/domain/usecases/account/GetUserProfileUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { AnimalInfoCard } from "@/presentation/components/answer-request/AnimalInfoCard";
import { FoundationMessageSection } from "@/presentation/components/answer-request/FoundationMessageSection";
import { ResponseForm } from "@/presentation/components/answer-request/ResponseForm";

interface AnswerRequestPageProps {
  requestId: number;
}

const errorKeyList = ["errors.unauthorized", "errors.invalidStatus", "errors.submitFailed"] as const;
type AnswerRequestErrorKey = (typeof errorKeyList)[number];

export function AnswerRequestPage({ requestId }: AnswerRequestPageProps) {
  const t = useTranslations("answerRequest");
  const account = useTranslations("account");
  const locale = useLocale();
  const router = useRouter();

  const getRequestInfoForResponseUseCase = useMemo(
    () => appContainer.get<GetRequestInfoForResponseUseCase>(USE_CASE_TYPES.GetRequestInfoForResponseUseCase),
    [],
  );

  const getUserProfileUseCase = useMemo(
    () => appContainer.get<GetUserProfileUseCase>(USE_CASE_TYPES.GetUserProfileUseCase),
    [],
  );

  const [requestInfo, setRequestInfo] = useState<RequestInfoForResponse | null>(null);
  const [profileName, setProfileName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorKey, setErrorKey] = useState<AnswerRequestErrorKey | null>(null);

  const resolveErrorKey = useCallback((error: unknown): AnswerRequestErrorKey => {
    if (error instanceof Error) {
      const candidate = error.message as AnswerRequestErrorKey;
      if (errorKeyList.includes(candidate)) {
        return candidate;
      }
    }
    return "errors.submitFailed";
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const profile = await getUserProfileUseCase.execute();
      setProfileName(profile.displayName);
    } catch {
      setProfileName("");
    }
  }, [getUserProfileUseCase]);

  const loadRequest = useCallback(async () => {
    setIsLoading(true);
    setErrorKey(null);

    if (!Number.isFinite(requestId)) {
      setErrorKey("errors.invalidStatus");
      setIsLoading(false);
      return;
    }

    try {
      const info = await getRequestInfoForResponseUseCase.execute({ requestId });
      setRequestInfo(info);
    } catch (error) {
      setRequestInfo(null);
      setErrorKey(resolveErrorKey(error));
    } finally {
      setIsLoading(false);
    }
  }, [getRequestInfoForResponseUseCase, requestId, resolveErrorKey]);

  useEffect(() => {
    void loadProfile();
    void loadRequest();
  }, [loadProfile, loadRequest]);

  useEffect(() => {
    if (errorKey === "errors.invalidStatus") {
      const timer = setTimeout(() => {
        router.replace(`/${locale}/account/adoptions`);
      }, 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [errorKey, locale, router]);

  const displayInitial = profileName.trim().slice(0, 1).toUpperCase() || "?";
  const requestSummary: UserAdoptionRequestSummary | null = requestInfo?.request ?? null;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-72 flex-col border-r border-neutral-200 bg-white px-6 py-8 md:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white">
            <span className="material-symbols-outlined">pets</span>
          </div>
          <div className="text-lg font-extrabold leading-tight text-neutral-900">
            {account("sidebar.brand.name")} <span className="text-brand-500">{account("sidebar.brand.accent")}</span>
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

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-neutral-400">
          <Link href={`/${locale}`} className="font-medium text-neutral-500 hover:text-brand-500">
            {t("breadcrumbs.home")}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/account/adoptions`} className="font-medium text-neutral-500 hover:text-brand-500">
            {t("breadcrumbs.myAdoptions")}
          </Link>
          <span>/</span>
          <span className="font-semibold text-neutral-900">{t("title")}</span>
        </nav>

        <header className="space-y-2">
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
        ) : requestSummary ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {requestInfo?.foundationMessage && (
                <FoundationMessageSection
                  foundationName={requestInfo.foundationMessage.foundationName}
                  message={requestInfo.foundationMessage.message}
                />
              )}
              <ResponseForm requestId={requestSummary.id} />
            </div>
            <div className="space-y-6">
              <AnimalInfoCard request={requestSummary} />
            </div>
          </div>
        ) : (
          <Alert severity="error">{t("errors.submitFailed")}</Alert>
        )}
      </div>
    </div>
  );
}
