"use client";

import { useTranslations } from "next-intl";

import { NotificationBell } from "@/presentation/components/molecules";

export interface DashboardHeaderProps {
  foundationName: string;
  locale: string;
}

export function DashboardHeader({ foundationName, locale }: DashboardHeaderProps) {
  const t = useTranslations("dashboard");

  const formattedDate = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800 md:text-4xl">
          {t("dashboardHeader.greeting", { foundationName })}
        </h1>
        <p className="text-sm font-medium text-neutral-500 md:text-base">
          {t("dashboardHeader.subtitle", { date: formattedDate })}
        </p>
      </div>
      
    </div>
  );
}
