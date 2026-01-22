"use client";

import { useTranslations } from "next-intl";
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

export function NeedsAttentionSection({ alerts: _alerts, locale }: NeedsAttentionSectionProps) {
  const t = useTranslations("dashboard");
  const tNotifications = useTranslations("notifications");
  const router = useRouter();
  const { notifications, markAsRead } = useNotifications({ limit: 10 });

  const relevantNotifications = notifications.filter(
    (notification) => !notification.readAt && relevantNotificationTypes.has(notification.type),
  );

  const badge = String(relevantNotifications.length);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.readAt) {
      await markAsRead(notification.id);
    }

    const link = buildNotificationLink(locale, notification);
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
          const relativeTime = buildRelativeTime(notification.createdAt, locale, tNotifications("time.justNow"));

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
        {relevantNotifications.length === 0 && (
          <p className="py-4 text-center text-sm text-neutral-500">{t("needsAttention.empty")}</p>
        )}
      </div>
      <div className="mt-auto border-t border-neutral-100 p-4">
        <button type="button" className="w-full py-2 text-sm font-bold text-neutral-500 hover:text-brand-600">
          {t("needsAttention.viewAllTasks")}
        </button>
      </div>
    </section>
  );
}
