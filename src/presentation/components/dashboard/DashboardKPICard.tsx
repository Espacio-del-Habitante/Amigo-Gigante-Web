"use client";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { DashboardKpiCard } from "@/domain/models/DashboardData";

export interface DashboardKPICardProps {
  kpi: DashboardKpiCard;
  locale: string;
  icon: ReactNode;
  iconClassName: string;
}

export function DashboardKPICard({ kpi, locale, icon, iconClassName }: DashboardKPICardProps) {
  const t = useTranslations("dashboard");

  const formattedValue = new Intl.NumberFormat(locale).format(kpi.value);

  const trendText = `${kpi.trend.variant === "positive" ? "+" : ""}${kpi.trend.percent}%`;
  const trendClasses =
    kpi.trend.variant === "positive"
      ? "bg-brand-50 text-brand-700"
      : kpi.trend.variant === "negative"
        ? "bg-accent-50 text-accent-700"
        : "bg-neutral-100 text-neutral-600";

  return (
    <div className="group flex h-full flex-col justify-between rounded-xl border border-neutral-100 bg-neutral-white p-6 shadow-soft transition-all duration-300 hover:border-brand-200">
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-lg p-2 ${iconClassName}`}>{icon}</div>
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${trendClasses}`}>
          {kpi.trend.variant === "positive" ? (
            <TrendingUpRoundedIcon sx={{ fontSize: 16, mr: 0.5 }} />
          ) : null}
          {trendText}
        </span>
      </div>
      <div>
        <p className="mb-1 text-sm font-medium text-neutral-500">{t(`kpi.${kpi.key}.label` as never)}</p>
        <h3 className="text-3xl font-extrabold text-neutral-800">{formattedValue}</h3>
      </div>
    </div>
  );
}
