import type { Notification } from "@/domain/models/Notification";

export const buildNotificationLink = (locale: string, notification: Notification): string | null => {
  const requestId = notification.data?.request_id;

  if ((notification.type === "adoption_request_created" || notification.type === "adoption_status_changed") && typeof requestId === "string") {
    return `/${locale}/foundations/adoptions/${requestId}`;
  }

  return null;
};
