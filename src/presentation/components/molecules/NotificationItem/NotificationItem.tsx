"use client";

import { Box, ListItemButton, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";

import type { Notification } from "@/domain/models/Notification";

export interface NotificationItemProps {
  notification: Notification;
  onSelect: (notification: Notification) => void;
}

const buildRelativeTime = (value: string, locale: string, fallbackLabel: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallbackLabel;

  const now = Date.now();
  const diffInSeconds = Math.round((date.getTime() - now) / 1000);
  const absSeconds = Math.abs(diffInSeconds);

  if (absSeconds < 60) {
    return fallbackLabel;
  }

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
    case "adoption_info_response":
      return {
        title: translate("types.adoption_info_response.title"),
        body: translate("types.adoption_info_response.body"),
      };
    default:
      return {
        title: translate("types.unknown.title"),
        body: translate("types.unknown.body"),
      };
  }
};

export function NotificationItem({ notification, onSelect }: NotificationItemProps) {
  const t = useTranslations("notifications");
  const locale = useLocale();
  const { title, body } = resolveNotificationCopy(notification, (key) => t(key as never));
  const relativeTime = buildRelativeTime(notification.createdAt, locale, t("time.justNow"));
  const isUnread = !notification.readAt;

  return (
    <ListItemButton
      onClick={() => onSelect(notification)}
      className={`flex items-start gap-3 rounded-xl border border-transparent px-3 py-2 text-left hover:border-neutral-100 hover:bg-neutral-50 ${
        isUnread ? "bg-brand-50/40" : "bg-transparent"
      }`}
    >
      <Box className="mt-2 h-2 w-2 min-w-[8px] rounded-full" sx={{ bgcolor: isUnread ? "primary.main" : "transparent" }} />
      <Box className="flex flex-1 flex-col gap-1">
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            display: "-webkit-box",
            overflow: "hidden",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {body}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.disabled" }}>
          {relativeTime}
        </Typography>
      </Box>
    </ListItemButton>
  );
}
