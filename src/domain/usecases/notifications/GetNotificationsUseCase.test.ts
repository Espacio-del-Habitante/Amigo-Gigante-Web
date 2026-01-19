import assert from "node:assert/strict";
import { test } from "node:test";

import type { Notification } from "@/domain/models/Notification";
import type { CreateProfileParams, IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { INotificationRepository } from "@/domain/repositories/INotificationRepository";
import { GetNotificationsUseCase } from "@/domain/usecases/notifications/GetNotificationsUseCase";

const buildNotification = (id: string): Notification => ({
  id,
  userId: "user-1",
  actorUserId: null,
  title: "Title",
  body: "Body",
  type: "adoption_request_created",
  data: {},
  readAt: null,
  createdAt: new Date().toISOString(),
});

test("GetNotificationsUseCase returns notifications for authenticated user", async () => {
  const authRepository: IAuthRepository = {
    signUp: async () => ({ session: null, user: { id: "user-1", email: "test@example.com", role: "foundation_user" } }),
    signIn: async () => ({ session: null, user: { id: "user-1", email: "test@example.com", role: "foundation_user" } }),
    getSession: async () => ({
      accessToken: "token",
      user: { id: "user-1", email: "test@example.com", role: "foundation_user" },
    }),
    createProfile: async (_params: CreateProfileParams) => {},
  };

  const notificationRepository: INotificationRepository = {
    getNotifications: async () => [buildNotification("n-1"), buildNotification("n-2")],
    markAsRead: async () => {},
  };

  const useCase = new GetNotificationsUseCase(notificationRepository, authRepository);
  const result = await useCase.execute(10);

  assert.equal(result.length, 2);
  assert.equal(result[0].id, "n-1");
});
