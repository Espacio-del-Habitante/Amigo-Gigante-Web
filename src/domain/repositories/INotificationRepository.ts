import type { Notification } from "@/domain/models/Notification";

export interface INotificationRepository {
  getNotifications(userId: string, limit: number): Promise<Notification[]>;
  markAsRead(userId: string, notificationId: string): Promise<void>;
}
