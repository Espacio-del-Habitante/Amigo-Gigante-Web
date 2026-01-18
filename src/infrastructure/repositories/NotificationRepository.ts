import type { PostgrestError } from "@supabase/supabase-js";

import type { Notification } from "@/domain/models/Notification";
import type { INotificationRepository } from "@/domain/repositories/INotificationRepository";
import { supabaseClient } from "@/infrastructure/config/supabase";

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

export class NotificationRepository implements INotificationRepository {
  async getNotifications(userId: string, limit: number): Promise<Notification[]> {
    const { data, error } = await supabaseClient
      .from("notifications")
      .select("id, user_id, actor_user_id, title, body, type, data, read_at, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<NotificationRow[]>();

    if (error) {
      throw new Error(this.translateNotificationError(error));
    }

    return (data ?? []).map((row) => this.toDomain(row));
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const { data, error } = await supabaseClient
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(this.translateNotificationError(error));
    }

    if (!data) {
      throw new Error("errors.unauthorized");
    }
  }

  private toDomain(row: NotificationRow): Notification {
    return {
      id: row.id,
      userId: row.user_id,
      actorUserId: row.actor_user_id,
      title: row.title,
      body: row.body ?? null,
      type: row.type,
      data: row.data ?? {},
      readAt: row.read_at ?? null,
      createdAt: row.created_at,
    };
  }

  private translateNotificationError(error: PostgrestError): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("permission") || message.includes("row level")) {
      return "errors.unauthorized";
    }

    if (message.includes("connection") || message.includes("network")) {
      return "errors.connection";
    }

    return "errors.generic";
  }
}
