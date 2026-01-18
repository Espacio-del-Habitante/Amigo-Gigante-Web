"use client";

import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { Badge, Box, IconButton, List, Popover, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { useMemo, useState } from "react";

import type { Notification } from "@/domain/models/Notification";
import { NotificationItem } from "@/presentation/components/molecules/NotificationItem/NotificationItem";
import { useNotifications } from "@/presentation/hooks/useNotifications";
import { buildNotificationLink } from "@/presentation/utils/notificationUtils";

export function NotificationBell() {
  const t = useTranslations("notifications");
  const locale = useLocale();
  const router = useRouter();
  const { notifications, unreadCount, markAsRead } = useNotifications({ limit: 15 });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const hasNotifications = notifications.length > 0;

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = async (notification: Notification) => {
    if (!notification.readAt) {
      await markAsRead(notification.id);
    }

    const link = buildNotificationLink(locale, notification);
    if (link) {
      router.push(link);
    }

    handleClose();
  };

  const badgeContent = useMemo(() => (unreadCount > 0 ? unreadCount : 0), [unreadCount]);

  return (
    <>
      <IconButton aria-label={t("bell.ariaLabel")} onClick={handleOpen}>
        <Badge
          color="primary"
          overlap="circular"
          badgeContent={badgeContent}
          invisible={unreadCount === 0}
        >
          <NotificationsNoneRoundedIcon />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          className: "mt-2 w-[320px] max-w-[90vw] rounded-2xl border border-neutral-100 shadow-soft",
        }}
      >
        <Box className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t("menu.title")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("menu.unread", { count: unreadCount })}
          </Typography>
        </Box>
        <Box className="max-h-[360px] overflow-y-auto px-2 py-2">
          {hasNotifications ? (
            <List className="flex flex-col gap-2">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onSelect={handleSelect}
                />
              ))}
            </List>
          ) : (
            <Box className="flex flex-col gap-2 px-4 py-6 text-center">
              <Typography variant="body2" color="text.secondary">
                {t("menu.empty")}
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
}
