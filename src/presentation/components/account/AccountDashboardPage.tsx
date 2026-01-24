"use client";

import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { Button } from "@/presentation/components/atoms";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { UserAdoptionRequestSummary } from "@/domain/models/AdoptionRequest";
import { GetUserAdoptionRequestsUseCase } from "@/domain/usecases/adopt/GetUserAdoptionRequestsUseCase";
import { GetUserProfileUseCase } from "@/domain/usecases/account/GetUserProfileUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { AccountLayout } from "@/presentation/components/layouts";
import { AdoptionRequestCard } from "@/presentation/components/my-adoptions/AdoptionRequestCard";
import Link from "next/link";

const errorKeyList = ["errors.unauthorized", "errors.forbidden", "errors.connection", "errors.generic"] as const;
type DashboardErrorKey = (typeof errorKeyList)[number];

export function AccountDashboardPage() {
  const t = useTranslations("accountDashboard");
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
  const [errorKey, setErrorKey] = useState<DashboardErrorKey | null>(null);

  const resolveErrorKey = useCallback((error: unknown): DashboardErrorKey => {
    if (error instanceof Error) {
      const candidate = error.message as DashboardErrorKey;
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
      // Mostrar solo las 3 más recientes en el dashboard
      setRequests(result.requests.slice(0, 3));
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

  // Contar solicitudes por estado
  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === "pending" || r.status === "in_review").length;
    const approved = requests.filter((r) => r.status === "approved" || r.status === "preapproved").length;
    const needsAction = requests.filter((r) => r.status === "info_requested").length;

    return { pending, approved, needsAction, total: requests.length };
  }, [requests]);

  return (
    <AccountLayout profileName={profileName} activeRoute="dashboard">
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
        ) : (
          <>
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Box className="rounded-xl border border-neutral-100 bg-white p-6 shadow-soft">
                <Typography variant="caption" color="text.secondary" className="mb-1">
                  {t("stats.total")}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  {stats.total}
                </Typography>
              </Box>
              <Box className="rounded-xl border border-neutral-100 bg-white p-6 shadow-soft">
                <Typography variant="caption" color="text.secondary" className="mb-1">
                  {t("stats.pending")}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "warning.main" }}>
                  {stats.pending}
                </Typography>
              </Box>
              <Box className="rounded-xl border border-neutral-100 bg-white p-6 shadow-soft">
                <Typography variant="caption" color="text.secondary" className="mb-1">
                  {t("stats.approved")}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "success.main" }}>
                  {stats.approved}
                </Typography>
              </Box>
              <Box className="rounded-xl border border-neutral-100 bg-white p-6 shadow-soft">
                <Typography variant="caption" color="text.secondary" className="mb-1">
                  {t("stats.needsAction")}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "secondary.main" }}>
                  {stats.needsAction}
                </Typography>
              </Box>
            </div>

            {/* Solicitudes recientes */}
            <Box className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {t("recentRequests.title")}
                </Typography>
                {requests.length > 0 && (
                  <Button
                    component={Link}
                    href={`/${locale}/account/adoptions`}
                    variant="outlined"
                    size="small"
                  >
                    {t("recentRequests.viewAll")}
                  </Button>
                )}
              </div>

              {requests.length === 0 ? (
                <Box className="rounded-xl border border-neutral-100 bg-white p-12 text-center shadow-soft">
                  <span className="material-symbols-outlined mb-4 text-6xl text-neutral-300">pets</span>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {t("recentRequests.empty.title")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="mb-4">
                    {t("recentRequests.empty.description")}
                  </Typography>
                  <Button
                    component={Link}
                    href={`/${locale}/adopt`}
                    variant="contained"
                    tone="primary"
                    size="large"
                    sx={{ mb: 2 }}
                  >
                    {t("recentRequests.empty.button")}
                  </Button>
                </Box>
              ) : (
                <Box className="flex flex-col gap-4">
                  {requests.map((request) => (
                    <AdoptionRequestCard key={request.id} request={request} />
                  ))}
                </Box>
              )}
            </Box>

            {/* Secciones principales: Adopta y Tienda Solidaria */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Box
                component={Link}
                href={`/${locale}/adopt`}
                className="group flex flex-col gap-4 rounded-xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white p-8 shadow-soft transition-all hover:border-brand-400 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg">
                    <span className="material-symbols-outlined text-4xl">pets</span>
                  </div>
                  <div className="flex flex-col">
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "brand.600" }}>
                      {t("mainSections.adopt.title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("mainSections.adopt.subtitle")}
                    </Typography>
                  </div>
                </div>
                <Typography variant="body2" color="text.secondary" className="flex-1">
                  {t("mainSections.adopt.description")}
                </Typography>
                <Button
                  variant="contained"
                  tone="primary"
                  fullWidth
                  sx={{ mt: "auto" }}
                  endIcon={<span className="material-symbols-outlined">arrow_forward</span>}
                >
                  {t("mainSections.adopt.button")}
                </Button>
              </Box>

              <Box
                component={Link}
                href={`/${locale}/shop`}
                className="group flex flex-col gap-4 rounded-xl border-2 border-accent-200 bg-gradient-to-br from-accent-50 to-white p-8 shadow-soft transition-all hover:border-accent-400 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-500 text-white shadow-lg">
                    <span className="material-symbols-outlined text-4xl">shopping_bag</span>
                  </div>
                  <div className="flex flex-col">
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "secondary.main" }}>
                      {t("mainSections.shop.title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("mainSections.shop.subtitle")}
                    </Typography>
                  </div>
                </div>
                <Typography variant="body2" color="text.secondary" className="flex-1">
                  {t("mainSections.shop.description")}
                </Typography>
                <Button
                  variant="contained"
                  tone="secondary"
                  fullWidth
                  sx={{ mt: "auto" }}
                  endIcon={<span className="material-symbols-outlined">arrow_forward</span>}
                >
                  {t("mainSections.shop.button")}
                </Button>
              </Box>
            </div>

            {/* Acciones rápidas */}
            {requests.length > 0 && (
              <Box className="rounded-xl border border-brand-100 bg-brand-50 p-6">
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
                  {t("quickActions.title")}
                </Typography>
                <div className="flex flex-wrap gap-3">
                  <Button
                    component={Link}
                    href={`/${locale}/account/adoptions`}
                    variant="outlined"
                    tone="primary"
                  >
                    {t("quickActions.viewAllRequests")}
                  </Button>
                  <Button
                    component={Link}
                    href={`/${locale}/account`}
                    variant="outlined"
                    tone="primary"
                  >
                    {t("quickActions.editProfile")}
                  </Button>
                </div>
              </Box>
            )}
          </>
        )}
      </div>
    </AccountLayout>
  );
}
