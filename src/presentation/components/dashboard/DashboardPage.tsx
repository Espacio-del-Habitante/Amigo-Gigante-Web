"use client";

import { useEffect, useMemo, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import type { DashboardData } from "@/domain/models/DashboardData";
import { GetDashboardDataUseCase } from "@/domain/usecases/dashboard/GetDashboardDataUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { AdoptionFunnelSection } from "@/presentation/components/dashboard/AdoptionFunnelSection";
import { DashboardHeader } from "@/presentation/components/dashboard/DashboardHeader";
import { DashboardKPICards } from "@/presentation/components/dashboard/DashboardKPICards";
import { NeedsAttentionSection } from "@/presentation/components/dashboard/NeedsAttentionSection";
import { QuickActionsSection } from "@/presentation/components/dashboard/QuickActionsSection";
import { RecentActivityTable } from "@/presentation/components/dashboard/RecentActivityTable";

export function DashboardPage() {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const getDashboardDataUseCase = useMemo(
    () => appContainer.get<GetDashboardDataUseCase>(USE_CASE_TYPES.GetDashboardDataUseCase),
    [],
  );

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const load = async (): Promise<void> => {
    setLoading(true);
    setErrorKey(null);
    try {
      const result = await getDashboardDataUseCase.execute();
      setData(result);
    } catch (error) {
      const key = error instanceof Error && error.message ? error.message : "errors.generic";
      setErrorKey(key);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // Intentionally run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-neutral-100 bg-neutral-white p-6 shadow-soft">
        <p className="text-sm font-medium text-neutral-600">{t("loading.label")}</p>
      </div>
    );
  }

  if (errorKey) {
    const safeErrorKey = errorKey.startsWith("errors.") ? errorKey : "errors.generic";
    const message = t(safeErrorKey as never);
    return (
      <div className="rounded-lg border border-neutral-100 bg-neutral-white p-6 shadow-soft">
        <p className="text-sm font-medium text-neutral-800">{message}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-bold text-neutral-50 shadow-soft hover:bg-brand-600"
        >
          {t("errors.retry")}
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader foundationName={data.foundationName} locale={locale} />
      <DashboardKPICards kpis={data.kpis} locale={locale} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <AdoptionFunnelSection funnel={data.adoptionFunnel} />
          <RecentActivityTable items={data.recentActivity} locale={locale} />
        </div>
        <div className="flex flex-col gap-6">
          <QuickActionsSection />
          <NeedsAttentionSection alerts={data.attentionAlerts} locale={locale} />
        </div>
      </div>
    </div>
  );
}

