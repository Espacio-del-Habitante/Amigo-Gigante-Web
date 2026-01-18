export interface Notification {
  id: string;
  userId: string;
  actorUserId: string | null;
  title: string;
  body: string | null;
  type: string;
  data: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}
