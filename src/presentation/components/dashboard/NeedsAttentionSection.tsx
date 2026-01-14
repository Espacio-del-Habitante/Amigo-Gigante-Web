"use client";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import { useTranslations } from "next-intl";

import type { DashboardAttentionAlert } from "@/domain/models/DashboardData";

export interface NeedsAttentionSectionProps {
  alerts: DashboardAttentionAlert[];
  locale: string;
}

export function NeedsAttentionSection({ alerts, locale }: NeedsAttentionSectionProps) {
  const t = useTranslations("dashboard");

  const badge = String(alerts.length);

  const getAlertStyles = (variant: DashboardAttentionAlert["variant"]) => {
    if (variant === "danger") {
      return {
        container: "border-accent-100 bg-accent-50/40",
        iconClassName: "text-accent-700",
      };
    }

    if (variant === "warning") {
      return {
        container: "border-brand-100 bg-brand-50/40",
        iconClassName: "text-brand-700",
      };
    }

    return {
      container: "border-neutral-100 bg-neutral-50",
      iconClassName: "text-neutral-400",
    };
  };

  const renderIcon = (key: DashboardAttentionAlert["key"], className: string) => {
    if (key === "veterinaryReview") return <MedicalServicesRoundedIcon fontSize="small" className={className} />;
    if (key === "lowStock") return <Inventory2RoundedIcon fontSize="small" className={className} />;
    return <ScheduleRoundedIcon fontSize="small" className={className} />;
  };

  const formatDueDate = (iso: string): string => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
  };

  return (
    <section className="flex flex-1 flex-col overflow-hidden rounded-xl border border-neutral-100 bg-neutral-white shadow-soft">
      <div className="flex items-center justify-between border-b border-neutral-100 p-6">
        <h3 className="text-lg font-extrabold text-neutral-800">{t("needsAttention.title")}</h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-50 text-xs font-extrabold text-accent-700">
          {badge}
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        {alerts.map((alert, idx) => {
          const styles = getAlertStyles(alert.variant);
          const title = t(`needsAttention.alerts.${alert.key}.title` as never);
          const message =
            alert.key === "veterinaryReview"
              ? t(`needsAttention.alerts.${alert.key}.message` as never, {
                  animalName: alert.animalName ?? "",
                  date: alert.dueDate ? formatDueDate(alert.dueDate) : "",
                })
              : t(`needsAttention.alerts.${alert.key}.message` as never, {
                  count: alert.count ?? 0,
                });

          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={`${alert.key}-${idx}`}
              className={`flex gap-4 rounded-xl border p-3 ${styles.container}`}
            >
              <div className="mt-1 min-w-[24px]">{renderIcon(alert.key, styles.iconClassName)}</div>
              <div>
                <p className="text-sm font-extrabold text-neutral-800">{title}</p>
                <p className="mt-0.5 text-xs text-neutral-600">{message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-auto border-t border-neutral-100 p-4">
        <button type="button" className="w-full py-2 text-sm font-bold text-neutral-500 hover:text-brand-600">
          {t("needsAttention.viewAllTasks")}
        </button>
      </div>
    </section>
  );
}

