import type { Notification } from "@/domain/models/Notification";

export const buildNotificationLink = (locale: string, notification: Notification): string | null => {
  const requestId = notification.data?.request_id;

  if (
    notification.type === "adoption_request_created" ||
    notification.type === "adoption_status_changed"
  ) {
    if (typeof requestId === "number" && Number.isFinite(requestId)) {
      const id = String(requestId);
      if (id !== "0") {
        return `/${locale}/foundations/adoptions/${id}`;
      }
    }

    if (typeof requestId === "string") {
      const id = requestId.trim();
      if (id && id !== "0") {
        return `/${locale}/foundations/adoptions/${id}`;
      }
    }
  }

  return null;
};
