"use client";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import type { DashboardAttentionAlert } from "@/domain/models/DashboardData";
import type { Notification } from "@/domain/models/Notification";
import { useNotifications } from "@/presentation/hooks/useNotifications";
import { buildNotificationLink } from "@/presentation/utils/notificationUtils";

export interface NeedsAttentionSectionProps {
  alerts: DashboardAttentionAlert[];
  locale: string;
}

const relevantNotificationTypes = new Set(["adoption_request_created", "adoption_status_changed"]);

const resolveNotificationCopy = (notification: Notification, translate: (key: string) => string) => {
  switch (notification.type) {
    case "adoption_request_created":
      return {
        title: translate("types.adoption_request_created.title"),
        body: translate("types.adoption_request_created.body"),
      };
    case "adoption_status_changed":
      return {
        title: translate("types.adoption_status_changed.title"),
        body: translate("types.adoption_status_changed.body"),
      };
    default:
      return {
        title: translate("types.unknown.title"),
        body: translate("types.unknown.body"),
      };
  }
};

const buildRelativeTime = (value: string, locale: string, fallbackLabel: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallbackLabel;

  const now = Date.now();
  const diffInSeconds = Math.round((date.getTime() - now) / 1000);
  const absSeconds = Math.abs(diffInSeconds);

  if (absSeconds < 60) return fallbackLabel;

  const minutes = Math.round(diffInSeconds / 60);
  if (Math.abs(minutes) < 60) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(minutes, "minute");
  }

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(hours, "hour");
  }

  const days = Math.round(hours / 24);
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(days, "day");
};

export function NeedsAttentionSection({ alerts, locale }: NeedsAttentionSectionProps) {
  const t = useTranslations("dashboard");
  const tNotifications = useTranslations("notifications");
  const router = useRouter();
  const { notifications, markAsRead } = useNotifications({ limit: 10 });
  const currentLocale = useLocale();

  const relevantNotifications = notifications.filter(
    (notification) => !notification.readAt && relevantNotificationTypes.has(notification.type),
  );

  const badge = String(alerts.length + relevantNotifications.length);
  const translate = (key: string, values?: Record<string, unknown>): string => {
    return (t as unknown as (k: string, v?: Record<string, unknown>) => string)(key, values);
  };

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

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.readAt) {
      await markAsRead(notification.id);
    }

    const link = buildNotificationLink(currentLocale, notification);
    if (link) {
      router.push(link);
    }
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
        {relevantNotifications.map((notification) => {
          const { title, body } = resolveNotificationCopy(notification, (key) =>
            tNotifications(key as never),
          );
          const relativeTime = buildRelativeTime(notification.createdAt, currentLocale, tNotifications("time.justNow"));

          return (
            <button
              key={notification.id}
              type="button"
              onClick={() => void handleNotificationClick(notification)}
              className="flex w-full items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/40 p-3 text-left transition hover:border-brand-200 hover:bg-brand-50"
            >
              <span className="mt-2 h-2 w-2 min-w-[8px] rounded-full bg-brand-500" />
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-sm font-extrabold text-neutral-800">{title}</p>
                <p className="text-xs text-neutral-600">{body}</p>
                <p className="text-xs text-neutral-400">{relativeTime}</p>
              </div>
            </button>
          );
        })}
        {alerts.map((alert, idx) => {
          const styles = getAlertStyles(alert.variant);
          const title = translate(`needsAttention.alerts.${alert.key}.title`);
          const message =
            alert.key === "veterinaryReview"
              ? translate(`needsAttention.alerts.${alert.key}.message`, {
                  animalName: alert.animalName ?? "",
                  date: alert.dueDate ? formatDueDate(alert.dueDate) : "",
                })
              : translate(`needsAttention.alerts.${alert.key}.message`, {
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
