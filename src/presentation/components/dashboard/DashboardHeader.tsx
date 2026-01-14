"use client";

import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { useTranslations } from "next-intl";

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
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={t("dashboardHeader.notifications")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-white text-neutral-600 shadow-soft transition-colors hover:bg-neutral-50"
        >
          <NotificationsNoneRoundedIcon fontSize="small" />
        </button>
        <div className="flex h-10 items-center rounded-full border border-neutral-200 bg-neutral-white px-4 text-sm font-semibold text-neutral-600 shadow-soft">
          {t("dashboardHeader.viewMode")}
        </div>
      </div>
    </div>
  );
}

