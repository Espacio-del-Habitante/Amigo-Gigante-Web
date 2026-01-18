"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { RealtimeChannel } from "@supabase/supabase-js";

import type { Notification } from "@/domain/models/Notification";
import { GetNotificationsUseCase } from "@/domain/usecases/notifications/GetNotificationsUseCase";
import { MarkNotificationAsReadUseCase } from "@/domain/usecases/notifications/MarkNotificationAsReadUseCase";
import { supabaseClient } from "@/infrastructure/config/supabase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { useAuth } from "@/presentation/hooks/useAuth";

interface NotificationRow {
  id: string;
  user_id: string;
  actor_user_id: string | null;
  title: string;
  body: string | null;
  type: string;
  data: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
}

interface UseNotificationsOptions {
  limit?: number;
}

interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
}

const toDomainNotification = (row: NotificationRow): Notification => ({
  id: row.id,
  userId: row.user_id,
  actorUserId: row.actor_user_id,
  title: row.title,
  body: row.body ?? null,
  type: row.type,
  data: row.data ?? {},
  readAt: row.read_at ?? null,
  createdAt: row.created_at,
});

export const useNotifications = (options: UseNotificationsOptions = {}): UseNotificationsResult => {
  const { user } = useAuth();
  const limit = options.limit ?? 15;

  const getNotificationsUseCase = useMemo(
    () => appContainer.get<GetNotificationsUseCase>(USE_CASE_TYPES.GetNotificationsUseCase),
    [],
  );
  const markNotificationAsReadUseCase = useMemo(
    () => appContainer.get<MarkNotificationAsReadUseCase>(USE_CASE_TYPES.MarkNotificationAsReadUseCase),
    [],
  );

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await getNotificationsUseCase.execute(limit);
      setNotifications(result);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [getNotificationsUseCase, limit, user?.id]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!user?.id) return;

      await markNotificationAsReadUseCase.execute(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, readAt: notification.readAt ?? new Date().toISOString() }
            : notification,
        ),
      );
    },
    [markNotificationAsReadUseCase, user?.id],
  );

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!user?.id) return undefined;

    const channel: RealtimeChannel = supabaseClient
      .channel(`notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new as NotificationRow;
          if (!row || row.user_id !== user.id) return;

          const nextNotification = toDomainNotification(row);

          setNotifications((prev) => {
            const withoutDuplicate = prev.filter((item) => item.id !== nextNotification.id);
            return [nextNotification, ...withoutDuplicate].slice(0, limit);
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new as NotificationRow;
          if (!row || row.user_id !== user.id) return;

          const nextNotification = toDomainNotification(row);

          setNotifications((prev) =>
            prev.map((item) => (item.id === nextNotification.id ? nextNotification : item)),
          );
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [limit, user?.id]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.readAt).length,
    [notifications],
  );

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
  };
};
